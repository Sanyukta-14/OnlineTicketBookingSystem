import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();

  // =========================================================
  // GET LOGGED-IN USER
  // =========================================================

  const getLoggedInUser = () => {

    const savedUser =
      localStorage.getItem("loggedInUser");

    if (!savedUser) {
      return null;
    }

    try {

      const user = JSON.parse(savedUser);

      // -------------------------------------------------------
      // INVALID USER SESSION
      // -------------------------------------------------------

      if (!user || !user.id) {

        localStorage.removeItem(
          "loggedInUser"
        );

        return null;
      }

      // -------------------------------------------------------
      // ADMIN MUST NOT USE NORMAL USER NAVBAR
      // -------------------------------------------------------

      const role =
        typeof user.role === "string"
          ? user.role.trim().toUpperCase()
          : "USER";

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
  };


  // =========================================================
  // STATE
  // =========================================================

  const [
    loggedInUser,
    setLoggedInUser
  ] = useState(getLoggedInUser);


  // =========================================================
  // LISTEN FOR LOGIN / LOGOUT
  // =========================================================

  useEffect(() => {

    const handleAuthChange = () => {

      setLoggedInUser(
        getLoggedInUser()
      );

    };

    window.addEventListener(
      "authChange",
      handleAuthChange
    );

    return () => {

      window.removeEventListener(
        "authChange",
        handleAuthChange
      );

    };

  }, []);


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    localStorage.removeItem(
      "loggedInUser"
    );

    window.dispatchEvent(
      new Event("authChange")
    );

    navigate("/login");

  };


  // =========================================================
  // CHECK ACTIVE PAGE
  // =========================================================

  const isActive = (path) => {

    if (path === "/") {

      return (
        location.pathname === "/"
      );

    }

    return location.pathname.startsWith(
      path
    );

  };


  // =========================================================
  // USER INITIAL
  // =========================================================

  const userInitial =
    loggedInUser?.name
      ? loggedInUser.name
          .charAt(0)
          .toUpperCase()
      : "U";


  // =========================================================
  // NAVBAR
  // =========================================================

  return (

    <nav className="navbar">

      <div className="navbar-container">


        {/* ===================================================
            LOGO
        =================================================== */}

        <Link
          to="/"
          className="navbar-logo"
        >

          <span className="navbar-logo-icon">
            🎟️
          </span>

          <span className="navbar-logo-text">
            TicketBook
          </span>

        </Link>


        {/* ===================================================
            NAVIGATION
        =================================================== */}

        <div className="navbar-navigation">


          {/* =================================================
              HOME
          ================================================= */}

          <Link
            to="/"
            className={`navbar-link ${
              isActive("/")
                ? "navbar-link-active"
                : ""
            }`}
          >
            Home
          </Link>


          {/* =================================================
              EVENTS
          ================================================= */}

          <Link
            to="/events"
            className={`navbar-link ${
              isActive("/events")
                ? "navbar-link-active"
                : ""
            }`}
          >
            Events
          </Link>


          {/* =================================================
              LOGGED-IN NORMAL USER
          ================================================= */}

          {loggedInUser ? (

            <>

              {/* =============================================
                  MY BOOKINGS
              ============================================= */}

              <Link
                to="/bookings"
                className={`navbar-link ${
                  isActive("/bookings")
                    ? "navbar-link-active"
                    : ""
                }`}
              >
                My Bookings
              </Link>


              {/* =============================================
                  MY PROFILE

                  IMPORTANT:
                  Normal users use /profile/:userId

                  /users is reserved for ADMIN USER MANAGEMENT.
              ============================================= */}

              <Link
                to={`/profile/${loggedInUser.id}`}
                className={`navbar-profile ${
                  isActive("/profile/")
                    ? "navbar-profile-active"
                    : ""
                }`}
              >

                <span className="navbar-user-avatar">
                  {userInitial}
                </span>

                <span className="navbar-user-name">
                  {loggedInUser.name}
                </span>

              </Link>


              {/* =============================================
                  LOGOUT
              ============================================= */}

              <button
                type="button"
                className="navbar-logout"
                onClick={handleLogout}
              >

                <span>
                  ↪
                </span>

                Logout

              </button>

            </>

          ) : (

            /* =================================================
               NOT LOGGED IN
            ================================================= */

            <>

              {/* =============================================
                  LOGIN
              ============================================= */}

              <Link
                to="/login"
                className={`navbar-link navbar-login ${
                  isActive("/login")
                    ? "navbar-link-active"
                    : ""
                }`}
              >
                Login
              </Link>


              {/* =============================================
                  REGISTER
              ============================================= */}

              <Link
                to="/register"
                className="navbar-register"
              >
                Register
              </Link>

            </>

          )}

        </div>

      </div>

    </nav>

  );
}

export default Navbar;