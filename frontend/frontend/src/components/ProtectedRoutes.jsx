import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  // Safely get user from localStorage
  const storedUser = localStorage.getItem("user");

  if (!storedUser) {
    return <Navigate to="/" replace />;
  }

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    localStorage.removeItem("user");
    return <Navigate to="/" replace />;
  }

  const userRole = user.role?.trim().toUpperCase();

  // Invalid role or role mismatch
  if (!userRole || (role && userRole !== role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;