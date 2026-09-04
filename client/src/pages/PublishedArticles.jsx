import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import BackButton from "../components/BackButton.jsx";

const PublishedArticles = () => {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedArticles, setSelectedArticles] = useState([]);
  const [bulkUnpublishing, setBulkUnpublishing] = useState(false);
  const [bulkResults, setBulkResults] = useState([]);
  const [success, setSuccess] = useState("");

  // ==========================================
  // FETCH PUBLISHED ARTICLES
  // ==========================================

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

  useEffect(() => {
    fetchPublishedArticles();
  }, []);

  // ==========================================
  // SELECT ARTICLE
  // ==========================================

  const handleSelectArticle = (id) => {
    setSelectedArticles((prev) =>
      prev.includes(id)
        ? prev.filter(
            (articleId) => articleId !== id
          )
        : [...prev, id]
    );

    setBulkResults([]);
    setError("");
    setSuccess("");
  };

  // ==========================================
  // SELECT ALL
  // ==========================================

  const handleSelectAll = () => {
    if (
      selectedArticles.length === articles.length
    ) {
      setSelectedArticles([]);
    } else {
      setSelectedArticles(
        articles.map((article) => article._id)
      );
    }

    setBulkResults([]);
    setError("");
    setSuccess("");
  };

  // ==========================================
  // BULK UNPUBLISH
  // ==========================================

  const handleBulkUnpublish = async () => {
    setError("");
    setSuccess("");
    setBulkResults([]);

    if (selectedArticles.length === 0) {
      setError(
        "Please select at least one article."
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to unpublish ${selectedArticles.length} selected article${
        selectedArticles.length > 1 ? "s" : ""
      }?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setBulkUnpublishing(true);

      const response = await api.patch(
        "/articles/bulk/unpublish",
        {
          articleIds: selectedArticles,
        }
      );

      const results = response.data.results || [];

      setBulkResults(results);

      const successful = results.filter(
        (result) => result.success
      ).length;

      const failed = results.filter(
        (result) => !result.success
      ).length;

      if (failed === 0) {
        setSuccess(
          `${successful} article${
            successful !== 1 ? "s" : ""
          } unpublished successfully.`
        );
      } else {
        setSuccess(
          `${successful} article${
            successful !== 1 ? "s" : ""
          } unpublished successfully. ${failed} failed.`
        );
      }

      setSelectedArticles([]);

      // Refresh list.
      // Successfully unpublished articles will disappear
      // because they are no longer PUBLISHED.
      await fetchPublishedArticles();
    } catch (err) {
      console.error(
        "Bulk unpublish error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to unpublish selected articles."
      );
    } finally {
      setBulkUnpublishing(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">
          Loading published articles...
        </p>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-6 py-5">
          <h1 className="text-2xl font-bold text-gray-900">
            Published Articles
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Articles that have been approved and
            published.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">

        {/* Back */}

        <div className="mb-6">
          <BackButton label="Back" />
        </div>

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

        {/* ==========================================
            BULK ACTION BAR
        ========================================== */}

        {articles.length > 0 && (
          <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {selectedArticles.length} article
                  {selectedArticles.length !== 1
                    ? "s"
                    : ""}{" "}
                  selected
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Select published articles to
                  unpublish them in bulk.
                </p>
              </div>

              <div className="flex gap-3">

                {/* Bulk Unpublish */}

                <button
                  onClick={handleBulkUnpublish}
                  disabled={
                    selectedArticles.length === 0 ||
                    bulkUnpublishing
                  }
                  className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {bulkUnpublishing
                    ? "Unpublishing..."
                    : "Unpublish Selected"}
                </button>

                {/* Clear */}

                <button
                  onClick={() => {
                    setSelectedArticles([]);
                    setBulkResults([]);
                    setError("");
                    setSuccess("");
                  }}
                  disabled={
                    selectedArticles.length === 0 ||
                    bulkUnpublishing
                  }
                  className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==========================================
            BULK RESULTS
        ========================================== */}

        {bulkResults.length > 0 && (
          <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">
              Bulk Unpublish Results
            </h2>

            <div className="mt-4 space-y-2">
              {bulkResults.map((result) => {
                const article = articles.find(
                  (item) =>
                    item._id === result.articleId
                );

                return (
                  <div
                    key={result.articleId}
                    className={`rounded-md border p-3 text-sm ${
                      result.success
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    <div className="font-medium">
                      {article?.title ||
                        `Article ${result.articleId}`}
                    </div>

                    <div className="mt-1">
                      {result.message}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ==========================================
            EMPTY STATE
        ========================================== */}

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

                {/* Top Row */}

                <div className="flex items-center justify-between">

                  <div className="flex items-center gap-3">

                    {/* Checkbox */}

                    <input
                      type="checkbox"
                      checked={selectedArticles.includes(
                        article._id
                      )}
                      onChange={() =>
                        handleSelectArticle(
                          article._id
                        )
                      }
                      disabled={bulkUnpublishing}
                      className="h-4 w-4 rounded border-gray-300"
                    />

                    <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      {article.section?.name ||
                        article.section ||
                        "Unknown"}
                    </span>
                  </div>

                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    PUBLISHED
                  </span>
                </div>

                {/* Article */}

                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  {article.title}
                </h2>

                {article.summary && (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                    {article.summary}
                  </p>
                )}

                {/* Author */}

                <div className="mt-5 text-xs text-gray-500">
                  By{" "}
                  <span className="font-medium text-gray-700">
                    {article.author?.name ||
                      article.author?.email ||
                      "Unknown"}
                  </span>
                </div>

                {/* Published Date */}

                {article.publishedAt && (
                  <div className="mt-1 text-xs text-gray-400">
                    Published{" "}
                    {new Date(
                      article.publishedAt
                    ).toLocaleDateString()}
                  </div>
                )}

                {/* Read */}

                <button
                  onClick={() =>
                    navigate(
                      `/articles/${article._id}`
                    )
                  }
                  disabled={bulkUnpublishing}
                  className="mt-5 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Read Article
                </button>
              </article>
            ))}
          </div>
        )}

        {/* ==========================================
            SELECT ALL
        ========================================== */}

        {articles.length > 0 && (
          <div className="mt-6 flex items-center gap-2">
            <input
              id="select-all"
              type="checkbox"
              checked={
                selectedArticles.length ===
                  articles.length &&
                articles.length > 0
              }
              onChange={handleSelectAll}
              disabled={bulkUnpublishing}
              className="h-4 w-4 rounded border-gray-300"
            />

            <label
              htmlFor="select-all"
              className="text-sm text-gray-600"
            >
              Select all published articles
            </label>
          </div>
        )}
      </main>
    </div>
  );
};

export default PublishedArticles;