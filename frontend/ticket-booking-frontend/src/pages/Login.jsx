import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/Login.css";

function Login() {

  const navigate = useNavigate();


  // =========================================================
  // STATES
  // =========================================================

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");


  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = async (e) => {

    e.preventDefault();

    setError("");


    // =======================================================
    // VALIDATE EMAIL
    // =======================================================

    const trimmedEmail =
      email.trim().toLowerCase();


    if (!trimmedEmail) {

      setError(
        "Please enter your email."
      );

      return;
    }


    // =======================================================
    // VALIDATE EMAIL FORMAT
    // =======================================================

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(trimmedEmail)) {

      setError(
        "Please enter a valid email address."
      );

      return;
    }


    // =======================================================
    // VALIDATE PASSWORD
    // =======================================================

    if (!password.trim()) {

      setError(
        "Please enter your password."
      );

      return;
    }


    // =======================================================
    // LOGIN REQUEST
    // =======================================================

    try {

      setLoading(true);


      const response =
        await axios.post(
          "http://localhost:8080/users/login",
          {
            email: trimmedEmail,
            password: password.trim(),
          },
          {
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );


      // =====================================================
      // GET USER FROM BACKEND
      // =====================================================

      const user =
        response.data;


      console.log(
        "Login successful:",
        user
      );


      // =====================================================
      // VALIDATE RESPONSE
      // =====================================================

      if (!user || !user.id) {

        setError(
          "Invalid response received from server."
        );

        return;
      }


      // =====================================================
      // CHECK ROLE
      // =====================================================
      //
      // Normal user login should not be used to access
      // the admin dashboard.
      //
      // If an ADMIN tries to use the normal login page,
      // direct them to the admin login.
      //
      // =====================================================

      if (
        user.role &&
        user.role.trim().toUpperCase() === "ADMIN"
      ) {

        setError(
          "Administrator account detected. Please use the Admin Login."
        );

        return;
      }


      // =====================================================
      // SAVE LOGGED-IN USER
      // =====================================================

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(user)
      );


      // =====================================================
      // REMOVE OLD ADMIN SESSION
      // =====================================================

      localStorage.removeItem(
        "loggedInAdmin"
      );


      // =====================================================
      // INFORM APP THAT LOGIN OCCURRED
      // =====================================================

      window.dispatchEvent(
        new Event("authChange")
      );


      console.log(
        `Welcome ${user.name}!`
      );


      // =====================================================
      // GO TO HOME PAGE
      // =====================================================

      navigate("/");

    } catch (err) {

      console.error(
        "Login error:",
        err
      );


      let errorMessage =
        "Login failed. Please try again.";


      // =====================================================
      // BACKEND RESPONSE ERROR
      // =====================================================

      if (err.response) {

        const status =
          err.response.status;

        const data =
          err.response.data;


        // ---------------------------------------------------
        // BACKEND RETURNS JSON
        // ---------------------------------------------------

        if (
          data &&
          typeof data === "object"
        ) {

          if (data.message) {

            errorMessage =
              data.message;

          } else if (data.error) {

            errorMessage =
              data.error;
          }
        }


        // ---------------------------------------------------
        // BACKEND RETURNS STRING
        // ---------------------------------------------------

        else if (
          typeof data === "string" &&
          data.trim()
        ) {

          errorMessage =
            data;
        }


        // ---------------------------------------------------
        // BAD REQUEST
        // ---------------------------------------------------

        if (status === 400) {

          errorMessage =
            "Invalid login details.";
        }


        // ---------------------------------------------------
        // UNAUTHORIZED
        // ---------------------------------------------------

        else if (status === 401) {

          errorMessage =
            "Invalid email or password.";
        }


        // ---------------------------------------------------
        // NOT FOUND
        // ---------------------------------------------------

        else if (status === 404) {

          errorMessage =
            "User not found.";
        }


        // ---------------------------------------------------
        // SERVER ERROR
        // ---------------------------------------------------

        else if (status === 500) {

          // Keep a useful backend message if one exists.
          if (
            !data ||
            typeof data !== "object" ||
            (!data.message && !data.error)
          ) {

            errorMessage =
              "Server error. Please try again.";
          }
        }
      }


      // =====================================================
      // BACKEND NOT RUNNING
      // =====================================================

      else if (err.request) {

        errorMessage =
          "Unable to connect to the backend server. Make sure Spring Boot is running.";
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

    <div className="login-page">

      {/* =====================================================
          LOGIN CARD
      ===================================================== */}

      <div className="login-card">


        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="login-header">

          <div className="login-icon">
            🎟️
          </div>


          <h1>
            Welcome Back
          </h1>


          <p>
            Login to your TicketBook account
          </p>

        </div>


        {/* ===================================================
            ERROR MESSAGE
        =================================================== */}

        {error && (

          <div className="login-error">

            <span>
              ⚠️
            </span>

            <span>
              {error}
            </span>

          </div>

        )}


        {/* ===================================================
            LOGIN FORM
        =================================================== */}

        <form
          className="login-form"
          onSubmit={handleLogin}
        >


          {/* =================================================
              EMAIL
          ================================================= */}

          <div className="form-group">

            <label htmlFor="email">
              Email Address
            </label>


            <div className="input-wrapper">

              <span className="input-icon">
                ✉️
              </span>


              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {

                  setEmail(
                    e.target.value
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

            <label htmlFor="password">
              Password
            </label>


            <div className="input-wrapper">

              <span className="input-icon">
                🔒
              </span>


              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {

                  setPassword(
                    e.target.value
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
            className="login-button"
            disabled={loading}
          >

            {loading ? (

              <>

                <span className="login-spinner">
                </span>

                Logging in...

              </>

            ) : (

              <>

                Login

                <span className="button-arrow">
                  →
                </span>

              </>

            )}

          </button>

        </form>


        {/* ===================================================
            DIVIDER
        =================================================== */}

        <div className="login-divider">

          <span>
            OR
          </span>

        </div>


        {/* ===================================================
            REGISTER
        =================================================== */}

        <div className="login-register">

          <p>
            Don't have an account?
          </p>


          <button
            type="button"
            className="register-link"
            onClick={() =>
              navigate("/register")
            }
            disabled={loading}
          >
            Create Account
          </button>

        </div>


        {/* ===================================================
            ADMIN LOGIN
        =================================================== */}

        <div className="admin-login-link">

          <p>
            Are you an administrator?
          </p>


          <button
            type="button"
            className="admin-link"
            onClick={() =>
              navigate("/admin/login")
            }
            disabled={loading}
          >
            Admin Login
          </button>

        </div>


        {/* ===================================================
            BACK TO HOME
        =================================================== */}

        <button
          type="button"
          className="back-home-button"
          onClick={() =>
            navigate("/")
          }
          disabled={loading}
        >
          ← Back to Home
        </button>

      </div>

    </div>
  );
}

export default Login;