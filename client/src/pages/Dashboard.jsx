
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);
  const [approvedArticles, setApprovedArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const roleLabel =
    user?.role?.charAt(0).toUpperCase() +
    user?.role?.slice(1);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // ==========================================
        // WRITER DATA
        // ==========================================

        if (user?.role === "writer") {
          const response = await api.get("/articles/my");

          setArticles(response.data.articles || []);
        }

        // ==========================================
        // EDITOR DATA
        // ==========================================

        if (user?.role === "editor") {
          // Submitted articles waiting for review
          const reviewResponse = await api.get(
            "/articles/review"
          );

          setArticles(reviewResponse.data.articles || []);

          // Approved articles waiting to be published
          const approvedResponse = await api.get(
            "/articles/approved"
          );

          setApprovedArticles(
            approvedResponse.data.articles || []
          );
        }
      } catch (error) {
        console.error(
          "Dashboard data error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    if (user?.role) {
      fetchDashboardData();
    }
  }, [user]);

  // ==========================================
  // WRITER STATISTICS
  // ==========================================

  const draftCount = articles.filter(
    (article) => article.status === "DRAFT"
  ).length;

  const submittedCount = articles.filter(
    (article) => article.status === "SUBMITTED"
  ).length;

  const changesRequestedCount = articles.filter(
    (article) => article.status === "CHANGES_REQUESTED"
  ).length;

  const publishedCount = articles.filter(
    (article) => article.status === "PUBLISHED"
  ).length;

  // ==========================================
  // EDITOR STATISTICS
  // ==========================================

  const awaitingReviewCount = articles.filter(
    (article) => article.status === "SUBMITTED"
  ).length;

  const approvedCount = approvedArticles.filter(
    (article) => article.status === "APPROVED"
  ).length;

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ======================================
          HEADER
      ====================================== */}

      <Navbar />

      {/* ======================================
          MAIN
      ====================================== */}

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Welcome */}

        <div className="mb-8">

          <h2 className="text-3xl font-bold text-gray-900">
            Welcome, {user?.name}
          </h2>

          <p className="mt-2 text-gray-500">
            Manage your editorial workflow from here.
          </p>

        </div>


        {/* ======================================
            WRITER DASHBOARD
        ====================================== */}

        {user?.role === "writer" && (
          <>
            {/* Statistics */}

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* Draft */}

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Drafts
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {loading ? "..." : draftCount}
                </p>
              </div>


              {/* Submitted */}

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Submitted
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {loading ? "..." : submittedCount}
                </p>
              </div>


              {/* Changes Requested */}

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Changes Requested
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {loading ? "..." : changesRequestedCount}
                </p>
              </div>


              {/* Published */}

              <div className="rounded-xl border bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">
                  Published
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {loading ? "..." : publishedCount}
                </p>
              </div>

            </div>


            {/* Quick Actions */}

            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Quick Actions
            </h3>

            <div className="grid gap-6 md:grid-cols-3">

              {/* Create */}

              <div className="rounded-xl border bg-white p-6 shadow-sm">

                <h3 className="text-lg font-semibold text-gray-900">
                  Write an Article
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Create a new article and save it as a draft.
                </p>

                <button
                  onClick={() =>
                    navigate("/articles/new")
                  }
                  className="mt-6 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Create Article
                </button>

              </div>


              {/* My Articles */}

              <div className="rounded-xl border bg-white p-6 shadow-sm">

                <h3 className="text-lg font-semibold text-gray-900">
                  My Articles
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  View and manage all your articles.
                </p>

                <button
                  onClick={() =>
                    navigate("/articles/my")
                  }
                  className="mt-6 rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  View My Articles
                </button>

              </div>


              {/* Published */}

              <div className="rounded-xl border bg-white p-6 shadow-sm">

                <h3 className="text-lg font-semibold text-gray-900">
                  Published Articles
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Read articles that have been published.
                </p>

                <button
                  onClick={() =>
                    navigate("/published")
                  }
                  className="mt-6 rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  View Published
                </button>

              </div>

            </div>
          </>
        )}


        {/* ======================================
            EDITOR DASHBOARD
        ====================================== */}

        {user?.role === "editor" && (
          <>
            {/* Editor Statistics */}

            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

              {/* Awaiting Review */}

              <div className="rounded-xl border bg-white p-5 shadow-sm">

                <p className="text-sm text-gray-500">
                  Awaiting Review
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {loading ? "..." : awaitingReviewCount}
                </p>

              </div>


              {/* Approved */}

              <div className="rounded-xl border bg-white p-5 shadow-sm">

                <p className="text-sm text-gray-500">
                  Approved to Publish
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {loading ? "..." : approvedCount}
                </p>

              </div>


              {/* Published */}

              <div className="rounded-xl border bg-white p-5 shadow-sm">

                <p className="text-sm text-gray-500">
                  Published Content
                </p>

                <p className="mt-2 text-sm text-gray-600">
                  View articles that have already been published.
                </p>

              </div>

            </div>


            {/* Editor Actions */}

            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Editorial Actions
            </h3>

            <div className="grid gap-6 md:grid-cols-3">

              {/* Review Articles */}

              <div className="rounded-xl border bg-white p-6 shadow-sm">

                <h3 className="text-lg font-semibold text-gray-900">
                  Review Articles
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Review articles submitted by writers, request
                  changes, or approve articles.
                </p>

                <button
                  onClick={() =>
                    navigate("/editor/review")
                  }
                  className="mt-6 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Review Articles
                </button>

              </div>


              {/* Approved Articles */}

              <div className="rounded-xl border bg-white p-6 shadow-sm">

                <h3 className="text-lg font-semibold text-gray-900">
                  Approved Articles
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  View approved articles and publish them when
                  they are ready.
                </p>

                <button
                  onClick={() =>
                    navigate("/editor/approved")
                  }
                  className="mt-6 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Publish Articles
                </button>

              </div>


              {/* Published Articles */}

              <div className="rounded-xl border bg-white p-6 shadow-sm">

                <h3 className="text-lg font-semibold text-gray-900">
                  Published Articles
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  View articles that have already been published.
                </p>

                <button
                  onClick={() =>
                    navigate("/published")
                  }
                  className="mt-6 rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  View Published
                </button>

              </div>

            </div>
          </>
        )}


        {/* ======================================
            UNKNOWN ROLE
        ====================================== */}

        {!["writer", "editor"].includes(user?.role) && (
          <div className="rounded-xl border bg-white p-6 shadow-sm">

            <h3 className="font-semibold text-gray-900">
              No dashboard available
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Your account role does not have a dashboard configured yet.
            </p>

          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;

