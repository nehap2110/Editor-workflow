import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const roleLabel =
    user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Editorial Workflow
            </h1>

            <p className="text-sm text-gray-500">
              Dashboard
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome, {user?.name}
          </h2>

          <p className="mt-1 text-gray-500">
            You are logged in as a{" "}
            <span className="font-medium text-gray-700">
              {roleLabel}
            </span>
            .
          </p>
        </div>

        {/* Writer Dashboard */}
        {user?.role === "writer" && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Create Article */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">
                Write an Article
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Create a new article and submit it to the editorial
                team for review.
              </p>

              <button
                onClick={() => navigate("/articles/new")}
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
                View your drafts, submitted articles, and articles
                returned for changes.
              </p>

              <button
                onClick={() => navigate("/articles/my")}
                className="mt-6 rounded-md border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                View My Articles
              </button>
            </div>
          </div>
        )}

        {/* Editor Dashboard */}
        {user?.role === "editor" && (
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">
              Editorial Review
            </h3>

            <p className="mt-2 max-w-2xl text-sm text-gray-500">
              Review articles submitted by writers, request changes,
              or approve articles for publication.
            </p>

            <button
              onClick={() => navigate("/editor/review")}
              className="mt-6 rounded-md bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Review Articles
            </button>
          </div>
        )}

        {/* Unknown role */}
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