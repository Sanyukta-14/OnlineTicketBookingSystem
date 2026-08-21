import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {

  const navigate = useNavigate();


  // =========================================================
  // STATES
  // =========================================================

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");


  // =========================================================
  // REGISTER USER
  // =========================================================

  const handleRegister = async (e) => {

    e.preventDefault();

    setError("");
    setSuccess("");


    // =======================================================
    // VALIDATE NAME
    // =======================================================

    const trimmedName =
      name.trim();

    if (!trimmedName) {

      setError(
        "Please enter your name."
      );

      return;
    }

    if (trimmedName.length < 2) {

      setError(
        "Name must contain at least 2 characters."
      );

      return;
    }


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


    // Correct email pattern
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(trimmedEmail)) {

      setError(
        "Please enter a valid email address."
      );

      return;
    }


    // =======================================================
    // VALIDATE PHONE
    // =======================================================

    const trimmedPhone =
      phone.trim();

    if (!trimmedPhone) {

      setError(
        "Please enter your phone number."
      );

      return;
    }


    if (!/^[0-9]{10}$/.test(trimmedPhone)) {

      setError(
        "Phone number must contain exactly 10 digits."
      );

      return;
    }


    // =======================================================
    // VALIDATE PASSWORD
    // =======================================================

    if (!password.trim()) {

      setError(
        "Please enter a password."
      );

      return;
    }


    if (password.trim().length < 4) {

      setError(
        "Password must contain at least 4 characters."
      );

      return;
    }


    // =======================================================
    // VALIDATE CONFIRM PASSWORD
    // =======================================================

    if (!confirmPassword.trim()) {

      setError(
        "Please confirm your password."
      );

      return;
    }


    if (password !== confirmPassword) {

      setError(
        "Passwords do not match."
      );

      return;
    }


    // =======================================================
    // USER DATA
    // =======================================================
    //
    // Do NOT send role from frontend.
    //
    // Backend UserService automatically sets:
    //
    // role = USER
    //
    // =======================================================

    const userData = {

      name: trimmedName,

      email: trimmedEmail,

      phone: trimmedPhone,

      password: password.trim(),
    };


    // =======================================================
    // CREATE USER
    // =======================================================

    try {

      setLoading(true);


      const response =
        await axios.post(
          "http://localhost:8080/users",
          userData,
          {
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );


      console.log(
        "User registered successfully:",
        response.data
      );


      // =====================================================
      // SUCCESS
      // =====================================================

      setSuccess(
        "Account created successfully! Redirecting to login..."
      );


      // =====================================================
      // CLEAR FORM
      // =====================================================

      setName("");

      setEmail("");

      setPhone("");

      setPassword("");

      setConfirmPassword("");


      // =====================================================
      // REDIRECT TO LOGIN
      // =====================================================

      setTimeout(() => {

        navigate("/login");

      }, 1500);


    } catch (err) {

      console.error(
        "Registration error:",
        err
      );


      let errorMessage =
        "Registration failed. Please try again.";


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
        // 409 DUPLICATE EMAIL
        // ---------------------------------------------------

        if (status === 409) {

          errorMessage =
            "An account with this email already exists.";
        }


        // ---------------------------------------------------
        // 400 BAD REQUEST
        // ---------------------------------------------------

        else if (status === 400) {

          if (
            !data ||
            typeof data !== "object" ||
            !data.message
          ) {

            errorMessage =
              "Invalid registration details.";
          }
        }


        // ---------------------------------------------------
        // 500 SERVER ERROR
        // ---------------------------------------------------

        else if (status === 500) {

          errorMessage =
            "Server error. Please try again.";
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

    <div className="register-page">

      {/* =====================================================
          REGISTER CARD
      ===================================================== */}

      <div className="register-card">


        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="register-header">

          <div className="register-icon">
            🎟️
          </div>


          <h1>
            Create Account
          </h1>


          <p>
            Register for your Ticket Booking account
          </p>

        </div>


        {/* ===================================================
            ERROR MESSAGE
        =================================================== */}

        {error && (

          <div className="register-error">

            <span>
              ⚠️
            </span>

            <span>
              {error}
            </span>

          </div>

        )}


        {/* ===================================================
            SUCCESS MESSAGE
        =================================================== */}

        {success && (

          <div className="register-success">

            <span>
              ✓
            </span>

            <span>
              {success}
            </span>

          </div>

        )}


        {/* ===================================================
            REGISTER FORM
        =================================================== */}

        <form
          className="register-form"
          onSubmit={handleRegister}
        >


          {/* =================================================
              NAME
          ================================================= */}

          <div className="form-group">

            <label htmlFor="name">
              Full Name
            </label>


            <div className="input-wrapper">

              <span className="input-icon">
                👤
              </span>


              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => {

                  setName(
                    e.target.value
                  );

                  setError("");

                }}
                disabled={loading}
                autoComplete="name"
              />

            </div>

          </div>


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
              PHONE
          ================================================= */}

          <div className="form-group">

            <label htmlFor="phone">
              Phone Number
            </label>


            <div className="input-wrapper">

              <span className="input-icon">
                📱
              </span>


              <input
                id="phone"
                type="tel"
                inputMode="numeric"
                placeholder="Enter 10 digit phone number"
                value={phone}
                onChange={(e) => {

                  const value =
                    e.target.value.replace(
                      /\D/g,
                      ""
                    );


                  if (value.length <= 10) {

                    setPhone(value);

                    setError("");
                  }

                }}
                disabled={loading}
                maxLength={10}
                autoComplete="tel"
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
                placeholder="Enter password"
                value={password}
                onChange={(e) => {

                  setPassword(
                    e.target.value
                  );

                  setError("");

                }}
                disabled={loading}
                autoComplete="new-password"
              />

            </div>

          </div>


          {/* =================================================
              CONFIRM PASSWORD
          ================================================= */}

          <div className="form-group">

            <label htmlFor="confirmPassword">
              Confirm Password
            </label>


            <div className="input-wrapper">

              <span className="input-icon">
                🔐
              </span>


              <input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {

                  setConfirmPassword(
                    e.target.value
                  );

                  setError("");

                }}
                disabled={loading}
                autoComplete="new-password"
              />

            </div>

          </div>


          {/* =================================================
              REGISTER BUTTON
          ================================================= */}

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >

            {loading ? (

              <>

                <span className="login-spinner">
                </span>

                Creating Account...

              </>

            ) : (

              <>

                Create Account

                <span className="button-arrow">
                  →
                </span>

              </>

            )}

          </button>

        </form>


        {/* ===================================================
            LOGIN LINK
        =================================================== */}

        <div className="register-login">

          <p>
            Already have an account?
          </p>


          <button
            type="button"
            className="register-link"
            onClick={() =>
              navigate("/login")
            }
            disabled={loading}
          >
            Login
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

export default Register;
