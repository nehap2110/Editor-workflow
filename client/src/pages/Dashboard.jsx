import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const response = await api.get("/dashboard");

        setDashboard(response.data);
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.role) {
      fetchDashboard();
    }
  }, [user]);

  const stats = dashboard?.stats || {};

  const statusBreakdown =
    dashboard?.statusBreakdown || [];

  const sectionBreakdown =
    dashboard?.sectionBreakdown || [];

  const publishedPerWeek =
    dashboard?.publishedPerWeek || [];

  const isEditor = user?.role === "editor";
  const isWriter = user?.role === "writer";

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* =========================
            WELCOME
        ========================== */}

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name}
          </h2>

          <p className="mt-2 text-gray-500">
            {isEditor
              ? "Manage your editorial workflow, sections and publishing activity."
              : "Manage your articles and editorial workflow."}
          </p>
        </div>


        {/* =========================
            MAIN STATISTICS
        ========================== */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            title="In Review"
            value={stats.inReview}
            loading={loading}
          />

          <StatCard
            title="Scheduled This Week"
            value={stats.scheduledThisWeek}
            loading={loading}
          />

          <StatCard
            title="Published This Week"
            value={stats.publishedThisWeek}
            loading={loading}
          />

          <StatCard
            title="Open Drafts"
            value={stats.openDrafts}
            loading={loading}
          />

        </div>


        {/* =========================
            BREAKDOWNS
        ========================== */}

        <div className="mb-8 grid gap-6 lg:grid-cols-2">

          {/* Articles by Status */}

          <div className="rounded-xl border bg-white p-6 shadow-sm">

            <h3 className="mb-5 text-lg font-semibold text-gray-900">
              Articles by Status
            </h3>

            {loading ? (
              <p className="text-gray-500">
                Loading...
              </p>
            ) : statusBreakdown.length === 0 ? (
              <p className="text-gray-500">
                No articles found.
              </p>
            ) : (
              <div className="space-y-4">

                {statusBreakdown.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600">
                      {formatStatus(item._id)}
                    </span>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                      {item.count}
                    </span>
                  </div>
                ))}

              </div>
            )}

          </div>


          {/* Articles by Section */}

          <div className="rounded-xl border bg-white p-6 shadow-sm">

            <h3 className="mb-5 text-lg font-semibold text-gray-900">
              Articles by Section
            </h3>

            {loading ? (
              <p className="text-gray-500">
                Loading...
              </p>
            ) : sectionBreakdown.length === 0 ? (
              <p className="text-gray-500">
                No articles found.
              </p>
            ) : (
              <div className="space-y-4">

                {sectionBreakdown.map((item) => (
                  <div
                    key={item.sectionId}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-gray-600">
                      {item.sectionName}
                    </span>

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-800">
                      {item.count}
                    </span>
                  </div>
                ))}

              </div>
            )}

          </div>

        </div>


        {/* =========================
            PUBLISHED LAST 8 WEEKS
        ========================== */}

        <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">

          <h3 className="text-lg font-semibold text-gray-900">
            Published Articles — Last 8 Weeks
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Weekly publishing activity.
          </p>

          <div className="mt-8 flex h-64 items-end gap-3">

            {loading ? (
              <p className="text-gray-500">
                Loading chart...
              </p>
            ) : publishedPerWeek.length === 0 ? (
              <p className="text-gray-500">
                No publishing data available.
              </p>
            ) : (
              publishedPerWeek.map((item) => {

                const maxCount = Math.max(
                  ...publishedPerWeek.map(
                    (week) => week.count
                  ),
                  1
                );

                const height =
                  (item.count / maxCount) * 100;

                return (
                  <div
                    key={item.week}
                    className="flex h-full flex-1 flex-col items-center justify-end"
                  >

                    <span className="mb-2 text-xs font-semibold text-gray-700">
                      {item.count}
                    </span>

                    <div
                      className="w-full rounded-t-md bg-gray-900"
                      style={{
                        height: `${Math.max(
                          height,
                          item.count > 0 ? 5 : 1
                        )}%`,
                      }}
                    />

                    <span className="mt-2 text-xs text-gray-500">
                      {formatWeek(item.week)}
                    </span>

                  </div>
                );
              })
            )}

          </div>

        </div>


        {/* =========================
            QUICK ACTIONS
        ========================== */}

        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Quick Actions
        </h3>

        <div className="grid gap-6 md:grid-cols-3">

          {/* =========================
              COMMON: CREATE ARTICLE
          ========================== */}

          {(isWriter || isEditor) && (
            <ActionCard
              title="Create Article"
              description={
                isEditor
                  ? "Create an article and assign it to a writer and section."
                  : "Create a new article in one of your assigned sections."
              }
              button="Create Article"
              onClick={() => navigate("/articles/new")}
            />
          )}


          {/* =========================
              WRITER ONLY
          ========================== */}

          {isWriter && (
            <ActionCard
              title="My Articles"
              description="View and manage your own articles and drafts."
              button="View Articles"
              onClick={() => navigate("/articles/my")}
            />
          )}


          {/* =========================
              COMMON: PUBLISHED
          ========================== */}

          {(isWriter || isEditor) && (
            <ActionCard
              title="Published Articles"
              description="View published editorial content."
              button="View Published"
              onClick={() => navigate("/published")}
            />
          )}


          {/* =========================
              EDITOR ONLY
          ========================== */}

          {isEditor && (
            <>
              <ActionCard
                title="Review Articles"
                description="Review submitted articles and approve or request changes."
                button="Review"
                onClick={() =>
                  navigate("/editor/review")
                }
              />

              <ActionCard
                title="Approved Articles"
                description="Schedule approved articles or publish them immediately."
                button="Manage"
                onClick={() =>
                  navigate("/editor/approved")
                }
              />

              <ActionCard
                title="Section Management"
                description="Create, edit, archive, restore and manage section assignments."
                button="Manage Sections"
                onClick={() =>
                  navigate("/editor/sections")
                }
              />

              <ActionCard
                title="Overdue Alerts"
                description="View scheduled articles whose publish time has passed."
                button="View Alerts"
                onClick={() =>
                  navigate("/editor/alerts")
                }
              />
            </>
          )}

        </div>

      </main>
    </div>
  );
};


/* =========================
   STAT CARD
========================= */

const StatCard = ({
  title,
  value,
  loading,
}) => (
  <div className="rounded-xl border bg-white p-5 shadow-sm">

    <p className="text-sm text-gray-500">
      {title}
    </p>

    <p className="mt-2 text-3xl font-bold text-gray-900">
      {loading ? "..." : value ?? 0}
    </p>

  </div>
);


/* =========================
   ACTION CARD
========================= */

const ActionCard = ({
  title,
  description,
  button,
  onClick,
}) => (
  <div className="rounded-xl border bg-white p-6 shadow-sm">

    <h3 className="text-lg font-semibold text-gray-900">
      {title}
    </h3>

    <p className="mt-2 text-sm text-gray-500">
      {description}
    </p>

    <button
      onClick={onClick}
      className="mt-6 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
    >
      {button}
    </button>

  </div>
);


/* =========================
   FORMAT STATUS
========================= */

const formatStatus = (status) => {
  if (!status) return "";

  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};


/* =========================
   FORMAT WEEK
========================= */

const formatWeek = (date) => {
  const d = new Date(date);

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};


export default Dashboard;