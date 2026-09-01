import { useAuth } from "../context/AuthContext.jsx";

/**
 * Intentionally minimal for Day 1. This will later show role-specific
 * statistics, article lists, and workflow actions - none of that is
 * implemented yet.
 */
const Dashboard = () => {
  const { user, logout } = useAuth();

  const roleLabel =
    user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md text-center w-full max-w-sm">
        <h1 className="text-xl font-semibold text-gray-800">
          Welcome, {user?.name}
        </h1>
        <p className="text-sm text-gray-500 mt-1">Role: {roleLabel}</p>

        <button
          onClick={logout}
          className="mt-6 w-full bg-gray-800 text-white text-sm font-medium py-2 rounded hover:bg-gray-900"
        >
          Log out
        </button>
      </div>
    </div>
  );
};

export default Dashboard;