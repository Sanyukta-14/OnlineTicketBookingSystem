import { Navigate, useLocation } from "react-router-dom";

function AdminRoute({ children }) {
  const location = useLocation();

  // =========================================================
  // GET LOGGED-IN ADMIN
  // =========================================================

  const savedAdmin =
    localStorage.getItem("loggedInAdmin");

  // =========================================================
  // ADMIN NOT LOGGED IN
  // =========================================================

  if (!savedAdmin) {
    console.warn(
      "Access denied. Admin login is required."
    );

    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // =========================================================
  // READ ADMIN SESSION
  // =========================================================

  let admin;

  try {
    admin = JSON.parse(savedAdmin);
  } catch (error) {
    console.error(
      "Invalid admin session:",
      error
    );

    localStorage.removeItem("loggedInAdmin");

    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // =========================================================
  // CHECK ADMIN OBJECT
  // =========================================================

  if (
    !admin ||
    typeof admin !== "object" ||
    Array.isArray(admin)
  ) {
    console.warn(
      "Invalid admin session object."
    );

    localStorage.removeItem("loggedInAdmin");

    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // =========================================================
  // CHECK ADMIN ID
  // =========================================================

  if (
    admin.id === undefined ||
    admin.id === null ||
    admin.id === ""
  ) {
    console.warn(
      "Admin session does not contain a valid ID."
    );

    localStorage.removeItem("loggedInAdmin");

    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // =========================================================
  // CHECK ADMIN ROLE
  // =========================================================

  const role =
    typeof admin.role === "string"
      ? admin.role.trim().toUpperCase()
      : "";

  // =========================================================
  // ONLY ADMIN CAN ACCESS
  // =========================================================

  if (role !== "ADMIN") {
    console.warn(
      "Access denied. ADMIN role is required."
    );

    localStorage.removeItem("loggedInAdmin");

    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // =========================================================
  // ADMIN SESSION IS VALID
  // =========================================================

  return children;
}

export default AdminRoute;
