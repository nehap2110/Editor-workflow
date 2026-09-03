
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const linkClass = (path) =>
    `text-sm font-medium transition ${
      isActive(path)
        ? "text-gray-900"
        : "text-gray-500 hover:text-gray-900"
    }`;

  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}

        <button
          onClick={() => navigate("/dashboard")}
          className="text-lg font-bold text-gray-900"
        >
          Editorial Workflow
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


          {/* Writer */}

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


          {/* Editor */}

          {user?.role === "editor" && (
            <button
              onClick={() => navigate("/editor/review")}
              className={linkClass("/editor/review")}
            >
              Review Articles
            </button>
          )}


          {/* Published */}

          <button
            onClick={() => navigate("/published")}
            className={linkClass("/published")}
          >
            Published
          </button>

        </nav>


        {/* User / Logout */}

        <div className="flex items-center gap-4">

          <div className="hidden text-right sm:block">

            <p className="text-sm font-medium text-gray-900">
              {user?.name}
            </p>

            <p className="text-xs capitalize text-gray-500">
              {user?.role}
            </p>

          </div>

          <button
            onClick={logout}
            className="rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900"
          >
            Log out
          </button>

        </div>

      </div>
    </header>
  );
};

export default Navbar;

