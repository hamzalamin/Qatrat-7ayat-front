import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

const ProtectedRoute = ({ requiredRole, children }) => {
  const { user, isAuthenticated, isLoading, authChecked } = useAuth();
  const location = useLocation();

  if (isLoading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-primary-100 rounded-full mb-4"></div>
          <div className="h-6 w-64 bg-neutral-200 rounded mb-4"></div>
          <div className="h-4 w-40 bg-neutral-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredRole && (!user.roles || !user.roles.includes(requiredRole))) {
    return <Navigate to="/forbidden" replace />;
  }

  return children; 
};

export default ProtectedRoute;