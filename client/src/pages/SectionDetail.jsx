import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import BackButton from "../components/BackButton.jsx";

const SectionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [section, setSection] = useState(null);
  const [writers, setWriters] = useState([]);
  const [selectedWriter, setSelectedWriter] = useState("");

  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [articles, setArticles] = useState([]);
const [articlesLoading, setArticlesLoading] = useState(true);

  // ==========================================
  // FETCH SECTION
  // ==========================================

  const fetchSection = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/sections/${id}`);

      setSection(response.data.section);
    } catch (err) {
      console.error("Fetch section error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load section."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH WRITERS
  // ==========================================

  const fetchWriters = async () => {
    try {
      const response = await api.get("/users/writers");

      setWriters(response.data.users || []);
    } catch (err) {
      console.error("Fetch writers error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load writers."
      );
    }
  };

  const fetchArticles = async () => {
  try {
    setArticlesLoading(true);

    const response = await api.get(
      `/articles?section=${id}`
    );

    setArticles(response.data.articles || []);
  } catch (err) {
    console.error("Fetch articles error:", err);

    setError(
      err.response?.data?.message ||
        "Failed to load section articles."
    );
  } finally {
    setArticlesLoading(false);
  }
};

  useEffect(() => {
    fetchSection();
    fetchWriters();
     fetchArticles();
  }, [id]);

  // ==========================================
  // ASSIGN WRITER
  // ==========================================

  const handleAssignWriter = async () => {
    if (!selectedWriter) {
      setError("Please select a writer.");
      return;
    }

    try {
      setAssigning(true);
      setError("");
      setSuccess("");

      const response = await api.post(
        `/sections/${id}/writers/${selectedWriter}`
      );

      setSection(response.data.section);

      setSelectedWriter("");

      setSuccess("Writer assigned successfully.");
    } catch (err) {
      console.error("Assign writer error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to assign writer."
      );
    } finally {
      setAssigning(false);
    }
  };

  // ==========================================
  // REMOVE WRITER
  // ==========================================

  const handleRemoveWriter = async (writerId) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this writer from the section?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const response = await api.delete(
        `/sections/${id}/writers/${writerId}`
      );

      setSection(response.data.section);

      setSuccess("Writer removed successfully.");
    } catch (err) {
      console.error("Remove writer error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to remove writer."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">
          Loading section...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR / NO SECTION
  // ==========================================

  if (!section) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-5xl">

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <BackButton label="Back to Sections" />

        </div>
      </div>
    );
  }

  // ==========================================
  // GET ASSIGNED WRITER IDS
  // ==========================================

  const assignedWriterIds =
    section.writers?.map((writer) =>
      writer._id.toString()
    ) || [];

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ======================================
          HEADER
      ====================================== */}

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Manage Section
            </h1>

            <p className="text-sm text-gray-500">
              Editorial Workflow
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              section.archived
                ? "bg-gray-100 text-gray-600"
                : "bg-green-100 text-green-700"
            }`}
          >
            {section.archived
              ? "ARCHIVED"
              : "ACTIVE"}
          </span>

        </div>
      </header>



      {/* ======================================
          MAIN
      ====================================== */}

      <main className="mx-auto max-w-5xl px-6 py-8">

        {/* Back */}

        <div className="mb-6">
          <BackButton label="Back to Sections" />
        </div>

        {/* Error */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success */}

        {success && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* ====================================
            SECTION INFORMATION
        ==================================== */}

        <section className="rounded-xl border bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Section
              </p>

              <h2 className="mt-1 text-2xl font-bold text-gray-900">
                {section.name}
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
                {section.description}
              </p>
            </div>

          </div>

          {/* Owner */}

          <div className="mt-6 border-t pt-5">

            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Section Owner
            </p>

            <p className="mt-1 text-sm font-medium text-gray-800">
              {section.owner?.name ||
                section.owner?.email ||
                "Unknown"}
            </p>

            {section.owner?.email && (
              <p className="mt-1 text-xs text-gray-500">
                {section.owner.email}
              </p>
            )}

          </div>

        </section>

        {/* ====================================
            ASSIGN WRITER
        ==================================== */}

        {!section.archived && (
          <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-gray-900">
              Assign Writer
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Assign a writer to this editorial section.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">

              <select
                value={selectedWriter}
                onChange={(event) =>
                  setSelectedWriter(event.target.value)
                }
                disabled={assigning}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:bg-gray-100"
              >

                <option value="">
                  Select writer
                </option>

                {writers
                  .filter(
                    (writer) =>
                      !assignedWriterIds.includes(
                        writer._id.toString()
                      )
                  )
                  .map((writer) => (
                    <option
                      key={writer._id}
                      value={writer._id}
                    >
                      {writer.name || writer.email}
                    </option>
                  ))}

              </select>

              <button
                type="button"
                onClick={handleAssignWriter}
                disabled={assigning || !selectedWriter}
                className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {assigning
                  ? "Assigning..."
                  : "Assign Writer"}
              </button>

            </div>

          </section>
        )}

        {/* ====================================
            ASSIGNED WRITERS
        ==================================== */}

        <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Assigned Writers
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Writers currently assigned to this section.
              </p>
            </div>

            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
              {section.writers?.length || 0}
            </span>

          </div>

          {/* No writers */}

          {!section.writers ||
          section.writers.length === 0 ? (
            <div className="mt-5 rounded-lg border border-dashed border-gray-300 p-8 text-center">

              <p className="text-sm text-gray-500">
                No writers are currently assigned.
              </p>

            </div>
          ) : (
            <div className="mt-5 space-y-3">

              {section.writers.map((writer) => (
                <div
                  key={writer._id}
                  className="flex flex-col gap-3 rounded-lg border border-gray-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                >

                  <div>

                    <p className="text-sm font-semibold text-gray-900">
                      {writer.name || "Unnamed Writer"}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {writer.email}
                    </p>

                  </div>

                  {!section.archived && (
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveWriter(writer._id)
                      }
                      className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
                    >
                      Remove
                    </button>
                  )}

                </div>
              ))}

            </div>
          )}

        </section>

        {/* ====================================
    SECTION ARTICLES
==================================== */}

