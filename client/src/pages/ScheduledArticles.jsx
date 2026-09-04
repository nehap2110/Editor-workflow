import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api.js";
import Navbar from "../components/Navbar.jsx";
import BackButton from "../components/BackButton.jsx";

const ScheduledArticles = () => {
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publishingId, setPublishingId] = useState(null);
  const [unpublishingId, setUnpublishingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchScheduledArticles = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/articles/scheduled");

      setArticles(response.data.articles || []);
    } catch (err) {
      console.error("Fetch scheduled articles error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load scheduled articles."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScheduledArticles();
  }, []);

  // ==========================================
  // PUBLISH NOW
  // ==========================================

  const handlePublish = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to publish this scheduled article now?"
    );

    if (!confirmed) return;

    try {
      setPublishingId(id);
      setError("");
      setSuccess("");

      const response = await api.post(
        `/articles/${id}/publish`
      );

      setSuccess(
        response.data.message ||
          "Article published successfully."
      );

      // Remove from scheduled list
      setArticles((prev) =>
        prev.filter((article) => article._id !== id)
      );
    } catch (err) {
      console.error("Publish scheduled article error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to publish article."
      );
    } finally {
      setPublishingId(null);
    }
  };

  // ==========================================
  // UNPUBLISH
  // ==========================================

  const handleUnpublish = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to unpublish this scheduled article?"
    );

    if (!confirmed) return;

    try {
      setUnpublishingId(id);
      setError("");
      setSuccess("");

      const response = await api.patch(
        `/articles/${id}/unpublish`
      );

      setSuccess(
        response.data.message ||
          "Article unpublished successfully."
      );

      // Remove because status becomes APPROVED
      setArticles((prev) =>
        prev.filter((article) => article._id !== id)
      );
    } catch (err) {
      console.error(
        "Unpublish scheduled article error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to unpublish article."
      );
    } finally {
      setUnpublishingId(null);
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
            Loading scheduled articles...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">

        <div className="mb-6">
          <BackButton label="Back to Dashboard" />
        </div>

        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Scheduled Articles
          </h1>

          <p className="mt-2 text-gray-500">
            Articles scheduled for future publication.
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

        {/* Empty */}

        {articles.length === 0 ? (
          <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800">
              No scheduled articles
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Articles scheduled for publication will appear
              here.
            </p>

            <button
              onClick={() => navigate("/editor/approved")}
              className="mt-6 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Back to Approved Articles
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
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
                      Scheduled For
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

                      {/* Scheduled time */}

                      <td className="px-6 py-4 text-sm text-gray-700">
                        {article.scheduledAt
                          ? new Date(
                              article.scheduledAt
                            ).toLocaleString()
                          : "-"}
                      </td>

                      {/* Status */}

                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-800">
                          SCHEDULED
                        </span>
                      </td>

                      {/* Actions */}

                      <td className="px-6 py-4 text-right">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              handlePublish(article._id)
                            }
                            disabled={
                              publishingId ===
                                article._id ||
                              unpublishingId ===
                                article._id
                            }
                            className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {publishingId ===
                            article._id
                              ? "Publishing..."
                              : "Publish Now"}
                          </button>

                          <button
                            onClick={() =>
                              handleUnpublish(
                                article._id
                              )
                            }
                            disabled={
                              publishingId ===
                                article._id ||
                              unpublishingId ===
                                article._id
                            }
                            className="rounded-md border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {unpublishingId ===
                            article._id
                              ? "Unpublishing..."
                              : "Unpublish"}
                          </button>

                        </div>
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

export default ScheduledArticles;