import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar.jsx";
import BackButton from "../components/BackButton.jsx";

const ApprovedArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [publishingId, setPublishingId] = useState(null);

  const [selectedArticles, setSelectedArticles] = useState([]);
  const [bulkScheduling, setBulkScheduling] = useState(false);
  const [bulkPublishAt, setBulkPublishAt] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bulkResults, setBulkResults] = useState([]);

  const navigate = useNavigate();

  // ==========================================
  // FETCH APPROVED ARTICLES
  // ==========================================

  const fetchApprovedArticles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/articles/approved");

      setArticles(response.data.articles || []);
    } catch (err) {
      console.error("Fetch approved articles error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load approved articles."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedArticles();
  }, []);

  // ==========================================
  // SELECT / UNSELECT ARTICLE
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
  // BULK SCHEDULE
  // ==========================================

  const handleBulkSchedule = async () => {
    setError("");
    setSuccess("");
    setBulkResults([]);

    if (selectedArticles.length === 0) {
      setError("Please select at least one article.");
      return;
    }

    if (!bulkPublishAt) {
      setError("Please select a future publish time.");
      return;
    }

    const publishDate = new Date(bulkPublishAt);

    if (
      Number.isNaN(publishDate.getTime()) ||
      publishDate <= new Date()
    ) {
      setError(
        "Scheduled publish time must be in the future."
      );
      return;
    }

    try {
      setBulkScheduling(true);

      const response = await api.post(
        "/articles/bulk/schedule",
        {
          articleIds: selectedArticles,
          publishAt: publishDate.toISOString(),
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
            successful > 1 ? "s" : ""
          } scheduled successfully.`
        );
      } else {
        setSuccess(
          `${successful} article${
            successful !== 1 ? "s" : ""
          } scheduled successfully. ${failed} failed.`
        );
      }

      setSelectedArticles([]);
      setBulkPublishAt("");

      // Refresh approved list.
      // Successfully scheduled articles will disappear
      // because they are no longer APPROVED.
      await fetchApprovedArticles();
    } catch (err) {
      console.error("Bulk schedule error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to schedule selected articles."
      );
    } finally {
      setBulkScheduling(false);
    }
  };

  // ==========================================
  // PUBLISH ARTICLE
  // ==========================================

  const handlePublish = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to publish this article?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setPublishingId(id);
      setError("");
      setSuccess("");
      setBulkResults([]);

      const response = await api.post(
        `/articles/${id}/publish`
      );

      setSuccess(
        response.data.message ||
          "Article published successfully."
      );

      // Remove published article from approved list
      setArticles((prevArticles) =>
        prevArticles.filter(
          (article) => article._id !== id
        )
      );

      // Remove from selection as well
      setSelectedArticles((prev) =>
        prev.filter((articleId) => articleId !== id)
      );
    } catch (err) {
      console.error("Publish article error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to publish article."
      );
    } finally {
      setPublishingId(null);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navbar />

        <div className="flex min-h-[60vh] items-center justify-center">
          <p className="text-gray-600">
            Loading approved articles...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Back Button */}

        <div className="mb-6">
          <BackButton label="Back to Dashboard" />
        </div>

        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Approved Articles
          </h1>

          <p className="mt-2 text-gray-500">
            Publish or schedule articles that have been
            approved by the editorial team.
          </p>
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
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {selectedArticles.length} article
                  {selectedArticles.length !== 1
                    ? "s"
                    : ""}{" "}
                  selected
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Select approved articles to schedule them
                  at the same future time.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-end">

                {/* Publish Time */}

                <div>
                  <label
                    htmlFor="bulkPublishAt"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Publish date & time
                  </label>

                  <input
                    id="bulkPublishAt"
                    type="datetime-local"
                    value={bulkPublishAt}
                    onChange={(e) => {
                      setBulkPublishAt(e.target.value);
                      setError("");
                    }}
                    disabled={
                      selectedArticles.length === 0 ||
                      bulkScheduling
                    }
                    min={new Date()
                      .toISOString()
                      .slice(0, 16)}
                    className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
                  />
                </div>

                {/* Schedule Button */}

                <button
                  onClick={handleBulkSchedule}
                  disabled={
                    selectedArticles.length === 0 ||
                    bulkScheduling
                  }
                  className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {bulkScheduling
                    ? "Scheduling..."
                    : "Schedule Selected"}
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
                    bulkScheduling
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
              Bulk Scheduling Results
            </h2>

            <div className="mt-4 space-y-2">
              {bulkResults.map((result) => {
                const article = articles.find(
                  (item) => item._id === result.articleId
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
          <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              No approved articles
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              There are currently no approved articles
              waiting to be published or scheduled.
            </p>

            <button
              onClick={() =>
                navigate("/editor/review")
              }
              className="mt-6 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Back to Review
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">

                {/* Table Header */}

                <thead className="bg-gray-50">
                  <tr>

                    {/* Select All */}

                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          articles.length > 0 &&
                          selectedArticles.length ===
                            articles.length
                        }
                        onChange={handleSelectAll}
                        disabled={bulkScheduling}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </th>

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
                      Approved
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                      Status
                    </th>

                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                {/* Table Body */}

                <tbody className="divide-y divide-gray-200 bg-white">
                  {articles.map((article) => (
                    <tr key={article._id}>

                      {/* Checkbox */}

                      <td className="px-6 py-4">
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
                          disabled={bulkScheduling}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </td>

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

                      {/* Author */}

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {article.author?.name ||
                          article.author?.email ||
                          "Unknown"}
                      </td>

                      {/* Section */}

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {article.section?.name ||
                          article.section ||
                          "Unknown"}
                      </td>

                      {/* Approved Date */}

                      <td className="px-6 py-4 text-sm text-gray-500">
                        {article.approvedAt
                          ? new Date(
                              article.approvedAt
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      {/* Status */}

                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                          {article.status}
                        </span>
                      </td>

                      {/* Publish */}

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            handlePublish(article._id)
                          }
                          disabled={
                            publishingId ===
                              article._id ||
                            bulkScheduling
                          }
                          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {publishingId ===
                          article._id
                            ? "Publishing..."
                            : "Publish"}
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

export default ApprovedArticles;