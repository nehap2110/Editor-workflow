
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

const Navbar = () => {
  const { user, logout } = useAuth();

  console.log("Navbar user:", user);
  console.log("Navbar role:", user?.role);

  const [overdueCount, setOverdueCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  // ==========================================
  // OVERDUE ALERT COUNT
  // ==========================================

  useEffect(() => {
    if (user?.role !== "editor") {
      setOverdueCount(0);
      return;
    }

    const fetchOverdueCount = async () => {
      try {
        const response = await api.get(
          "/articles/alerts/overdue/count"
        );

        setOverdueCount(response.data.count || 0);
      } catch (error) {
        console.error(
          "Failed to fetch overdue alert count:",
          error
        );
      }
    };

    fetchOverdueCount();

    const interval = setInterval(
      fetchOverdueCount,
      60 * 1000
    );

    return () => clearInterval(interval);
  }, [user?.role]);

  // ==========================================
  // EXPORT EDITORIAL CALENDAR
  // ==========================================

  const handleExportCalendar = async () => {
    try {
      const response = await api.get(
        "/articles/calendar/export",
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], {
        type: "text/csv",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "editorial-calendar.csv";

      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(
        "Editorial calendar export error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to export editorial calendar."
      );
    }
  };

  // ==========================================
  // ACTIVE LINK
  // ==========================================

  const isActive = (path) => {
    return location.pathname === path;
  };

  const linkClass = (path) =>
    `relative text-[13px] font-medium transition ${
      isActive(path)
        ? "text-press"
        : "text-muted hover:text-ink"
    }`;

  return (
    <header className="border-b border-hairline bg-paper">
      <div className="h-[3px] bg-press" />

      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        {/* Logo */}
        <button
          onClick={() => navigate("/dashboard")}
          className="group shrink-0 text-left"
        >
          <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-press">
            Editorial
          </p>

          <p className="font-serif text-xl font-semibold tracking-tight text-ink transition group-hover:text-press">
            Workflow
          </p>
        </button>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {/* Common */}
          <button
            onClick={() => navigate("/dashboard")}
            className={linkClass("/dashboard")}
          >
            Dashboard
          </button>

          {/* ==========================================
              WRITER
          ========================================== */}

          {user?.role === "writer" && (
            <>
              <button
                onClick={() => navigate("/articles/my")}
                className={linkClass("/articles/my")}
              >
                My Articles
              </button>

              <button
                onClick={() => navigate("/articles/new")}
                className={linkClass("/articles/new")}
              >
                New Article
              </button>
            </>
          )}

          {/* ==========================================
              EDITOR
          ========================================== */}

          {user?.role === "editor" && (
            <>
              <button
                onClick={() => navigate("/editor/review")}
                className={linkClass("/editor/review")}
              >
                Review Articles
              </button>

              <button
                onClick={() => navigate("/editor/scheduled")}
                className={linkClass("/editor/scheduled")}
              >
                Scheduled Articles
              </button>

              {/* Alerts */}
              <button
                onClick={() => navigate("/editor/alerts")}
                className={`${linkClass(
                  "/editor/alerts"
                )} flex items-center gap-1.5`}
              >
                Alerts

                {overdueCount > 0 && (
                  <span className="inline-flex min-w-5 items-center justify-center border border-press bg-press px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {overdueCount}
                  </span>
                )}
              </button>

              {/* Export Calendar */}
              <button
                onClick={handleExportCalendar}
                className="text-[13px] font-medium text-muted transition hover:text-ink"
              >
                Export Calendar
              </button>
            </>
          )}

          {/* ==========================================
              PUBLISHED
          ========================================== */}

          <button
            onClick={() => navigate("/published")}
            className={linkClass("/published")}
          >
            Published
          </button>
        </nav>

        {/* ==========================================
            USER / LOGOUT
        ========================================== */}

        <div className="flex items-center gap-4">
          <div className="hidden border-l border-hairline pl-4 text-right sm:block">
            <p className="text-sm font-medium text-ink">
              {user?.name}
            </p>

            <p className="text-[10px] uppercase tracking-[0.14em] text-muted">
              {user?.role}
            </p>
          </div>

          <button
            onClick={logout}
            className="border border-hairline bg-white px-4 py-2 text-[13px] font-medium text-ink transition hover:border-press hover:bg-press hover:text-white"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

