import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../services/api";

const ArticleEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    section: "",
    content: "",
  });

  const [status, setStatus] = useState("DRAFT");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // FETCH ARTICLE WHEN EDITING
  // ==========================================
  useEffect(() => {
    if (!isEditing) return;

    const fetchArticle = async () => {
      try {
        setFetching(true);
        setError("");

        const response = await api.get(`/articles/${id}`);

        const article = response.data.article;

        // Make sure writer owns this article
        if (
          article.author?._id &&
          article.author._id.toString() !== user?._id?.toString()
        ) {
          setError("You do not have permission to edit this article.");
          return;
        }

        // Only these statuses can be edited
        if (
          article.status !== "DRAFT" &&
          article.status !== "CHANGES_REQUESTED"
        ) {
          setError(
            `This article cannot be edited because its status is ${article.status}.`
          );
          return;
        }

        setFormData({
          title: article.title || "",
          summary: article.summary || "",
          section: article.section || "",
          content: article.content || "",
        });

        setStatus(article.status);
      } catch (err) {
        console.error("Fetch article error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to load article."
        );
      } finally {
        setFetching(false);
      }
    };

    fetchArticle();
  }, [id, isEditing, user]);

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
  // VALIDATE FORM
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
  // SAVE ARTICLE
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

      let response;

      if (isEditing) {
        response = await api.patch(`/articles/${id}`, formData);
      } else {
        response = await api.post("/articles", formData);
      }

      const article = response.data.article;

      setSuccess(
        isEditing
          ? "Article updated successfully."
          : "Article saved as draft successfully."
      );

      // If creating a new article,
      // update URL to edit mode.
      if (!isEditing) {
        navigate(`/articles/${article._id}/edit`, {
          replace: true,
        });
      }

      setStatus(article.status);
    } catch (err) {
      console.error("Save article error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save article."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SUBMIT ARTICLE
  // ==========================================
  const handleSubmit = async () => {
    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    // New article must first be saved
    if (!id) {
      try {
        setLoading(true);
        setError("");
        setSuccess("");

        const createResponse = await api.post(
          "/articles",
          formData
        );

        const article = createResponse.data.article;

        const submitResponse = await api.post(
          `/articles/${article._id}/submit`
        );

        setStatus(submitResponse.data.article.status);

        setSuccess(
          "Article submitted for review successfully."
        );

        navigate(`/articles/${article._id}/edit`, {
          replace: true,
        });
      } catch (err) {
        console.error("Submit article error:", err);

        setError(
          err.response?.data?.message ||
            "Failed to submit article."
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    // Existing article
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // First save latest changes
      await api.patch(`/articles/${id}`, formData);

      // Then submit
      const response = await api.post(
        `/articles/${id}/submit`
      );

      setStatus(response.data.article.status);

      setSuccess(
        "Article submitted for review successfully."
      );
    } catch (err) {
      console.error("Submit article error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to submit article."
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
          Loading article...
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
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {isEditing
                ? "Edit Article"
                : "Create Article"}
            </h1>

            <p className="text-sm text-gray-500">
              Editorial Workflow
            </p>
          </div>

          {/* Status */}
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              status === "DRAFT"
                ? "bg-gray-100 text-gray-700"
                : status === "CHANGES_REQUESTED"
                ? "bg-orange-100 text-orange-700"
                : status === "SUBMITTED"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {status}
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
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
              placeholder="Enter article title"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
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
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            >
              <option value="">
                Select section
              </option>

              <option value="Politics">
                Politics
              </option>

              <option value="Culture">
                Culture
              </option>

              <option value="Technology">
                Technology
              </option>

              <option value="Sports">
                Sports
              </option>

              <option value="Business">
                Business
              </option>
            </select>
          </div>

          {/* Summary */}
          <div className="mb-6">
            <label
              htmlFor="summary"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Summary
            </label>

            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleChange}
              placeholder="Write a short summary..."
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            />
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
              placeholder="Write your article..."
              rows={16}
              className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm leading-6 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              disabled={loading}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <div className="flex flex-col gap-3 sm:flex-row">
              {/* Save Draft */}
              {(status === "DRAFT" ||
                status === "CHANGES_REQUESTED") && (
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "Saving..."
                    : "Save Draft"}
                </button>
              )}

              {/* Submit */}
              {(status === "DRAFT" ||
                status === "CHANGES_REQUESTED") && (
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
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ArticleEditor;