<section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">

  <div className="flex items-center justify-between">

    <div>
      <h2 className="text-lg font-semibold text-gray-900">
        Articles
      </h2>

      <p className="mt-1 text-sm text-gray-500">
        Articles published or created in this section.
      </p>
    </div>

    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
      {articles.length}
    </span>

  </div>

  {articlesLoading ? (
    <div className="mt-5 rounded-lg border p-6 text-center">
      <p className="text-sm text-gray-500">
        Loading articles...
      </p>
    </div>
  ) : articles.length === 0 ? (
    <div className="mt-5 rounded-lg border border-dashed border-gray-300 p-8 text-center">
      <p className="text-sm text-gray-500">
        No articles in this section.
      </p>
    </div>
  ) : (
    <div className="mt-5 overflow-x-auto">

      <table className="min-w-full divide-y divide-gray-200">

        <thead className="bg-gray-50">
          <tr>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
              Article
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
              Author
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">
              Status
            </th>

            <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">
              Action
            </th>

          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">

          {articles.map((article) => (

            <tr key={article._id}>

              <td className="px-4 py-4">

                <p className="font-medium text-gray-900">
                  {article.title}
                </p>

                {article.summary && (
                  <p className="mt-1 max-w-md truncate text-xs text-gray-500">
                    {article.summary}
                  </p>
                )}

              </td>

              <td className="px-4 py-4 text-sm text-gray-600">
                {article.author?.name ||
                  article.author?.email ||
                  "—"}
              </td>

              <td className="px-4 py-4">

                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                  {article.status}
                </span>

              </td>

              <td className="px-4 py-4 text-right">

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/articles/${article._id}`)
                  }
                  className="rounded-md border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  View
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  )}

</section>

      </main>
    </div>
  );
};

export default SectionDetail;