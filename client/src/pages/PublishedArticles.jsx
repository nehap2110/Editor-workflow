
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

      const response = await api.get("/articles/published");

      setArticles(response.data.articles || []);
    } catch (err) {
      console.error("Fetch published articles error:", err);

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
        ? prev.filter((articleId) => articleId !== id)
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
    if (selectedArticles.length === articles.length) {
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
      setError("Please select at least one article.");
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

      await fetchPublishedArticles();
    } catch (err) {
      console.error("Bulk unpublish error:", err);

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
      <div className="min-h-screen bg-paper font-sans text-ink antialiased">
        <div className="h-[3px] bg-press" />

        <main className="mx-auto max-w-6xl px-6 py-12">
          <div className="border-y border-hairline py-10">
            <p className="text-sm text-muted">
              Loading published articles...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-paper font-sans text-ink antialiased">
      <div className="h-[3px] bg-press" />

      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* Header */}
        <div className="mb-8 border-b border-hairline pb-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-press">
                Publication Archive
              </p>

              <h1 className="font-serif text-4xl leading-tight text-ink">
                Published Articles
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                Articles that have been approved and published.
              </p>
            </div>

            <BackButton label="Back" />

          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 border border-press/30 bg-white px-5 py-4">
            <p className="text-sm font-medium text-press">
              {error}
            </p>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 border border-hairline bg-white px-5 py-4">
            <p className="text-sm font-medium text-ink">
              {success}
            </p>
          </div>
        )}

        {/* ==========================================
            BULK ACTION BAR
        ========================================== */}

        {articles.length > 0 && (
          <div className="mb-8 border-y border-hairline bg-white px-5 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="font-serif text-xl text-ink">
                  {selectedArticles.length} article
                  {selectedArticles.length !== 1 ? "s" : ""} selected
                </p>

                <p className="mt-1 text-xs leading-5 text-muted">
                  Select published articles to unpublish them in bulk.
                </p>
              </div>

              <div className="flex gap-3">

                <button
                  onClick={handleBulkUnpublish}
                  disabled={
                    selectedArticles.length === 0 ||
                    bulkUnpublishing
                  }
                  className="bg-press px-4 py-2 text-sm font-medium text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {bulkUnpublishing
                    ? "Unpublishing..."
                    : "Unpublish Selected"}
                </button>

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
                  className="border border-hairline px-4 py-2 text-sm font-medium text-muted transition hover:border-ink hover:text-ink disabled:cursor-not-allowed disabled:opacity-40"
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
          <div className="mb-8 border-y border-hairline bg-white px-5 py-5">

            <div className="mb-4 border-b border-hairline pb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-press">
                Operation Results
              </p>

              <h2 className="mt-1 font-serif text-2xl text-ink">
                Bulk Unpublish Results
              </h2>
            </div>

            <div className="space-y-2">
              {bulkResults.map((result) => {
                const article = articles.find(
                  (item) => item._id === result.articleId
                );

                return (
                  <div
                    key={result.articleId}
                    className={`border px-4 py-3 text-sm ${
                      result.success
                        ? "border-hairline bg-paper text-ink"
                        : "border-press/30 bg-white text-press"
                    }`}
                  >
                    <div className="font-medium">
                      {article?.title ||
                        `Article ${result.articleId}`}
                    </div>

                    <div className="mt-1 text-xs text-muted">
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
          <div className="border-y border-hairline bg-white px-6 py-14 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-press">
              Publication Archive
            </p>

            <h2 className="font-serif text-2xl text-ink">
              No published articles
            </h2>

            <p className="mt-3 text-sm leading-6 text-muted">
              Published articles will appear here.
            </p>
          </div>
        ) : (

          /* ==========================================
              ARTICLES
          ========================================== */

          <div className="grid gap-6 md:grid-cols-2">

            {articles.map((article) => (
              <article
                key={article._id}
                className="border-y border-hairline bg-white p-6 transition hover:border-press"
              >

                {/* Top Row */}
                <div className="flex items-center justify-between gap-4">

                  <div className="flex min-w-0 items-center gap-3">

                    <input
                      type="checkbox"
                      checked={selectedArticles.includes(
                        article._id
                      )}
                      onChange={() =>
                        handleSelectArticle(article._id)
                      }
                      disabled={bulkUnpublishing}
                      className="h-4 w-4 accent-press"
                    />

                    <span className="truncate text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                      {article.section?.name ||
                        article.section ||
                        "Unknown"}
                    </span>

                  </div>

                  <span className="shrink-0 border border-hairline px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-press">
                    Published
                  </span>

                </div>

                {/* Article */}
                <h2 className="mt-5 font-serif text-2xl leading-tight text-ink">
                  {article.title}
                </h2>

                {article.summary && (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted">
                    {article.summary}
                  </p>
                )}

                {/* Divider */}
                <div className="my-5 border-t border-hairline" />

                {/* Author */}
                <div className="text-xs text-muted">
                  By{" "}
                  <span className="font-medium text-ink">
                    {article.author?.name ||
                      article.author?.email ||
                      "Unknown"}
                  </span>
                </div>

                {/* Published Date */}
                {article.publishedAt && (
                  <div className="mt-1 text-xs text-muted">
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
                  className="mt-5 border border-ink bg-ink px-4 py-2 text-sm font-medium text-white transition hover:bg-press hover:border-press disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Read Article →
                </button>

              </article>
            ))}

          </div>
        )}

        {/* ==========================================
            SELECT ALL
        ========================================== */}

        {articles.length > 0 && (
          <div className="mt-6 flex items-center gap-2 border-t border-hairline pt-5">

            <input
              id="select-all"
              type="checkbox"
              checked={
                selectedArticles.length === articles.length &&
                articles.length > 0
              }
              onChange={handleSelectAll}
              disabled={bulkUnpublishing}
              className="h-4 w-4 accent-press"
            />

            <label
              htmlFor="select-all"
              className="text-sm text-muted"
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

