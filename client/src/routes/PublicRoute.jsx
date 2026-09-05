import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";


const PublicRoute = ({ children }) => {
  const { token } = useAuth();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;