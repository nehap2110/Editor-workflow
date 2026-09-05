
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import BackButton from "../components/BackButton.jsx";

const MyArticles = () => {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/articles/my");

      setArticles(response.data.articles || []);
    } catch (err) {
      console.error("Fetch articles error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load your articles."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "DRAFT":
        return "border-hairline bg-paper text-muted";

      case "SUBMITTED":
        return "border-amber-200 bg-amber-50 text-amber-800";

      case "CHANGES_REQUESTED":
        return "border-orange-200 bg-orange-50 text-orange-800";

      case "APPROVED":
        return "border-green-200 bg-green-50 text-green-800";

      case "PUBLISHED":
        return "border-blue-200 bg-blue-50 text-blue-800";

      default:
        return "border-hairline bg-paper text-muted";
    }
  };

  const handleArticleAction = (article) => {
    if (
      article.status === "DRAFT" ||
      article.status === "CHANGES_REQUESTED"
    ) {
      navigate(`/articles/${article._id}/edit`);
      return;
    }

    navigate(`/articles/${article._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-paper font-sans text-ink antialiased">
        <div className="h-[3px] bg-press" />

        <div className="flex min-h-[calc(100vh-3px)] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-hairline border-t-press" />
            <p className="text-sm text-muted">
              Loading your articles...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper font-sans text-ink antialiased">
      {/* Top accent */}
      <div className="h-[3px] bg-press" />

      {/* Header */}
      <header className="border-b border-hairline bg-paper">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5">
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-press">
              Editorial Workflow
            </p>

            <h1 className="font-serif text-3xl font-semibold tracking-tight text-ink">
              My Articles
            </h1>

            <p className="mt-1 text-sm text-muted">
              Manage your articles and track their editorial status.
            </p>
          </div>

          <button
            onClick={() => navigate("/articles/new")}
            className="shrink-0 border border-press bg-press px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#8f2b25]"
          >
            + New Article
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Back button */}
        <div className="mb-7">
          <BackButton label="Back to Dashboard" />
        </div>

        {/* Page intro */}
        <div className="mb-7 border-y border-hairline py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Your newsroom
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">
                Article Desk
              </h2>
            </div>

            <p className="text-sm text-muted">
              {articles.length}{" "}
              {articles.length === 1 ? "article" : "articles"} in your
              workspace
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <p className="font-medium">Unable to load articles</p>
            <p className="mt-1">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!error && articles.length === 0 && (
          <div className="border border-hairline bg-white px-6 py-16 text-center">
            <div className="mx-auto max-w-md">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-press">
                Your desk is quiet
              </p>

              <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">
                No articles yet
              </h2>

              <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted">
                Create your first article and start building your
                editorial queue.
              </p>

              <button
                onClick={() => navigate("/articles/new")}
                className="mt-7 border border-press bg-press px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#8f2b25]"
              >
                Create Article
              </button>
            </div>
          </div>
        )}

        {/* Articles */}
        {articles.length > 0 && (
          <div className="border border-hairline bg-white">
            {/* Table heading */}
            <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
              <div>
                <p className="font-serif text-lg font-semibold text-ink">
                  Article Archive
                </p>

                <p className="mt-0.5 text-xs text-muted">
                  Recent articles appear first.
                </p>
              </div>

              <span className="hidden text-[11px] font-semibold uppercase tracking-[0.16em] text-muted sm:block">
                Editorial Desk
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-hairline bg-paper">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                      Article
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                      Section
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                      Status
                    </th>

                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                      Created
                    </th>

                    <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {articles.map((article, index) => (
                    <tr
                      key={article._id}
                      className={`border-b border-hairline last:border-b-0 transition hover:bg-[#fcfcf9] ${
                        index % 2 === 1 ? "bg-[#fdfdfb]" : "bg-white"
                      }`}
                    >
                      {/* Article */}
                      <td className="px-5 py-5 align-top">
                        <div className="max-w-md">
                          <h3 className="font-serif text-lg font-semibold leading-snug text-ink">
                            {article.title}
                          </h3>

                          {article.summary && (
                            <p className="mt-1.5 line-clamp-2 text-sm leading-5 text-muted">
                              {article.summary}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Section */}
                      <td className="px-5 py-5 align-top">
                        <span className="text-sm font-medium text-ink">
                          {article.section?.name || "-"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-5 align-top">
                        <span
                          className={`inline-flex items-center border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${getStatusClass(
                            article.status
                          )}`}
                        >
                          {article.status.replaceAll("_", " ")}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="px-5 py-5 align-top">
                        <span className="text-sm text-muted">
                          {article.createdAt
                            ? new Date(
                                article.createdAt
                              ).toLocaleDateString()
                            : "-"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-5 text-right align-top">
                        <button
                          onClick={() =>
                            handleArticleAction(article)
                          }
                          className="border border-hairline px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ink transition hover:border-press hover:bg-press hover:text-white"
                        >
                          {article.status === "DRAFT" ||
                          article.status ===
                            "CHANGES_REQUESTED"
                            ? "Edit"
                            : "View"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyArticles;

