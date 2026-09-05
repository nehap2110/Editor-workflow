
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

  
  // FETCH ARTICLE
  
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

  
  // REQUEST CHANGES
  
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

      setSuccess("Changes requested successfully.");
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

  
  // APPROVE ARTICLE
  
  const handleApprove = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this article?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);
      setError("");
      setSuccess("");

      const response = await api.post(
        `/articles/${id}/approve`
      );

      setArticle(response.data.article);

      setSuccess("Article approved successfully.");
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

  
  // LOADING
  
  if (loading) {
    return (
      <div className="min-h-screen bg-paper font-sans text-ink">
        <div className="h-[3px] bg-press" />

        <div className="flex min-h-[calc(100vh-3px)] items-center justify-center">
          <div className="text-center">
            <p className="font-serif text-2xl text-ink">
              Loading article
            </p>
            <p className="mt-2 text-sm text-muted">
              Preparing the editorial review...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ERROR / NO ARTICLE
  
  if (error && !article) {
    return (
      <div className="min-h-screen bg-paper font-sans text-ink">
        <div className="h-[3px] bg-press" />

        <main className="mx-auto max-w-5xl px-6 py-12">
          <div className="border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>

          <button
            onClick={() => navigate("/editor/review")}
            className="mt-5 border border-hairline bg-white px-5 py-2.5 text-sm font-medium text-ink transition hover:border-press hover:text-press"
          >
            ← Back to Review Queue
          </button>
        </main>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  const sectionName =
    typeof article.section === "object"
      ? article.section?.name
      : article.section;

  const authorName =
    article.author?.name ||
    article.author?.email ||
    "Unknown";

  return (
    <div className="min-h-screen bg-paper font-sans text-ink antialiased">
      {/* Top editorial rule */}
      <div className="h-[3px] bg-press" />

      
      {/* HEADER */}
      

      <header className="border-b border-hairline bg-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-press">
              Editorial Workflow
            </p>

            <h1 className="mt-1 font-serif text-2xl font-semibold tracking-tight text-ink">
              Review Article
            </h1>
          </div>

          <span className="border border-hairline bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
            {article.status}
          </span>
        </div>
      </header>

      
      {/* MAIN */}


      <main className="mx-auto max-w-5xl px-6 py-10">
        {/* Alerts */}
        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            {success}
          </div>
        )}

    
        {/* ARTICLE */}
        

        <article className="border-y border-hairline bg-paper">
          {/* Article header */}
          <div className="border-b border-hairline py-8">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-press">
              {sectionName || "Unknown Section"}
            </p>

            <h2 className="max-w-4xl font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-ink md:text-5xl">
              {article.title}
            </h2>

            {/* Author / dates */}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted">
              <span>
                By{" "}
                <span className="font-medium text-ink">
                  {authorName}
                </span>
              </span>

              {article.createdAt && (
                <span>
                  Created{" "}
                  {new Date(
                    article.createdAt
                  ).toLocaleDateString()}
                </span>
              )}

              {article.submittedAt && (
                <span>
                  Submitted{" "}
                  {new Date(
                    article.submittedAt
                  ).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>

          {/* Summary */}
          {article.summary && (
            <div className="border-b border-hairline py-7">
              <div className="border-l-[3px] border-press pl-5">
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  Summary
                </p>

                <p className="max-w-3xl font-serif text-lg leading-8 text-ink">
                  {article.summary}
                </p>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="py-9">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Article Content
            </p>

            <div className="max-w-4xl whitespace-pre-wrap font-serif text-lg leading-9 text-ink">
              {article.content}
            </div>
          </div>
        </article>

        
        {/* EDITOR ACTIONS */}
      

        {article.status === "SUBMITTED" && (
          <section className="mt-10 border-t-2 border-ink pt-7">
            <div className="flex flex-col justify-between gap-3 border-b border-hairline pb-5 md:flex-row md:items-end">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-press">
                  Editorial Decision
                </p>

                <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">
                  Review & Decision
                </h2>
              </div>

              <p className="max-w-md text-sm leading-6 text-muted md:text-right">
                Review the submitted article and either request
                revisions or approve it for the next stage.
              </p>
            </div>

            {/* Feedback */}
            <div className="mt-7">
              <label
                htmlFor="feedback"
                className="mb-2 block text-sm font-semibold text-ink"
              >
                Feedback for Writer
              </label>

              <textarea
                id="feedback"
                value={feedback}
                onChange={(event) =>
                  setFeedback(event.target.value)
                }
                rows={6}
                placeholder="Explain what the writer should change..."
                className="w-full resize-y border border-hairline bg-white px-4 py-3 font-sans text-sm leading-6 text-ink outline-none transition placeholder:text-muted focus:border-press focus:ring-1 focus:ring-press"
              />
            </div>

            {/* Buttons */}
            <div className="mt-5 flex flex-col gap-3 border-t border-hairline pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleRequestChanges}
                disabled={actionLoading}
                className="border border-press px-6 py-3 text-sm font-semibold text-press transition hover:bg-press hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading
                  ? "Processing..."
                  : "Request Changes"}
              </button>

              <button
                type="button"
                onClick={handleApprove}
                disabled={actionLoading}
                className="bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-press disabled:cursor-not-allowed disabled:opacity-50"
              >
                {actionLoading
                  ? "Processing..."
                  : "Approve Article"}
              </button>
            </div>
          </section>
        )}

        
        {/* EXISTING FEEDBACK */}
        

        {article.editorFeedback && (
          <section className="mt-10 border-l-[3px] border-press bg-white px-6 py-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-press">
              Editor Feedback
            </p>

            <p className="mt-3 whitespace-pre-wrap font-serif text-base leading-7 text-ink">
              {article.editorFeedback}
            </p>
          </section>
        )}

        
        {/* BACK */}
        

        <div className="mt-10 border-t border-hairline pt-6">
          <button
            onClick={() => navigate("/editor/review")}
            className="text-sm font-semibold text-muted transition hover:text-press"
          >
            ← Back to Review Queue
          </button>
        </div>
      </main>
    </div>
  );
};

export default EditorReviewArticle;

