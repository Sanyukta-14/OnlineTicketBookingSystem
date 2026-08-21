import { Navigate } from "react-router-dom";


// =========================================================
// PROTECTED ROUTE
// =========================================================
//
// This component protects normal USER pages.
//
// Protected pages include:
//
// /
// /events
// /events/:eventId/seats
// /seats/:eventId
// /booking
// /bookings
// /users
// /users/:userId
//
// Admin pages are protected separately by AdminRoute.
//
// =========================================================

function ProtectedRoute({ children }) {

  // =========================================================
  // GET LOGGED-IN USER
  // =========================================================

  const savedUser =
    localStorage.getItem("loggedInUser");


  // =========================================================
  // USER NOT LOGGED IN
  // =========================================================

  if (!savedUser) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // =========================================================
  // READ USER DATA
  // =========================================================

  let user;

  try {

    user =
      JSON.parse(savedUser);

  } catch (error) {

    console.error(
      "Invalid logged-in user:",
      error
    );


    // -------------------------------------------------------
    // REMOVE INVALID SESSION
    // -------------------------------------------------------

    localStorage.removeItem(
      "loggedInUser"
    );


    // -------------------------------------------------------
    // REDIRECT TO LOGIN
    // -------------------------------------------------------

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // =========================================================
  // VALIDATE USER
  // =========================================================

  if (
    !user ||
    !user.id
  ) {

    localStorage.removeItem(
      "loggedInUser"
    );


    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }


  // =========================================================
  // CHECK ADMIN ACCOUNT
  // =========================================================
  //
  // Admin accounts should use:
  //
  // /admin/login
  //
  // and:
  //
  // loggedInAdmin
  //
  // Therefore, if an ADMIN somehow exists inside
  // loggedInUser, remove it and send the user to
  // the correct admin login page.
  //
  // =========================================================

  const role =
    user.role
      ? user.role.trim().toUpperCase()
      : "USER";


  if (role === "ADMIN") {

    localStorage.removeItem(
      "loggedInUser"
    );


    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }


  // =========================================================
  // NORMAL USER ALLOWED
  // =========================================================

  return children;
}


export default ProtectedRoute;