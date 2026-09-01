import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

/**
 * Wraps a page that should only be reachable by a logged-in user.
 * This is a UX convenience only - it prevents rendering a page that
 * would just fail its API calls. It is NOT the security boundary;
 * every protected API endpoint independently verifies the JWT on the
 * backend regardless of what the frontend does.
 */
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;