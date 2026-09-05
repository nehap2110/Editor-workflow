
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import Navbar from "../components/Navbar.jsx";
import BackButton from "../components/BackButton.jsx";

const ScheduledArticles = () => {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState(null);
  const [unpublishingId, setUnpublishingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchScheduledArticles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/articles/scheduled");

      setArticles(response.data.articles || []);
    } catch (err) {
      console.error("Fetch scheduled articles error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load scheduled articles."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduledArticles();
  }, []);

  // ==========================================
  // PUBLISH NOW
  // ==========================================

  const handlePublish = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to publish this scheduled article now?"
    );

    if (!confirmed) return;

    try {
      setPublishingId(id);
      setError("");
      setSuccess("");

      const response = await api.post(
        `/articles/${id}/publish`
      );

      setSuccess(
        response.data.message ||
          "Article published successfully."
      );

      setArticles((prev) =>
        prev.filter((article) => article._id !== id)
      );
    } catch (err) {
      console.error("Publish scheduled article error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to publish article."
      );
    } finally {
      setPublishingId(null);
    }
  };

  // ==========================================
  // UNPUBLISH
  // ==========================================

  const handleUnpublish = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to unpublish this scheduled article?"
    );

    if (!confirmed) return;

    try {
      setUnpublishingId(id);
      setError("");
      setSuccess("");

      const response = await api.patch(
        `/articles/${id}/unpublish`
      );

      setSuccess(
        response.data.message ||
          "Article unpublished successfully."
      );

      setArticles((prev) =>
        prev.filter((article) => article._id !== id)
      );
    } catch (err) {
      console.error(
        "Unpublish scheduled article error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to unpublish article."
      );
    } finally {
      setUnpublishingId(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-paper font-sans text-ink antialiased">
        <div className="h-[3px] bg-press" />

        <Navbar />

        <div className="mx-auto flex min-h-[60vh] max-w-6xl items-center justify-center px-6">
          <div className="text-center">
            <p className="font-serif text-2xl">
              Loading scheduled articles
            </p>

            <div className="mx-auto mt-4 h-px w-16 bg-press" />

            <p className="mt-3 text-sm text-muted">
              Checking the publication schedule...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper font-sans text-ink antialiased">
      <div className="h-[3px] bg-press" />

      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Back */}
        <div className="mb-8">
          <BackButton label="Back to Dashboard" />
        </div>

        {/* Header */}
        <header className="border-b border-hairline pb-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-press">
                Publishing Desk
              </p>

              <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight md:text-5xl">
                Scheduled Articles
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                Articles scheduled for future publication.
                Review the queue and publish or return articles
                when needed.
              </p>
            </div>

            <div className="border-l-2 border-press pl-4">
              <p className="text-2xl font-semibold">
                {articles.length}
              </p>

              <p className="text-xs uppercase tracking-wider text-muted">
                Scheduled
              </p>
            </div>
          </div>
        </header>

        {/* Alerts */}
        <div className="mt-6 space-y-3">
          {error && (
            <div className="border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              <span className="font-semibold">Error:</span>{" "}
              {error}
            </div>
          )}

          {success && (
            <div className="border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
              <span className="font-semibold">Success:</span>{" "}
              {success}
            </div>
          )}
        </div>

        {/* Empty */}
        {articles.length === 0 ? (
          <section className="mt-8 border border-hairline bg-white px-6 py-16 text-center md:px-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-press">
              Publication Queue
            </p>

            <h2 className="mt-3 font-serif text-3xl font-semibold">
              No scheduled articles
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
              Articles scheduled for publication will appear
              here.
            </p>

            <button
              onClick={() => navigate("/editor/approved")}
              className="mt-7 bg-press px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Back to Approved Articles
            </button>
          </section>
        ) : (
          <section className="mt-8 overflow-hidden border border-hairline bg-white">
            {/* Table heading */}
            <div className="flex items-center justify-between border-b border-hairline px-6 py-4">
              <div>
                <p className="font-serif text-xl font-semibold">
                  Publication Queue
                </p>

                <p className="mt-1 text-xs text-muted">
                  Upcoming articles awaiting publication.
                </p>
              </div>

              <span className="hidden text-xs font-semibold uppercase tracking-wider text-muted sm:block">
                {articles.length} item
                {articles.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-hairline bg-paper">
                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Article
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Author
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Section
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Scheduled For
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {articles.map((article) => (
                    <tr
                      key={article._id}
                      className="border-b border-hairline last:border-b-0 hover:bg-paper/60"
                    >
                      {/* Article */}
                      <td className="px-6 py-5 align-top">
                        <div className="max-w-sm">
                          <p className="font-serif text-lg font-semibold leading-snug text-ink">
                            {article.title}
                          </p>

                          {article.summary && (
                            <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-muted">
                              {article.summary}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Author */}
                      <td className="px-6 py-5 align-top text-sm text-ink">
                        {article.author?.name ||
                          article.author?.email ||
                          "Unknown"}
                      </td>

                      {/* Section */}
                      <td className="px-6 py-5 align-top text-sm text-muted">
                        {article.section?.name ||
                          article.section ||
                          "Unknown"}
                      </td>

                      {/* Scheduled time */}
                      <td className="px-6 py-5 align-top">
                        <p className="text-sm font-medium text-ink">
                          {article.scheduledAt
                            ? new Date(
                                article.scheduledAt
                              ).toLocaleString()
                            : "-"}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5 align-top">
                        <span className="inline-flex border border-yellow-300 bg-yellow-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-yellow-800">
                          Scheduled
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5 align-top">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              handlePublish(article._id)
                            }
                            disabled={
                              publishingId ===
                                article._id ||
                              unpublishingId ===
                                article._id
                            }
                            className="bg-press px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {publishingId ===
                            article._id
                              ? "Publishing..."
                              : "Publish Now"}
                          </button>

                          <button
                            onClick={() =>
                              handleUnpublish(
                                article._id
                              )
                            }
                            disabled={
                              publishingId ===
                                article._id ||
                              unpublishingId ===
                                article._id
                            }
                            className="border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {unpublishingId ===
                            article._id
                              ? "Unpublishing..."
                              : "Unpublish"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Footer note */}
        {articles.length > 0 && (
          <div className="mt-5 border-t border-hairline pt-4">
            <p className="text-xs leading-5 text-muted">
              Scheduled articles can be published immediately or
              moved back from the scheduled queue.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ScheduledArticles;


