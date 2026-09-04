import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import BackButton from "../components/BackButton.jsx";

const RevisionEditor = () => {
  const { revisionId } = useParams();
  const navigate = useNavigate();

  const [revision, setRevision] = useState(null);
  const [sections, setSections] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    section: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [sectionsLoading, setSectionsLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // FETCH REVISION
  // ==========================================

  useEffect(() => {
    const fetchRevision = async () => {
      try {
        setFetching(true);
        setError("");

        /*
         * There is currently no GET revision endpoint
         * in your article controller.
         *
         * So we will add that backend endpoint next.
         */
        const response = await api.get(
          `/articles/revisions/${revisionId}`
        );

        const data = response.data.revision;

        setRevision(data);

        setFormData({
          title: data.title || "",
          content: data.content || "",
          section:
            typeof data.section === "object"
              ? data.section._id
              : data.section || "",
        });
      } catch (err) {
        console.error("Fetch revision error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load revision."
        );
      } finally {
        setFetching(false);
      }
    };

    fetchRevision();
  }, [revisionId]);

  // ==========================================
  // FETCH SECTIONS
  // ==========================================

  useEffect(() => {
    const fetchSections = async () => {
      try {
        setSectionsLoading(true);

        const response = await api.get("/sections");

        setSections(response.data.sections || []);
      } catch (err) {
        console.error("Fetch sections error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load sections."
        );
      } finally {
        setSectionsLoading(false);
      }
    };

    fetchSections();
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
  // VALIDATION
  // ==========================================

  const validateForm = () => {
    if (!formData.title.trim()) {
      return "Title is required.";
    }

    if (!formData.content.trim()) {
      return "Content is required.";
    }

    if (!formData.section.trim()) {
      return "Section is required.";
    }

    return null;
  };

  // ==========================================
  // SAVE REVISION
  // ==========================================

  const handleSave = async () => {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await api.patch(
        `/articles/revisions/${revisionId}`,
        formData
      );

      setRevision(response.data.revision);

      setSuccess("Revision saved successfully.");
    } catch (err) {
      console.error("Save revision error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save revision."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SUBMIT REVISION
  // ==========================================

  const handleSubmit = async () => {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Save latest changes first
      await api.patch(
        `/articles/revisions/${revisionId}`,
        formData
      );

      // Then submit
      const response = await api.patch(
        `/articles/revisions/${revisionId}/submit`
      );

      setRevision(response.data.revision);

      setSuccess(
        "Revision submitted for review successfully."
      );

      setTimeout(() => {
        navigate("/articles/my");
      }, 800);
    } catch (err) {
      console.error(
        "Submit revision error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to submit revision."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (fetching) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">
          Loading revision...
        </p>
      </div>
    );
  }

  if (!revision) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error || "Revision not found."}
          </div>
        </div>
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
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">

          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Edit Revision
            </h1>

            <p className="text-sm text-gray-500">
              Editorial Workflow
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              revision.status === "DRAFT"
                ? "bg-gray-100 text-gray-700"
                : revision.status === "SUBMITTED"
                ? "bg-yellow-100 text-yellow-700"
                : revision.status === "APPROVED"
                ? "bg-green-100 text-green-700"
                : revision.status === "SCHEDULED"
                ? "bg-purple-100 text-purple-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {revision.status}
          </span>

        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">

        <BackButton />

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

        {/* Editor */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">

          {/* Title */}

          <div className="mb-6">
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              disabled={revision.status !== "DRAFT"}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Section */}

          <div className="mb-6">
            <label
              htmlFor="section"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Section
            </label>

            <select
              id="section"
              name="section"
              value={formData.section}
              onChange={handleChange}
              disabled={
                sectionsLoading ||
                revision.status !== "DRAFT"
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">
                {sectionsLoading
                  ? "Loading sections..."
                  : "Select section"}
              </option>

              {sections.map((section) => (
                <option
                  key={section._id}
                  value={section._id}
                >
                  {section.name}
                </option>
              ))}
            </select>
          </div>

          {/* Content */}

          <div className="mb-6">
            <label
              htmlFor="content"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Article Content
            </label>

            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              disabled={revision.status !== "DRAFT"}
              rows={16}
              placeholder="Edit your revision..."
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm leading-6 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          {/* Actions */}

          <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-between">

            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            {revision.status === "DRAFT" && (
              <div className="flex flex-col gap-3 sm:flex-row">

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : "Save Revision"}
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Submitting..."
                    : "Submit for Review"}
                </button>

              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
};

export default RevisionEditor;