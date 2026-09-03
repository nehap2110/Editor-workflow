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
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-600">
          Loading articles...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      
      <div className="mb-6">
    <BackButton label="Back to Dashboard" />
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Articles for Review
        </h1>

        <p className="mt-1 text-gray-600">
          Review articles submitted by writers.
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="rounded-lg border bg-white p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-800">
            No articles to review
          </h2>

          <p className="mt-2 text-gray-500">
            There are currently no submitted articles waiting for review.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Article
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Author
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Section
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Submitted
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 bg-white">
                {articles.map((article) => (
                  <tr key={article._id}>
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

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {article.author?.name ||
                        article.author?.email ||
                        "Unknown"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {article.section}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {article.submittedAt
                        ? new Date(
                            article.submittedAt
                          ).toLocaleDateString()
                        : "-"}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                        {article.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          navigate(
                            `/editor/review/${article._id}`
                          )
                        }
                        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditorReview;