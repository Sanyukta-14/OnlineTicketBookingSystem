import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/AdminLogin.css";

function AdminLogin() {

  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  // =========================================================
  // ADMIN LOGIN
  // =========================================================

  const handleAdminLogin = async (event) => {

    event.preventDefault();

    setError("");

    // =======================================================
    // VALIDATE EMAIL
    // =======================================================

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {

      setError(
        "Please enter your admin email."
      );

      return;
    }


    // =======================================================
    // VALIDATE PASSWORD
    // =======================================================

    const cleanPassword = password.trim();

    if (!cleanPassword) {

      setError(
        "Please enter your admin password."
      );

      return;
    }


    try {

      setLoading(true);


      // =====================================================
      // ADMIN LOGIN API
      // =====================================================

      const response = await axios.post(
        "http://localhost:8080/admin/login",
        {
          email: cleanEmail,
          password: cleanPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );


      // =====================================================
      // GET ADMIN RESPONSE
      // =====================================================

      const admin = response.data;

      console.log(
        "Admin login response:",
        admin
      );


      // =====================================================
      // VALIDATE RESPONSE
      // =====================================================

      if (!admin || !admin.id) {

        setError(
          "Invalid admin information received from server."
        );

        return;
      }


      // =====================================================
      // CHECK ADMIN ROLE
      // =====================================================

      const role =
        typeof admin.role === "string"
          ? admin.role.trim().toUpperCase()
          : "";


      if (role !== "ADMIN") {

        setError(
          "Access denied. This account is not an administrator."
        );

        return;
      }


      // =====================================================
      // SAVE ADMIN SESSION
      // =====================================================

      const adminSession = {
        ...admin,
        role: "ADMIN",
      };


      localStorage.setItem(
        "loggedInAdmin",
        JSON.stringify(adminSession)
      );


      // =====================================================
      // NOTIFY APP
      // =====================================================

      window.dispatchEvent(
        new Event("adminAuthChange")
      );


      // =====================================================
      // GO TO ADMIN DASHBOARD
      // =====================================================

      navigate(
        "/admin",
        {
          replace: true,
        }
      );

    } catch (error) {

      console.error(
        "Admin login error:",
        error
      );


      // =====================================================
      // DEFAULT ERROR
      // =====================================================

      let errorMessage =
        "Admin login failed. Please try again.";


      // =====================================================
      // BACKEND RESPONSE ERROR
      // =====================================================

      if (error.response) {

        const status =
          error.response.status;

        const data =
          error.response.data;


        if (typeof data === "string") {

          errorMessage = data;

        }

        else if (
          data &&
          typeof data === "object"
        ) {

          if (data.message) {

            errorMessage =
              data.message;

          }

          else if (data.error) {

            errorMessage =
              data.error;

          }

        }


        // ---------------------------------------------------
        // STATUS FALLBACKS
        // ---------------------------------------------------

        if (status === 401) {

          errorMessage =
            "Invalid admin email or password.";

        }

        else if (status === 403) {

          errorMessage =
            "Access denied. Admin privileges are required.";

        }

        else if (status === 404) {

          errorMessage =
            "Admin login endpoint was not found.";

        }

        else if (status >= 500) {

          errorMessage =
            "Server error. Please check the Spring Boot backend.";

        }

      }


      // =====================================================
      // BACKEND NOT AVAILABLE
      // =====================================================

      else if (error.request) {

        errorMessage =
          "Unable to connect to the backend. Please make sure Spring Boot is running on port 8080.";

      }


      // =====================================================
      // OTHER ERROR
      // =====================================================

      else {

        errorMessage =
          "Something went wrong. Please try again.";

      }


      setError(errorMessage);

    } finally {

      setLoading(false);

    }
  };


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="admin-login-page">

      {/* =====================================================
          LOGIN CARD
      ===================================================== */}

      <div className="admin-login-card">


        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="admin-login-header">

          <div className="admin-login-icon">
            🛡️
          </div>

          <h1>
            Admin Login
          </h1>

          <p>
            Sign in to access the TicketBook Admin Panel
          </p>

        </div>


        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (

          <div
            className="admin-login-error"
            role="alert"
          >

            <span>
              ⚠️
            </span>

            <span>
              {error}
            </span>

          </div>

        )}


        {/* ===================================================
            FORM
        =================================================== */}

        <form
          className="admin-login-form"
          onSubmit={handleAdminLogin}
        >

          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="form-group">

            <label htmlFor="admin-email">
              Admin Email
            </label>

            <div className="input-wrapper">

              <span
                className="input-icon"
                aria-hidden="true"
              >
                ✉️
              </span>

              <input
                id="admin-email"
                type="email"
                placeholder="Enter admin email"
                value={email}
                onChange={(event) => {

                  setEmail(
                    event.target.value
                  );

                  setError("");

                }}
                disabled={loading}
                autoComplete="email"
              />

            </div>

          </div>


          {/* =================================================
              PASSWORD
          ================================================= */}

          <div className="form-group">

            <label htmlFor="admin-password">
              Admin Password
            </label>

            <div className="input-wrapper">

              <span
                className="input-icon"
                aria-hidden="true"
              >
                🔒
              </span>

              <input
                id="admin-password"
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(event) => {

                  setPassword(
                    event.target.value
                  );

                  setError("");

                }}
                disabled={loading}
                autoComplete="current-password"
              />

            </div>

          </div>


          {/* =================================================
              LOGIN BUTTON
          ================================================= */}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >

            {loading ? (

              <>
                <span
                  className="admin-login-spinner"
                  aria-hidden="true"
                />

                Signing in...
              </>

            ) : (

              <>
                Admin Login

                <span
                  className="button-arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </>

            )}

          </button>

        </form>


        {/* ===================================================
            BACK TO USER LOGIN
        =================================================== */}

        <button
          type="button"
          className="admin-back-button"
          onClick={() =>
            navigate("/login")
          }
          disabled={loading}
        >
          ← Back to User Login
        </button>

      </div>

    </div>
  );
}


export default AdminLogin;