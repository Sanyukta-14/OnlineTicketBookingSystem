import { useEffect, useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

// =========================================================
// COMPONENTS
// =========================================================

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// =========================================================
// USER PAGES
// =========================================================

import Home from "./pages/Home";
import Events from "./pages/Events";
import SeatSelection from "./pages/SeatSelection";
import Booking from "./pages/Booking";
import MyBookings from "./pages/MyBookings";
import UserProfile from "./pages/UserProfile";

// =========================================================
// ADMIN / USER MANAGEMENT
// =========================================================

import Users from "./pages/Users";

// =========================================================
// USER AUTH PAGES
// =========================================================

import Login from "./pages/Login";
import Register from "./pages/Register";

// =========================================================
// ADMIN PAGES
// =========================================================

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminBookings from "./pages/admin/AdminBookings";


// =========================================================
// GET LOGGED-IN USER
// =========================================================

function getLoggedInUser() {

  const savedUser =
    localStorage.getItem("loggedInUser");

  if (!savedUser) {
    return null;
  }

  try {

    const user = JSON.parse(savedUser);

    if (!user || !user.id) {

      localStorage.removeItem(
        "loggedInUser"
      );

      return null;
    }

    const role =
      typeof user.role === "string"
        ? user.role.trim().toUpperCase()
        : "USER";


    // -------------------------------------------------------
    // ADMIN MUST NOT BE STORED AS NORMAL USER
    // -------------------------------------------------------

    if (role === "ADMIN") {

      localStorage.removeItem(
        "loggedInUser"
      );

      return null;
    }


    return {
      ...user,
      role: "USER",
    };

  } catch (error) {

    console.error(
      "Invalid logged-in user:",
      error
    );

    localStorage.removeItem(
      "loggedInUser"
    );

    return null;
  }
}


// =========================================================
// GET LOGGED-IN ADMIN
// =========================================================

function getLoggedInAdmin() {

  const savedAdmin =
    localStorage.getItem("loggedInAdmin");

  if (!savedAdmin) {
    return null;
  }

  try {

    const admin = JSON.parse(savedAdmin);

    if (!admin || !admin.id) {

      localStorage.removeItem(
        "loggedInAdmin"
      );

      return null;
    }

    const role =
      typeof admin.role === "string"
        ? admin.role.trim().toUpperCase()
        : "";


    // -------------------------------------------------------
    // ONLY ADMIN ROLE CAN USE ADMIN SESSION
    // -------------------------------------------------------

    if (role !== "ADMIN") {

      localStorage.removeItem(
        "loggedInAdmin"
      );

      return null;
    }


    return {
      ...admin,
      role: "ADMIN",
    };

  } catch (error) {

    console.error(
      "Invalid logged-in admin:",
      error
    );

    localStorage.removeItem(
      "loggedInAdmin"
    );

    return null;
  }
}


// =========================================================
// APP CONTENT
// =========================================================

function AppContent() {

  const location = useLocation();


  // =======================================================
  // USER STATE
  // =======================================================

  const [
    loggedInUser,
    setLoggedInUser
  ] = useState(
    getLoggedInUser
  );


  // =======================================================
  // ADMIN STATE
  // =======================================================

  const [
    loggedInAdmin,
    setLoggedInAdmin
  ] = useState(
    getLoggedInAdmin
  );


  // =======================================================
  // AUTH CHANGE LISTENER
  // =======================================================

  useEffect(() => {

    const refreshAuthState = () => {

      setLoggedInUser(
        getLoggedInUser()
      );

      setLoggedInAdmin(
        getLoggedInAdmin()
      );

    };


    window.addEventListener(
      "authChange",
      refreshAuthState
    );

    window.addEventListener(
      "adminAuthChange",
      refreshAuthState
    );


    return () => {

      window.removeEventListener(
        "authChange",
        refreshAuthState
      );

      window.removeEventListener(
        "adminAuthChange",
        refreshAuthState
      );

    };

  }, []);


  // =======================================================
  // CURRENT PATH
  // =======================================================

  const currentPath =
    location.pathname;


  // =======================================================
  // USER AUTH PAGE
  // =======================================================

  const isUserAuthPage =
    currentPath === "/login" ||
    currentPath === "/register";


  // =======================================================
  // ADMIN LOGIN PAGE
  // =======================================================

  const isAdminLoginPage =
    currentPath === "/admin/login";


  // =======================================================
  // ADMIN PAGE
  // =======================================================

  const isAdminPage =
    currentPath === "/admin" ||
    currentPath.startsWith("/admin/");


  // =======================================================
  // SHOW USER NAVBAR
  // =======================================================

  const showNavbar =
    !isUserAuthPage &&
    !isAdminLoginPage &&
    !isAdminPage;


  // =========================================================
  // APPLICATION
  // =========================================================

  return (
    <>

      {/* =====================================================
          USER NAVBAR

          IMPORTANT:
          User Management is NOT added here.

          Normal users can see:
          Home
          Events
          My Bookings
          My Profile
          Logout
      ===================================================== */}

      {showNavbar && <Navbar />}


      {/* =====================================================
          ROUTES
      ===================================================== */}

      <Routes>


        {/* ===================================================
            USER LOGIN
        =================================================== */}

        <Route
          path="/login"
          element={

            loggedInAdmin ? (

              <Navigate
                to="/admin"
                replace
              />

            ) : loggedInUser ? (

              <Navigate
                to="/"
                replace
              />

            ) : (

              <Login />

            )

          }
        />


        {/* ===================================================
            USER REGISTER
        =================================================== */}

        <Route
          path="/register"
          element={

            loggedInAdmin ? (

              <Navigate
                to="/admin"
                replace
              />

            ) : loggedInUser ? (

              <Navigate
                to="/"
                replace
              />

            ) : (

              <Register />

            )

          }
        />


        {/* ===================================================
            HOME
        =================================================== */}

        <Route
          path="/"
          element={

            <ProtectedRoute>
              <Home />
            </ProtectedRoute>

          }
        />


        {/* ===================================================
            EVENTS
        =================================================== */}

        <Route
          path="/events"
          element={

            <ProtectedRoute>
              <Events />
            </ProtectedRoute>

          }
        />


        {/* ===================================================
            SEAT SELECTION
        =================================================== */}

        <Route
          path="/events/:eventId/seats"
          element={

            <ProtectedRoute>
              <SeatSelection />
            </ProtectedRoute>

          }
        />


        {/* ===================================================
            ALTERNATIVE SEAT ROUTE
        =================================================== */}

        <Route
          path="/seats/:eventId"
          element={

            <ProtectedRoute>
              <SeatSelection />
            </ProtectedRoute>

          }
        />


        {/* ===================================================
            BOOKING
        =================================================== */}

        <Route
          path="/booking"
          element={

            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>

          }
        />


        {/* ===================================================
            MY BOOKINGS
        =================================================== */}

        <Route
          path="/bookings"
          element={

            <ProtectedRoute>
              <MyBookings />
            </ProtectedRoute>

          }
        />


        {/* ===================================================
            NORMAL USER PROFILE

            IMPORTANT:
            This is the profile that normal users can access.

            URL:
            /profile/:userId
        =================================================== */}

        <Route
          path="/profile/:userId"
          element={

            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>

          }
        />


        {/* ===================================================
            ADMIN USER MANAGEMENT

            IMPORTANT:
            /users is ADMIN ONLY.

            Normal users cannot access this page.
        =================================================== */}

        <Route
          path="/users"
          element={

            <AdminRoute>
              <Users />
            </AdminRoute>

          }
        />


        {/* ===================================================
            ADMIN USER PROFILE

            This is the profile opened from the Admin
            User Management page.

            URL:
            /users/:userId

            ADMIN ONLY.
        =================================================== */}

        <Route
          path="/users/:userId"
          element={

            <AdminRoute>
              <UserProfile />
            </AdminRoute>

          }
        />


        {/* ===================================================
            ADMIN LOGIN
        =================================================== */}

        <Route
          path="/admin/login"
          element={

            loggedInAdmin ? (

              <Navigate
                to="/admin"
                replace
              />

            ) : loggedInUser ? (

              <Navigate
                to="/"
                replace
              />

            ) : (

              <AdminLogin />

            )

          }
        />


        {/* ===================================================
            ADMIN DASHBOARD
        =================================================== */}

        <Route
          path="/admin"
          element={

            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>

          }
        />


        {/* ===================================================
            ADMIN USERS
        =================================================== */}

        <Route
          path="/admin/users"
          element={

            <AdminRoute>
              <AdminUsers />
            </AdminRoute>

          }
        />


        {/* ===================================================
            ADMIN EVENTS
        =================================================== */}

        <Route
          path="/admin/events"
          element={

            <AdminRoute>
              <AdminEvents />
            </AdminRoute>

          }
        />


        {/* ===================================================
            ADMIN BOOKINGS
        =================================================== */}

        <Route
          path="/admin/bookings"
          element={

            <AdminRoute>
              <AdminBookings />
            </AdminRoute>

          }
        />


        {/* ===================================================
            UNKNOWN ADMIN ROUTE
        =================================================== */}

        <Route
          path="/admin/*"
          element={

            <AdminRoute>

              <Navigate
                to="/admin"
                replace
              />

            </AdminRoute>

          }
        />


        {/* ===================================================
            UNKNOWN ROUTE
        =================================================== */}

        <Route
          path="*"
          element={

            loggedInAdmin ? (

              <Navigate
                to="/admin"
                replace
              />

            ) : loggedInUser ? (

              <Navigate
                to="/"
                replace
              />

            ) : (

              <Navigate
                to="/login"
                replace
              />

            )

          }
        />

      </Routes>

    </>
  );
}


// =========================================================
// MAIN APP
// =========================================================

function App() {

  return (

    <BrowserRouter>

      <AppContent />

    </BrowserRouter>

  );
}


// =========================================================
// EXPORT
// =========================================================

export default App;
