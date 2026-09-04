import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const EditorReviewArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [feedback, setFeedback] = useState("");

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // FETCH ARTICLE
  // ==========================================
  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(`/articles/${id}`);

      setArticle(response.data.article);
    } catch (err) {
      console.error("Fetch article error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load article."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticle();
  }, [id]);

  // ==========================================
  // REQUEST CHANGES
  // ==========================================
  const handleRequestChanges = async () => {
    if (!feedback.trim()) {
      setError("Please provide feedback before requesting changes.");
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const response = await api.post(
        `/articles/${id}/request-changes`,
        {
          feedback: feedback.trim(),
        }
      );

      setArticle(response.data.article);
      setFeedback("");

      setSuccess(
        "Changes requested successfully."
      );
    } catch (err) {
      console.error("Request changes error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to request changes."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // APPROVE ARTICLE
  // ==========================================
  const handleApprove = async () => {
    

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const response = await api.post(
        `/articles/${id}/approve`
      );

      setArticle(response.data.article);

      setSuccess(
        "Article approved successfully."
      );
    } catch (err) {
      console.error("Approve article error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to approve article."
      );
    } finally {
      setActionLoading(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">
          Loading article...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR / NO ARTICLE
  // ==========================================
  if (error && !article) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>

          <button
            onClick={() => navigate("/editor/review")}
            className="mt-4 rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700"
          >
            Back to Review Queue
          </button>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Review Article
            </h1>

            <p className="text-sm text-gray-500">
              Editorial Workflow
            </p>
          </div>

          <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
            {article.status}
          </span>
        </div>
      </header>

      {/* ====================================== */}
      {/* MAIN */}
      {/* ====================================== */}

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

        {/* ==================================== */}
        {/* ARTICLE */}
        {/* ==================================== */}

        <article className="rounded-xl border bg-white p-8 shadow-sm">
          {/* Section */}
          <div className="mb-3 text-sm font-medium text-gray-500">
           {article.section?.name || "-"}
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold leading-tight text-gray-900">
            {article.title}
          </h2>

          {/* Author / dates */}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
            <span>
              Author:{" "}
              <span className="font-medium text-gray-700">
                {article.author?.name ||
                  article.author?.email ||
                  "Unknown"}
              </span>
            </span>

            {article.createdAt && (
              <span>
                Created:{" "}
                {new Date(
                  article.createdAt
                ).toLocaleDateString()}
              </span>
            )}

            {article.submittedAt && (
              <span>
                Submitted:{" "}
                {new Date(
                  article.submittedAt
                ).toLocaleDateString()}
              </span>
            )}
          </div>

          {/* Summary */}
          {article.summary && (
            <div className="mt-8 rounded-lg bg-gray-50 p-5">
              <h3 className="mb-2 text-sm font-semibold text-gray-700">
                Summary
              </h3>

              <p className="text-sm leading-6 text-gray-600">
                {article.summary}
              </p>
            </div>
          )}

          {/* Content */}
          <div className="mt-8">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Article Content
            </h3>

            <div className="whitespace-pre-wrap text-base leading-8 text-gray-800">
              {article.content}
            </div>
          </div>
        </article>

        {/* ==================================== */}
        {/* EDITOR ACTIONS */}
        {/* ==================================== */}

        {article.status === "SUBMITTED" && (
          <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Editorial Decision
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Choose whether the article needs changes or is ready
              for approval.
            </p>

            {/* Feedback */}
            <div className="mt-6">
              <label
                htmlFor="feedback"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Feedback for Writer
              </label>

              <textarea
                id="feedback"
                value={feedback}
                onChange={(event) =>
                  setFeedback(event.target.value)
                }
                rows={5}
                placeholder="Explain what the writer should change..."
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm leading-6 outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
              />
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleRequestChanges}
                disabled={actionLoading}
                className="rounded-lg border border-orange-300 px-5 py-2.5 text-sm font-medium text-orange-700 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading
                  ? "Processing..."
                  : "Request Changes"}
              </button>

              <button
                type="button"
                onClick={handleApprove}
                disabled={actionLoading}
                className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading
                  ? "Processing..."
                  : "Approve Article"}
              </button>
            </div>
          </section>
        )}

        {/* ==================================== */}
        {/* EXISTING FEEDBACK */}
        {/* ==================================== */}

        {article.editorFeedback && (
          <section className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-6">
            <h2 className="text-sm font-semibold text-orange-900">
              Editor Feedback
            </h2>

            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-orange-800">
              {article.editorFeedback}
            </p>
          </section>
        )}

        {/* Back */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/editor/review")}
            className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            ← Back to Review Queue
          </button>
        </div>
      </main>
    </div>
  );
};

export default EditorReviewArticle;