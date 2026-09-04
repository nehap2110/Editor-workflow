import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import BackButton from "../components/BackButton.jsx";

const SectionManagement = () => {
  const navigate = useNavigate();

  const [sections, setSections] = useState([]);
  const [editors, setEditors] = useState([]);

  const [showArchived, setShowArchived] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    owner: "",
  });

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // FETCH SECTIONS
  // ==========================================

  const fetchSections = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/sections${
          showArchived ? "?includeArchived=true" : ""
        }`
      );

      setSections(response.data.sections || []);
    } catch (err) {
      console.error("Fetch sections error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load sections."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // FETCH EDITORS
  // ==========================================

  const fetchEditors = async () => {
    try {
      /*
       * This endpoint depends on your existing User API.
       * We will connect the correct endpoint once we verify
       * your user controller/routes.
       */
      
      const response = await api.get("/users/editors");

      setEditors(response.data.users || []);
    } catch (err) {
      console.error("Fetch editors error:", err);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [showArchived]);

  useEffect(() => {
    fetchEditors();
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // ==========================================
  // CREATE SECTION
  // ==========================================

  const handleCreateSection = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      setError("Section name is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Section description is required.");
      return;
    }

    if (!formData.owner) {
      setError("Please select a section owner.");
      return;
    }

    try {
      setCreating(true);
      setError("");
      setSuccess("");

      const response = await api.post(
        "/sections",
        {
          name: formData.name.trim(),
          description: formData.description.trim(),
          owner: formData.owner,
        }
      );

      const createdSection = response.data.section;

      setSections((previous) => [
        createdSection,
        ...previous,
      ]);

      setFormData({
        name: "",
        description: "",
        owner: "",
      });

      setShowCreateForm(false);

      setSuccess(
        "Section created successfully."
      );
    } catch (err) {
      console.error("Create section error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to create section."
      );
    } finally {
      setCreating(false);
    }
  };

  // ==========================================
  // ARCHIVE
  // ==========================================

  const handleArchive = async (sectionId) => {
    const confirmed = window.confirm(
      "Are you sure you want to archive this section?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await api.patch(
        `/sections/${sectionId}/archive`
      );

      setSuccess(
        "Section archived successfully."
      );

      fetchSections();
    } catch (err) {
      console.error("Archive section error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to archive section."
      );
    }
  };

  // ==========================================
  // RESTORE
  // ==========================================

  const handleRestore = async (sectionId) => {
    try {
      setError("");
      setSuccess("");

      await api.patch(
        `/sections/${sectionId}/restore`
      );

      setSuccess(
        "Section restored successfully."
      );

      fetchSections();
    } catch (err) {
      console.error("Restore section error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to restore section."
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
          Loading sections...
        </p>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Section Management
            </h1>

            <p className="text-sm text-gray-500">
              Manage editorial sections and writers.
            </p>
          </div>

          <button
            onClick={() => {
              setShowCreateForm((previous) => !previous);
              setError("");
              setSuccess("");
            }}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            {showCreateForm
              ? "Cancel"
              : "+ Create Section"}
          </button>

        </div>
      </header>

      {/* Main */}

      <main className="mx-auto max-w-6xl px-6 py-8">

        <div className="mb-6">
          <BackButton label="Back to Dashboard" />
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

        {/* ====================================== */}
        {/* CREATE FORM */}
        {/* ====================================== */}

        {showCreateForm && (
          <section className="mb-6 rounded-xl border bg-white p-6 shadow-sm">

            <h2 className="text-lg font-semibold text-gray-900">
              Create New Section
            </h2>

            <form
              onSubmit={handleCreateSection}
              className="mt-6"
            >

              {/* Name */}

              <div className="mb-5">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Section Name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Technology"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                />
              </div>

              {/* Description */}

              <div className="mb-5">
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe this section..."
                  className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                />
              </div>

              {/* Owner */}

              <div className="mb-6">
                <label
                  htmlFor="owner"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Section Owner
                </label>

                <select
                  id="owner"
                  name="owner"
                  value={formData.owner}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                >
                  <option value="">
                    Select editor
                  </option>

                  {editors.map((editor) => (
                    <option
                      key={editor._id}
                      value={editor._id}
                    >
                      {editor.name || editor.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit */}

              <div className="flex justify-end">

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating
                    ? "Creating..."
                    : "Create Section"}
                </button>

              </div>

            </form>
          </section>
        )}

        {/* ====================================== */}
        {/* SECTION LIST HEADER */}
        {/* ====================================== */}

        <div className="mb-4 flex items-center justify-between">

          <h2 className="text-lg font-semibold text-gray-900">
            Sections
          </h2>

          <label className="flex items-center gap-2 text-sm text-gray-600">

            <input
              type="checkbox"
              checked={showArchived}
              onChange={(event) =>
                setShowArchived(event.target.checked)
              }
              className="h-4 w-4 rounded border-gray-300"
            />

            Show archived

          </label>

        </div>

        {/* ====================================== */}
        {/* EMPTY STATE */}
        {/* ====================================== */}

        {sections.length === 0 && (
          <div className="rounded-xl border bg-white p-10 text-center shadow-sm">

            <h3 className="text-lg font-semibold text-gray-900">
              No sections found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Create a section to start managing editorial
              assignments.
            </p>

          </div>
        )}

        {/* ====================================== */}
        {/* SECTION LIST */}
        {/* ====================================== */}

        {sections.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2">

            {sections.map((section) => (
              <div
                key={section._id}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {section.name}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      {section.description}
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

                {/* Owner */}

                <div className="mt-5 border-t pt-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Owner
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-700">
                    {section.owner?.name ||
                      section.owner?.email ||
                      "Unknown"}
                  </p>

                </div>

                {/* Writers */}

                <div className="mt-4">

                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Writers
                  </p>

                  {section.writers?.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-2">

                      {section.writers.map((writer) => (
                        <span
                          key={writer._id}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
                        >
                          {writer.name ||
                            writer.email}
                        </span>
                      ))}

                    </div>
                  ) : (
                    <p className="mt-1 text-sm text-gray-500">
                      No writers assigned.
                    </p>
                  )}

                </div>

                {/* Actions */}

                <div className="mt-6 flex flex-wrap gap-3 border-t pt-4">

                  {!section.archived && (
                    <>

                      <button
                        onClick={() =>
                          navigate(
                            `/editor/sections/${section._id}`
                          )
                        }
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Manage
                      </button>

                      <button
                        onClick={() =>
                          handleArchive(section._id)
                        }
                        className="rounded-md border border-orange-300 px-4 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50"
                      >
                        Archive
                      </button>

                    </>
                  )}

                  {section.archived && (
                    <button
                      onClick={() =>
                        handleRestore(section._id)
                      }
                      className="rounded-md border border-green-300 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
                    >
                      Restore
                    </button>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
};

export default SectionManagement;