import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const OverdueAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchOverdueAlerts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/articles/alerts/overdue");

      setAlerts(response.data.alerts || []);
    } catch (error) {
      console.error("Failed to fetch overdue alerts:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load overdue alerts"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverdueAlerts();
  }, []);

  const dismissAlert = async (articleId) => {
    try {
      await api.patch(
        `/articles/alerts/overdue/${articleId}/dismiss`
      );

      setAlerts((prevAlerts) =>
        prevAlerts.filter(
          (alert) => alert._id !== articleId
        )
      );
    } catch (error) {
      console.error("Failed to dismiss alert:", error);

      alert(
        error.response?.data?.message ||
          "Failed to dismiss overdue alert"
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <p className="text-gray-500">
          Loading overdue alerts...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">

        <div className="mb-4 flex justify-end">
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">

      {/* Header */}

      <div className="mb-6 flex items-start justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Overdue Publish Alerts
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Scheduled articles whose publish time has passed
            but have not been published yet.
          </p>
        </div>

        {/* Back Button */}

        <button
          onClick={() => navigate("/dashboard")}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          ← Back to Dashboard
        </button>

      </div>

      {/* Empty state */}

      {alerts.length === 0 ? (
        <div className="rounded-lg border bg-white p-10 text-center">

          <h2 className="text-lg font-semibold text-gray-900">
            No overdue articles
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            All scheduled articles are currently on time.
          </p>

        </div>
      ) : (

        <div className="overflow-hidden rounded-lg border bg-white">

          <div className="overflow-x-auto">

            <table className="min-w-full divide-y divide-gray-200">

              <thead className="bg-gray-50">

                <tr>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Article
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Section
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Author
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">
                    Scheduled Time
                  </th>

                  <th className="px-6 py-3 text-right text-xs font-semibold uppercase text-gray-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-200">

                {alerts.map((article) => (

                  <tr key={article._id}>

                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {article.title}
                      </p>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {article.section?.name || "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {article.author?.name ||
                        article.author?.email ||
                        "—"}
                    </td>

                    <td className="px-6 py-4 text-sm text-red-600">
                      {article.scheduledAt
                        ? new Date(
                            article.scheduledAt
                          ).toLocaleString()
                        : "—"}
                    </td>

                    <td className="px-6 py-4 text-right">

                      <div className="flex justify-end gap-2">

                        <button
                          onClick={() =>
                            navigate(
                              `/articles/${article._id}`
                            )
                          }
                          className="rounded-md border px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                          View
                        </button>

                        <button
                          onClick={() =>
                            dismissAlert(article._id)
                          }
                          className="rounded-md bg-gray-800 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-900"
                        >
                          Dismiss
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

    </div>
  );
};

export default OverdueAlerts;