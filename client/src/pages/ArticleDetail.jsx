import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
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

    fetchArticle();
  }, [id]);

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">
          Loading article...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>

          <button
            onClick={() => navigate(-1)}
            className="mt-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm"
          >
            Go Back
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
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Article
            </h1>

            <p className="text-sm text-gray-500">
              Editorial Workflow
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
              article.status
            )}`}
          >
            {article.status}
          </span>
        </div>
      </header>

      {/* Article */}
      <main className="mx-auto max-w-4xl px-6 py-10">
        <article className="rounded-xl border bg-white p-8 shadow-sm">
          {/* Section */}
          <div className="mb-4 text-sm font-medium text-gray-500">
            {article.section}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold leading-tight text-gray-900">
            {article.title}
          </h1>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
            <span>
              Author:{" "}
              <strong className="font-medium text-gray-700">
                {article.author?.name ||
                  article.author?.email ||
                  "Unknown"}
              </strong>
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
              <h2 className="mb-2 text-sm font-semibold text-gray-700">
                Summary
              </h2>

              <p className="text-sm leading-6 text-gray-600">
                {article.summary}
              </p>
            </div>
          )}

          {/* Content */}
          <div className="mt-8">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
              Article Content
            </h2>

            <div className="whitespace-pre-wrap text-base leading-8 text-gray-800">
              {article.content}
            </div>
          </div>

          {/* Back */}
          <div className="mt-10 border-t pt-6">
            <button
              onClick={() => navigate(-1)}
              className="rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Go Back
            </button>
          </div>
        </article>
      </main>
    </div>
  );
};

export default ArticleDetail;