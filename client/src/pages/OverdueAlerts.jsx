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
      <div className="min-h-screen bg-paper font-sans text-ink antialiased">
        <div className="h-[3px] bg-press" />

        <main className="mx-auto max-w-6xl px-6 py-12">
          <div className="border-y border-hairline py-10">
            <p className="text-sm text-muted">
              Loading overdue alerts...
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="min-h-screen bg-paper font-sans text-ink antialiased">
        <div className="h-[3px] bg-press" />

        <main className="mx-auto max-w-6xl px-6 py-10">
          <div className="mb-8 flex justify-end">
            <button
              onClick={() => navigate("/dashboard")}
              className="border border-hairline px-4 py-2 text-sm font-medium text-muted transition hover:border-press hover:text-press"
            >
              ← Back to Dashboard
            </button>
          </div>

          <div className="border border-press/30 bg-white px-6 py-5">
            <p className="text-sm font-medium text-press">
              {error}
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper font-sans text-ink antialiased">
      <div className="h-[3px] bg-press" />

      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* Header */}
        <div className="mb-10 border-b border-hairline pb-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-press">
                Publishing Monitor
              </p>

              <h1 className="font-serif text-4xl leading-tight text-ink">
                Overdue Publish Alerts
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                Scheduled articles whose publish time has passed
                but have not been published yet.
              </p>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-fit border border-hairline px-4 py-2 text-sm font-medium text-muted transition hover:border-press hover:text-press"
            >
              ← Back to Dashboard
            </button>

          </div>
        </div>

        {/* Alert count */}
        <div className="mb-6 flex items-center justify-between border-b border-hairline pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Pending Alerts
            </p>
            <p className="mt-1 font-serif text-2xl text-ink">
              {alerts.length}
            </p>
          </div>

          {alerts.length > 0 && (
            <span className="border border-press/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-press">
              Action Required
            </span>
          )}
        </div>

        {/* Empty State */}
        {alerts.length === 0 ? (
          <div className="border-y border-hairline bg-white px-6 py-14 text-center">
            <div className="mx-auto max-w-md">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-press">
                All Clear
              </p>

              <h2 className="font-serif text-2xl text-ink">
                No overdue articles
              </h2>

              <p className="mt-3 text-sm leading-6 text-muted">
                All scheduled articles are currently on time.
              </p>
            </div>
          </div>
        ) : (

          /* Alerts Table */
          <div className="overflow-hidden border-y border-hairline bg-white">

            <div className="overflow-x-auto">
              <table className="min-w-full">

                <thead>
                  <tr className="border-b border-hairline bg-paper">
                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
                      Article
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
                      Section
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
                      Author
                    </th>

                    <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
                      Scheduled Time
                    </th>

                    <th className="px-6 py-4 text-right text-[11px] font-semibold uppercase tracking-[0.15em] text-muted">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {alerts.map((article) => (
                    <tr
                      key={article._id}
                      className="border-b border-hairline last:border-b-0 hover:bg-paper/60"
                    >

                      {/* Article */}
                      <td className="px-6 py-5">
                        <div className="max-w-xs">
                          <p className="font-serif text-lg leading-snug text-ink">
                            {article.title}
                          </p>

                          <p className="mt-1 text-xs uppercase tracking-wider text-press">
                            Overdue
                          </p>
                        </div>
                      </td>

                      {/* Section */}
                      <td className="px-6 py-5 text-sm text-muted">
                        {article.section?.name || "—"}
                      </td>

                      {/* Author */}
                      <td className="px-6 py-5 text-sm text-muted">
                        {article.author?.name ||
                          article.author?.email ||
                          "—"}
                      </td>

                      {/* Scheduled Time */}
                      <td className="px-6 py-5">
                        <p className="text-sm font-medium text-press">
                          {article.scheduledAt
                            ? new Date(
                                article.scheduledAt
                              ).toLocaleString()
                            : "—"}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              navigate(
                                `/articles/${article._id}`
                              )
                            }
                            className="border border-hairline px-3 py-1.5 text-sm font-medium text-muted transition hover:border-ink hover:text-ink"
                          >
                            View
                          </button>

                          <button
                            onClick={() =>
                              dismissAlert(article._id)
                            }
                            className="bg-ink px-3 py-1.5 text-sm font-medium text-white transition hover:bg-press"
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

      </main>
    </div>
  );
};

export default OverdueAlerts;