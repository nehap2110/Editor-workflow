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
        return "bg-gray-100 text-gray-700";

      case "SUBMITTED":
        return "bg-yellow-100 text-yellow-700";

      case "CHANGES_REQUESTED":
        return "bg-orange-100 text-orange-700";

      case "APPROVED":
        return "bg-green-100 text-green-700";

      case "PUBLISHED":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-gray-100 text-gray-700";
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
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">
          Loading your articles...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              My Articles
            </h1>

            <p className="text-sm text-gray-500">
              Manage your articles and track their status.
            </p>
          </div>

          <button
            onClick={() => navigate("/articles/new")}
            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
          >
            + New Article
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-6 py-8">
          {/*back button */}
          
          <div className="mb-6">
         <BackButton label="Back to Dashboard" />
         </div>


        {/* Error */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!error && articles.length === 0 && (
          <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              No articles yet
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Create your first article to get started.
            </p>

            <button
              onClick={() => navigate("/articles/new")}
              className="mt-6 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Create Article
            </button>
          </div>
        )}

        {/* Articles */}
        {articles.length > 0 && (
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Article
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Section
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Created
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white">
                  {articles.map((article) => (
                    <tr
                      key={article._id}
                      className="hover:bg-gray-50"
                    >
                      {/* Article */}
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {article.title}
                        </div>

                        {article.summary && (
                          <div className="mt-1 max-w-md truncate text-sm text-gray-500">
                            {article.summary}
                          </div>
                        )}
                      </td>

                      {/* Section */}
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {article.section || "-"}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                            article.status
                          )}`}
                        >
                          {article.status}
                        </span>
                      </td>

                      {/* Created */}
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {article.createdAt
                          ? new Date(
                              article.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            handleArticleAction(article)
                          }
                          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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