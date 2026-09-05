
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
  const statusBreakdown = dashboard?.statusBreakdown || [];
  const sectionBreakdown = dashboard?.sectionBreakdown || [];
  const publishedPerWeek = dashboard?.publishedPerWeek || [];

  const isEditor = user?.role === "editor";
  const isWriter = user?.role === "writer";

  return (
    <div className="min-h-screen bg-paper font-sans text-ink antialiased">

      {/* Editorial accent */}
      <div className="h-[3px] bg-press" />

      <Navbar />

      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-6 lg:px-8">

        {/* ======================================
            PAGE HEADER
        ====================================== */}
        <section className="mb-10 border-b border-hairline pb-8">

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-press">
                Editorial Dashboard
              </p>

              <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-5xl">
                Welcome, {user?.name}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                {isEditor
                  ? "Manage your editorial workflow, sections and publishing activity."
                  : "Manage your articles and editorial workflow."}
              </p>
            </div>

            {/* Role */}
            <div className="flex items-center gap-3 border-l-2 border-press pl-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted">
                  Current Role
                </p>

                <p className="mt-1 font-serif text-lg font-semibold capitalize text-ink">
                  {user?.role}
                </p>
              </div>
            </div>

          </div>
        </section>


        {/* ======================================
            WORKFLOW OVERVIEW
        ====================================== */}
        <section className="mb-10">

          <div className="mb-5 flex items-end justify-between border-b border-hairline pb-3">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-press">
                Overview
              </p>

              <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">
                Workflow Statistics
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 border-l border-t border-hairline sm:grid-cols-4">

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
        </section>


        {/* ======================================
            BREAKDOWNS
        ====================================== */}
        <section className="mb-10 grid gap-8 lg:grid-cols-2">

          {/* Articles by Status */}
          <BreakdownCard
            eyebrow="Workflow"
            title="Articles by Status"
          >
            {loading ? (
              <LoadingRows />
            ) : statusBreakdown.length === 0 ? (
              <EmptyState text="No articles found." />
            ) : (
              <div className="divide-y divide-hairline">
                {statusBreakdown.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between py-4"
                  >
                    <span className="text-sm text-muted">
                      {formatStatus(item._id)}
                    </span>

                    <span className="min-w-9 rounded-full border border-hairline bg-paper px-3 py-1 text-center text-sm font-semibold text-ink">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </BreakdownCard>


          {/* Articles by Section */}
          <BreakdownCard
            eyebrow="Content"
            title="Articles by Section"
          >
            {loading ? (
              <LoadingRows />
            ) : sectionBreakdown.length === 0 ? (
              <EmptyState text="No articles found." />
            ) : (
              <div className="divide-y divide-hairline">
                {sectionBreakdown.map((item) => (
                  <div
                    key={item.sectionId}
                    className="flex items-center justify-between py-4"
                  >
                    <span className="text-sm text-muted">
                      {item.sectionName}
                    </span>

                    <span className="min-w-9 rounded-full border border-hairline bg-paper px-3 py-1 text-center text-sm font-semibold text-ink">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </BreakdownCard>

        </section>


        {/* ======================================
            PUBLISHED ARTICLES CHART
        ====================================== */}
        <section className="mb-10 border-y border-hairline bg-white">

          <div className="border-b border-hairline px-5 py-6 sm:px-7">

            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-press">
              Publishing Activity
            </p>

            <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">
              Published Articles — Last 8 Weeks
            </h2>

            <p className="mt-2 text-sm text-muted">
              Weekly publishing activity across the editorial workflow.
            </p>

          </div>


          <div className="px-5 py-7 sm:px-7">

            <div className="flex h-64 items-end gap-2 border-b border-hairline sm:gap-4">

              {loading ? (
                <div className="flex h-full w-full items-center justify-center">
                  <p className="text-sm text-muted">
                    Loading chart...
                  </p>
                </div>
              ) : publishedPerWeek.length === 0 ? (
                <div className="flex h-full w-full items-center justify-center">
                  <p className="text-sm text-muted">
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

                      <span className="mb-2 text-xs font-semibold text-ink opacity-0 transition-opacity group-hover:opacity-100">
                        {item.count}
                      </span>

                      <div
                        className="w-full max-w-12 rounded-t-sm bg-press transition-opacity group-hover:opacity-80"
                        style={{
                          height: `${Math.max(
                            height,
                            item.count > 0 ? 5 : 1
                          )}%`,
                        }}
                      />

                      <span className="mt-2 whitespace-nowrap text-[11px] text-muted">
                        {formatWeek(item.week)}
                      </span>

                    </div>
                  );
                })
              )}

            </div>

          </div>
        </section>


        {/* ======================================
            QUICK ACTIONS
        ====================================== */}
        <section>

          <div className="mb-5 border-b border-hairline pb-3">

            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-press">
              Workspace
            </p>

            <h2 className="mt-1 font-serif text-2xl font-semibold text-ink">
              Quick Actions
            </h2>

          </div>


          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

            {/* CREATE ARTICLE */}
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


            {/* MY ARTICLES */}
            {isWriter && (
              <ActionCard
                title="My Articles"
                description="View and manage your own articles and drafts."
                button="View Articles"
                onClick={() => navigate("/articles/my")}
              />
            )}


            {/* PUBLISHED */}
            {(isWriter || isEditor) && (
              <ActionCard
                title="Published Articles"
                description="View published editorial content."
                button="View Published"
                onClick={() => navigate("/published")}
              />
            )}


            {/* EDITOR ACTIONS */}
            {isEditor && (
              <>
                <ActionCard
                  title="Review Articles"
                  description="Review submitted articles and approve or request changes."
                  button="Review Articles"
                  onClick={() =>
                    navigate("/editor/review")
                  }
                />

                <ActionCard
                  title="Approved Articles"
                  description="Schedule approved articles or publish them immediately."
                  button="Manage Articles"
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
}) => (
  <div className="border-b border-r border-hairline bg-white p-5 transition-colors hover:bg-[#f6f5ef]">

    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
      {title}
    </p>

    <p className="mt-3 font-serif text-4xl font-semibold text-ink">
      {loading ? "..." : value ?? 0}
    </p>

    <div className="mt-4 h-[2px] w-8 bg-press" />

  </div>
);


/* ==========================================
   BREAKDOWN CARD
========================================== */

const BreakdownCard = ({
  eyebrow,
  title,
  children,
}) => (
  <div className="border-y border-hairline bg-white px-5 sm:px-7">

    <div className="border-b border-hairline py-5">

      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-press">
        {eyebrow}
      </p>

      <h3 className="mt-1 font-serif text-xl font-semibold text-ink">
        {title}
      </h3>

    </div>

    {children}

  </div>
);


/* ==========================================
   ACTION CARD
========================================== */

const ActionCard = ({
  title,
  description,
  button,
  onClick,
}) => (
  <div className="group flex min-h-[220px] flex-col border border-hairline bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:border-press hover:shadow-sm">

    <div className="flex-1">

      <div className="mb-5 flex items-center gap-3">
        <span className="h-[2px] w-6 bg-press transition-all duration-200 group-hover:w-10" />

        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted">
          Action
        </span>
      </div>

      <h3 className="font-serif text-xl font-semibold text-ink">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-muted">
        {description}
      </p>

    </div>

    <button
      onClick={onClick}
      className="mt-6 inline-flex w-fit items-center gap-2 border-b-2 border-press pb-1 text-sm font-semibold text-ink transition-colors hover:text-press"
    >
      {button}
      <span className="transition-transform duration-200 group-hover:translate-x-1">
        →
      </span>
    </button>

  </div>
);


/* ==========================================
   LOADING ROWS
========================================== */

const LoadingRows = () => (
  <div className="divide-y divide-hairline">
    {[1, 2, 3].map((item) => (
      <div
        key={item}
        className="flex items-center justify-between py-4"
      >
        <div className="h-4 w-28 animate-pulse rounded bg-hairline" />
        <div className="h-7 w-10 animate-pulse rounded-full bg-hairline" />
      </div>
    ))}
  </div>
);


/* ==========================================
   EMPTY STATE
========================================== */

const EmptyState = ({ text }) => (
  <div className="py-8 text-center">
    <p className="text-sm text-muted">
      {text}
    </p>
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

