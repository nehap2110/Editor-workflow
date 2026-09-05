
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">

        {/* ======================================
            WELCOME HEADER
        ====================================== */}
        <section className="mb-10">

          <div className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-white/80 p-6 shadow-sm backdrop-blur-sm sm:p-8 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                Editorial Workspace
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Welcome, {user?.name}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                {isEditor
                  ? "Manage your editorial workflow, sections and publishing activity."
                  : "Manage your articles and editorial workflow."}
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {user?.name}
                </p>

                <p className="text-xs capitalize text-gray-500">
                  {user?.role}
                </p>
              </div>
            </div>

          </div>
        </section>


        {/* ======================================
            MAIN STATISTICS
        ====================================== */}
        <section className="mb-10">

          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                Overview
              </p>

              <h3 className="mt-1 text-xl font-bold text-gray-900">
                Workflow Statistics
              </h3>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <StatCard
              title="In Review"
              value={stats.inReview}
              loading={loading}
              accent="blue"
            />

            <StatCard
              title="Scheduled This Week"
              value={stats.scheduledThisWeek}
              loading={loading}
              accent="purple"
            />

            <StatCard
              title="Published This Week"
              value={stats.publishedThisWeek}
              loading={loading}
              accent="green"
            />

            <StatCard
              title="Open Drafts"
              value={stats.openDrafts}
              loading={loading}
              accent="orange"
            />

          </div>
        </section>


        {/* ======================================
            BREAKDOWNS
        ====================================== */}
        <section className="mb-10 grid gap-6 lg:grid-cols-2">

          {/* Articles by Status */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-200 hover:shadow-md">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                  Workflow
                </p>

                <h3 className="mt-1 text-lg font-bold text-gray-900">
                  Articles by Status
                </h3>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                ✓
              </div>

            </div>

            {loading ? (
              <div className="space-y-4">
                <div className="h-4 animate-pulse rounded bg-gray-100" />
                <div className="h-4 animate-pulse rounded bg-gray-100" />
                <div className="h-4 animate-pulse rounded bg-gray-100" />
              </div>
            ) : statusBreakdown.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                <p className="text-sm text-gray-500">
                  No articles found.
                </p>
              </div>
            ) : (
              <div className="space-y-3">

                {statusBreakdown.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 transition hover:border-blue-100 hover:bg-blue-50/50"
                  >
                    <span className="text-sm font-medium text-gray-600">
                      {formatStatus(item._id)}
                    </span>

                    <span className="rounded-lg bg-white px-3 py-1 text-sm font-bold text-gray-900 shadow-sm">
                      {item.count}
                    </span>
                  </div>
                ))}

              </div>
            )}

          </div>


          {/* Articles by Section */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-200 hover:shadow-md">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                  Content
                </p>

                <h3 className="mt-1 text-lg font-bold text-gray-900">
                  Articles by Section
                </h3>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                ▦
              </div>

            </div>

            {loading ? (
              <div className="space-y-4">
                <div className="h-4 animate-pulse rounded bg-gray-100" />
                <div className="h-4 animate-pulse rounded bg-gray-100" />
                <div className="h-4 animate-pulse rounded bg-gray-100" />
              </div>
            ) : sectionBreakdown.length === 0 ? (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center">
                <p className="text-sm text-gray-500">
                  No articles found.
                </p>
              </div>
            ) : (
              <div className="space-y-3">

                {sectionBreakdown.map((item) => (
                  <div
                    key={item.sectionId}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 transition hover:border-blue-100 hover:bg-blue-50/50"
                  >
                    <span className="text-sm font-medium text-gray-600">
                      {item.sectionName}
                    </span>

                    <span className="rounded-lg bg-white px-3 py-1 text-sm font-bold text-gray-900 shadow-sm">
                      {item.count}
                    </span>
                  </div>
                ))}

              </div>
            )}

          </div>

        </section>


        {/* ======================================
            PUBLISHED LAST 8 WEEKS
        ====================================== */}
        <section className="mb-10 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                Publishing Activity
              </p>

              <h3 className="mt-1 text-xl font-bold text-gray-900">
                Published Articles — Last 8 Weeks
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Weekly publishing activity across the editorial workflow.
              </p>
            </div>

          </div>


          <div className="mt-8 flex h-64 items-end gap-2 border-b border-gray-100 pb-0 sm:gap-4">

            {loading ? (
              <div className="flex h-full w-full items-center justify-center">
                <p className="text-sm text-gray-500">
                  Loading chart...
                </p>
              </div>
            ) : publishedPerWeek.length === 0 ? (
              <div className="flex h-full w-full items-center justify-center">
                <p className="text-sm text-gray-500">
                  No publishing data available.
                </p>
              </div>
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
                    className="group flex h-full flex-1 flex-col items-center justify-end"
                  >

                    <span className="mb-2 text-xs font-bold text-gray-700 opacity-0 transition group-hover:opacity-100">
                      {item.count}
                    </span>

                    <div
                      className="w-full max-w-12 rounded-t-lg bg-blue-600 transition-all duration-300 group-hover:bg-blue-700"
                      style={{
                        height: `${Math.max(
                          height,
                          item.count > 0 ? 5 : 1
                        )}%`,
                      }}
                    />

                    <span className="mt-2 whitespace-nowrap text-[11px] text-gray-400">
                      {formatWeek(item.week)}
                    </span>

                  </div>
                );
              })
            )}

          </div>
        </section>


        {/* ======================================
            QUICK ACTIONS
        ====================================== */}
        <section>

          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
              Workspace
            </p>

            <h3 className="mt-1 text-xl font-bold text-gray-900">
              Quick Actions
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Jump directly to the tools you use most.
            </p>
          </div>


          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {/* COMMON: CREATE ARTICLE */}
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


            {/* WRITER ONLY */}
            {isWriter && (
              <ActionCard
                title="My Articles"
                description="View and manage your own articles and drafts."
                button="View Articles"
                onClick={() => navigate("/articles/my")}
              />
            )}


            {/* COMMON: PUBLISHED */}
            {(isWriter || isEditor) && (
              <ActionCard
                title="Published Articles"
                description="View published editorial content."
                button="View Published"
                onClick={() => navigate("/published")}
              />
            )}


            {/* EDITOR ONLY */}
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

        </section>

      </main>
    </div>
  );
};


