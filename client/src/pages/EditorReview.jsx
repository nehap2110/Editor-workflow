
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import BackButton from "../components/BackButton.jsx";

const EditorReview = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/articles/review");

      setArticles(response.data.articles || []);
    } catch (err) {
      console.error("Failed to fetch review articles:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load articles for review"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-paper font-sans text-ink antialiased">
        <div className="h-[3px] bg-press" />

        <main className="mx-auto flex min-h-[80vh] max-w-6xl items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-hairline border-t-press" />
            <p className="text-sm text-muted">
              Loading articles for review...
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-paper font-sans text-ink antialiased">
        <div className="h-[3px] bg-press" />

        <main className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-8">
            <BackButton label="Back to Dashboard" />
          </div>

          <div className="border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper font-sans text-ink antialiased">
      {/* Editorial accent */}
      <div className="h-[3px] bg-press" />

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Back navigation */}
        <div className="mb-8">
          <BackButton label="Back to Dashboard" />
        </div>

        {/* Page heading */}
        <header className="mb-10 border-b border-hairline pb-7">
          <div className="mb-3 flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-press">
              Editorial Desk
            </span>

            <span className="h-px w-10 bg-hairline" />

            <span className="text-xs uppercase tracking-[0.14em] text-muted">
              Review Queue
            </span>
          </div>

          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="font-serif text-4xl font-semibold tracking-tight text-ink md:text-5xl">
                Articles for Review
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                Review articles submitted by writers before they move
                forward in the editorial workflow.
              </p>
            </div>

            <div className="border-l-2 border-press pl-4">
              <p className="text-2xl font-semibold text-ink">
                {articles.length}
              </p>
              <p className="text-xs uppercase tracking-[0.14em] text-muted">
                {articles.length === 1 ? "Article" : "Articles"} Pending
              </p>
            </div>
          </div>
        </header>

        {/* Empty state */}
        {articles.length === 0 ? (
          <div className="border border-hairline bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center border border-hairline text-xl text-muted">
              ✓
            </div>

            <h2 className="font-serif text-2xl font-semibold text-ink">
              No articles to review
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted">
              There are currently no submitted articles waiting for
              review.
            </p>

            <div className="mx-auto mt-6 h-px w-16 bg-press" />

            <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted">
              Review queue is clear
            </p>
          </div>
        ) : (
          <section className="border border-hairline bg-white">
            {/* Table heading */}
            <div className="flex flex-col gap-2 border-b border-hairline px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-serif text-xl font-semibold text-ink">
                  Submission Queue
                </h2>

                <p className="mt-1 text-sm text-muted">
                  Select an article to inspect and review its submission.
                </p>
              </div>

              <span className="self-start border border-hairline bg-paper px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
                {articles.length} Pending
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
                      Submitted
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
                      className="border-b border-hairline last:border-b-0 hover:bg-paper/70"
                    >
                      {/* Article */}
                      <td className="px-6 py-5 align-top">
                        <div className="max-w-md">
                          <div className="font-serif text-lg font-semibold leading-6 text-ink">
                            {article.title}
                          </div>

                          {article.summary && (
                            <div className="mt-1.5 truncate text-sm leading-5 text-muted">
                              {article.summary}
                            </div>
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
                      <td className="px-6 py-5 align-top text-sm text-ink">
                        {typeof article.section === "object"
                          ? article.section?.name
                          : article.section || "-"}
                      </td>

                      {/* Submitted */}
                      <td className="px-6 py-5 align-top text-sm text-muted">
                        {article.submittedAt
                          ? new Date(
                              article.submittedAt
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5 align-top">
                        <span className="inline-flex items-center gap-2 border border-[#D8B36A] bg-[#FFF8E8] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#8A681F]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#B78A2B]" />
                          {article.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-5 text-right align-top">
                        <button
                          onClick={() =>
                            navigate(
                              `/editor/review/${article._id}`
                            )
                          }
                          className="border border-press bg-press px-4 py-2 text-sm font-medium text-white transition hover:bg-[#8F2923]"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Footer note */}
        <div className="mt-6 flex items-center gap-3 text-xs text-muted">
          <span className="h-px w-8 bg-hairline" />
          <span>
            Editorial review queue
          </span>
          <span className="h-px flex-1 bg-hairline" />
        </div>
      </main>
    </div>
  );
};

export default EditorReview;

