
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
      <div className="min-h-screen bg-paper font-sans text-ink antialiased">
        <div className="h-[3px] bg-press" />

        <Navbar />

        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <p className="font-serif text-2xl text-ink">
              Loading approved articles
            </p>

            <p className="mt-2 text-sm text-muted">
              Preparing the publishing desk...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-paper font-sans text-ink antialiased">
      <div className="h-[3px] bg-press" />

      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Back */}
        <div className="mb-8">
          <BackButton label="Back to Dashboard" />
        </div>

        {/* Header */}
        <header className="border-b-2 border-ink pb-7">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-press">
                Publishing Desk
              </p>

              <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight text-ink">
                Approved Articles
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                Publish approved editorial content immediately
                or schedule it for a future release.
              </p>
            </div>

            <div className="border-l-2 border-press pl-4">
              <p className="text-3xl font-serif font-semibold text-ink">
                {articles.length}
              </p>

              <p className="text-xs uppercase tracking-[0.16em] text-muted">
                Awaiting publication
              </p>
            </div>
          </div>
        </header>

        {/* Error */}
        {error && (
          <div className="mt-6 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mt-6 border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* ==========================================
            BULK ACTION BAR
        ========================================== */}

        {articles.length > 0 && (
          <section className="mt-8 border-y border-hairline bg-white">
            <div className="p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-press">
                    Bulk Scheduling
                  </p>

                  <h2 className="mt-1 font-serif text-xl font-semibold text-ink">
                    Schedule selected articles
                  </h2>

                  <p className="mt-1 text-sm text-muted">
                    {selectedArticles.length} article
                    {selectedArticles.length !== 1
                      ? "s"
                      : ""}{" "}
                    selected
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div>
                    <label
                      htmlFor="bulkPublishAt"
                      className="block text-xs font-semibold uppercase tracking-wider text-muted"
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
                      className="mt-2 border border-hairline bg-paper px-3 py-2.5 text-sm text-ink outline-none transition focus:border-press disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <button
                    onClick={handleBulkSchedule}
                    disabled={
                      selectedArticles.length === 0 ||
                      bulkScheduling
                    }
                    className="bg-ink px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-press disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {bulkScheduling
                      ? "Scheduling..."
                      : "Schedule Selected"}
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
                      bulkScheduling
                    }
                    className="border border-hairline bg-white px-5 py-2.5 text-sm font-semibold text-muted transition hover:border-press hover:text-press disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ==========================================
            BULK RESULTS
        ========================================== */}

        {bulkResults.length > 0 && (
          <section className="mt-6 border border-hairline bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-press">
              Scheduling Report
            </p>

            <h2 className="mt-1 font-serif text-xl font-semibold text-ink">
              Bulk Scheduling Results
            </h2>

            <div className="mt-5 space-y-2">
              {bulkResults.map((result) => {
                const article = articles.find(
                  (item) => item._id === result.articleId
                );

                return (
                  <div
                    key={result.articleId}
                    className={`border p-4 text-sm ${
                      result.success
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    <div className="font-semibold">
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
          </section>
        )}

        {/* ==========================================
            EMPTY STATE
        ========================================== */}

        {articles.length === 0 ? (
          <section className="mt-8 border-y border-hairline bg-white px-6 py-16 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-press">
              Publishing Desk
            </p>

            <h2 className="mt-3 font-serif text-2xl font-semibold text-ink">
              No approved articles
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
              There are currently no approved articles waiting
              to be published or scheduled.
            </p>

            <button
              onClick={() =>
                navigate("/editor/review")
              }
              className="mt-7 bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-press"
            >
              Back to Review
            </button>
          </section>
        ) : (
          /* ==========================================
             ARTICLE TABLE
          ========================================== */

          <section className="mt-8 overflow-hidden border-y border-hairline bg-white">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-hairline bg-paper">
                  <tr>
                    <th className="px-5 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={
                          articles.length > 0 &&
                          selectedArticles.length ===
                            articles.length
                        }
                        onChange={handleSelectAll}
                        disabled={bulkScheduling}
                        className="h-4 w-4 accent-[#A8332B]"
                      />
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                      Article
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                      Author
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                      Section
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                      Approved
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.15em] text-muted">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {articles.map((article) => (
                    <tr
                      key={article._id}
                      className="border-b border-hairline transition hover:bg-paper"
                    >
                      {/* Checkbox */}
                      <td className="px-5 py-5 align-top">
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
                          className="h-4 w-4 accent-[#A8332B]"
                        />
                      </td>

                      {/* Article */}
                      <td className="min-w-[280px] px-5 py-5 align-top">
                        <div className="font-serif text-lg font-semibold leading-6 text-ink">
                          {article.title}
                        </div>

                        {article.summary && (
                          <div className="mt-2 max-w-md text-sm leading-5 text-muted">
                            {article.summary}
                          </div>
                        )}
                      </td>

                      {/* Author */}
                      <td className="whitespace-nowrap px-5 py-5 align-top text-sm text-ink">
                        {article.author?.name ||
                          article.author?.email ||
                          "Unknown"}
                      </td>

                      {/* Section */}
                      <td className="whitespace-nowrap px-5 py-5 align-top text-sm text-muted">
                        {article.section?.name ||
                          article.section ||
                          "Unknown"}
                      </td>

                      {/* Approved Date */}
                      <td className="whitespace-nowrap px-5 py-5 align-top text-sm text-muted">
                        {article.approvedAt
                          ? new Date(
                              article.approvedAt
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-5 align-top">
                        <span className="inline-flex border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-green-700">
                          {article.status}
                        </span>
                      </td>

                      {/* Publish */}
                      <td className="px-5 py-5 text-right align-top">
                        <button
                          onClick={() =>
                            handlePublish(
                              article._id
                            )
                          }
                          disabled={
                            publishingId ===
                              article._id ||
                            bulkScheduling
                          }
                          className="bg-ink px-4 py-2 text-sm font-semibold text-white transition hover:bg-press disabled:cursor-not-allowed disabled:opacity-50"
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
          </section>
        )}

        {/* Footer note */}
        {articles.length > 0 && (
          <p className="mt-5 text-xs text-muted">
            Select multiple articles to schedule them together,
            or publish an individual article immediately.
          </p>
        )}
      </main>
    </div>
  );
};

export default ApprovedArticles;
