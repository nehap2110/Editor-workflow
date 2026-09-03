import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const PublishedArticles = () => {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPublishedArticles = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          "/articles/published"
        );

        setArticles(response.data.articles || []);
      } catch (err) {
        console.error(
          "Fetch published articles error:",
          err
        );

        setError(
          err.response?.data?.message ||
            "Failed to load published articles."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedArticles();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">
          Loading published articles...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <h1 className="text-2xl font-bold text-gray-900">
            Published Articles
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Articles that have been approved and published.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {articles.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-gray-800">
              No published articles
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Published articles will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {articles.map((article) => (
              <article
                key={article._id}
                className="rounded-xl border bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {article.section}
                  </span>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    PUBLISHED
                  </span>
                </div>

                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  {article.title}
                </h2>

                {article.summary && (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                    {article.summary}
                  </p>
                )}

                <div className="mt-5 text-xs text-gray-500">
                  By{" "}
                  <span className="font-medium text-gray-700">
                    {article.author?.name ||
                      article.author?.email ||
                      "Unknown"}
                  </span>
                </div>

                {article.publishedAt && (
                  <div className="mt-1 text-xs text-gray-400">
                    Published{" "}
                    {new Date(
                      article.publishedAt
                    ).toLocaleDateString()}
                  </div>
                )}

                <button
                  onClick={() =>
                    navigate(
                      `/articles/${article._id}`
                    )
                  }
                  className="mt-5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Read Article
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default PublishedArticles;