/* ==========================================
   STAT CARD
========================================== */

const StatCard = ({
  title,
  value,
  loading,
  accent = "blue",
}) => {

  const accentStyles = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
    orange: "bg-orange-50 text-orange-600",
  };

  return (
    <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <p className="mt-3 text-3xl font-bold tracking-tight text-gray-900">
            {loading ? "..." : value ?? 0}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${accentStyles[accent]}`}
        >
          {loading ? "…" : value ?? 0}
        </div>

      </div>

      <div className="mt-5 h-1 overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full w-1/3 rounded-full transition-all duration-500 ${accentStyles[accent]
            .split(" ")[0]
            .replace("bg-", "bg-")}`}
        />
      </div>

    </div>
  );
};


/* ==========================================
   ACTION CARD
========================================== */

const ActionCard = ({
  title,
  description,
  button,
  onClick,
}) => (
  <div className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-100 hover:shadow-lg">

    <div className="flex-1">

      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-blue-600 transition duration-200 group-hover:bg-blue-600 group-hover:text-white">
        →
      </div>

      <h3 className="text-lg font-bold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {description}
      </p>

    </div>

    <button
      onClick={onClick}
      className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {button}
      <span className="transition-transform duration-200 group-hover:translate-x-1">
        →
      </span>
    </button>

  </div>
);


/* ==========================================
   FORMAT STATUS
========================================== */

const formatStatus = (status) => {
  if (!status) return "";

  return status
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) =>
      char.toUpperCase()
    );
};


/* ==========================================
   FORMAT WEEK
========================================== */

const formatWeek = (date) => {
  const d = new Date(date);

  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
};


export default Dashboard;

