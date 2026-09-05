
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
      console.error("Submit revision error:", err);

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
      <div className="min-h-screen bg-paper font-sans text-ink antialiased">
        <div className="h-[3px] bg-press" />

        <div className="mx-auto flex min-h-[calc(100vh-3px)] max-w-6xl items-center justify-center px-6">
          <div className="text-center">
            <p className="font-serif text-2xl text-ink">
              Loading revision
            </p>

            <div className="mx-auto mt-4 h-px w-16 bg-press" />

            <p className="mt-3 text-sm text-muted">
              Preparing the editorial workspace...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!revision) {
    return (
      <div className="min-h-screen bg-paper font-sans text-ink antialiased">
        <div className="h-[3px] bg-press" />

        <main className="mx-auto max-w-6xl px-6 py-12">
          <div className="border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error || "Revision not found."}
          </div>

          <div className="mt-6">
            <BackButton />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper font-sans text-ink antialiased">
      <div className="h-[3px] bg-press" />

      {/* Header */}
      <header className="border-b border-hairline">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-press">
              Editorial Workflow
            </p>

            <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight">
              Edit Revision
            </h1>
          </div>

          <span
            className={`border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
              revision.status === "DRAFT"
                ? "border-hairline bg-white text-muted"
                : revision.status === "SUBMITTED"
                ? "border-yellow-300 bg-yellow-50 text-yellow-800"
                : revision.status === "APPROVED"
                ? "border-green-300 bg-green-50 text-green-800"
                : revision.status === "SCHEDULED"
                ? "border-purple-300 bg-purple-50 text-purple-800"
                : "border-blue-300 bg-blue-50 text-blue-800"
            }`}
          >
            {revision.status}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Back */}
        <div className="mb-8">
          <BackButton />
        </div>

        {/* Page Intro */}
        <div className="mb-8 border-b border-hairline pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Revision Workspace
          </p>

          <h2 className="mt-2 max-w-4xl font-serif text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
            Refine the article before sending it back for review.
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            Update the revision details, make your editorial changes,
            then save or submit the revised article for review.
          </p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-5 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <span className="font-semibold">Error:</span>{" "}
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            <span className="font-semibold">Success:</span>{" "}
            {success}
          </div>
        )}

        {/* Editor */}
        <section className="border border-hairline bg-white">
          {/* Section Heading */}
          <div className="border-b border-hairline px-6 py-5 md:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-press">
              Revision Editor
            </p>

            <h3 className="mt-1 font-serif text-2xl font-semibold">
              Article Details
            </h3>
          </div>

          <div className="space-y-7 px-6 py-7 md:px-8">
            {/* Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted"
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
                className="w-full border border-hairline bg-paper px-4 py-3 font-serif text-xl text-ink outline-none transition focus:border-press disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-muted"
              />
            </div>

            {/* Section */}
            <div>
              <label
                htmlFor="section"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-muted"
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
                className="w-full border border-hairline bg-paper px-4 py-3 text-sm text-ink outline-none transition focus:border-press disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-muted"
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
            <div>
              <div className="mb-2 flex items-end justify-between gap-4">
                <label
                  htmlFor="content"
                  className="block text-xs font-semibold uppercase tracking-[0.12em] text-muted"
                >
                  Article Content
                </label>

                <span className="text-xs text-muted">
                  Editorial copy
                </span>
              </div>

              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                disabled={revision.status !== "DRAFT"}
                rows={18}
                placeholder="Edit your revision..."
                className="w-full resize-y border border-hairline bg-paper px-5 py-4 font-serif text-base leading-7 text-ink outline-none transition placeholder:text-muted/70 focus:border-press disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-muted"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={loading}
                className="border border-hairline bg-white px-5 py-2.5 text-sm font-medium text-ink transition hover:border-ink hover:bg-paper disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              {revision.status === "DRAFT" && (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={loading}
                    className="border border-ink px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-ink hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading
                      ? "Saving..."
                      : "Save Revision"}
                  </button>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-press px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading
                      ? "Submitting..."
                      : "Submit for Review"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <div className="mt-6 border-t border-hairline pt-4">
          <p className="text-xs leading-5 text-muted">
            Revision status controls whether the editorial fields can
            be modified. Draft revisions can be saved or submitted for
            review.
          </p>
        </div>
      </main>
    </div>
  );
};

export default RevisionEditor;
