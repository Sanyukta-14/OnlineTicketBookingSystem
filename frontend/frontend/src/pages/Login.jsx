import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaTicketAlt,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaArrowRight,
} from "react-icons/fa";

import { login } from "../services/authService";

import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) return;

      const user = JSON.parse(storedUser);

      const role = user.role?.trim().toUpperCase();

      if (role === "ADMIN") {
        navigate("/dashboard", { replace: true });
      } else if (role === "USER") {
        navigate("/user-dashboard", { replace: true });
      }
    } catch (error) {
      localStorage.removeItem("user");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const user = await login(email.trim(), password);

      if (!user) {
        alert("Invalid Email or Password");
        setLoading(false);
        return;
      }

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      alert("Login Successful!");

      const role = user.role?.trim().toUpperCase();

      if (role === "ADMIN") {
        navigate("/dashboard", {
          replace: true,
        });
      } else if (role === "USER") {
        navigate("/user-dashboard", {
          replace: true,
        });
      } else {
        alert("Unknown User Role");
      }
    } catch (error) {
      console.error(error);
      alert("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-wrapper">

        {/* Left Side */}

        <div className="login-left">

          <div className="login-logo">

            <FaTicketAlt />

          </div>

          <h1>Online Ticket Booking System</h1>

          <p>
            Book concerts, workshops, festivals and
            events effortlessly. Secure your seats
            anytime, anywhere with a modern booking
            experience.
          </p>

          <div className="login-features">

            <div>🎫 Instant Ticket Booking</div>

            <div>⚡ Fast & Secure Login</div>

            <div>📅 Manage Your Bookings</div>

            <div>💳 Easy Payment Ready</div>

          </div>

        </div>

        {/* Right Side */}

        <div className="login-card">

          <div className="login-header">

            <h2>Welcome Back 👋</h2>

            <p>
              Sign in to continue
            </p>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="input-group">

              <label>Email Address</label>

              <div className="input-box">

                <FaEnvelope />

                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>

            <div className="input-group">

              <label>Password</label>

              <div className="input-box">

                <FaLock />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

                <span
                  className="eye-icon"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                >
                  {showPassword ? (
                    <FaEyeSlash />
                  ) : (
                    <FaEye />
                  )}
                </span>

              </div>

            </div>

            <button
              className="login-btn"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                "Signing In..."
              ) : (
                <>
                  Sign In
                  <FaArrowRight />
                </>
              )}
            </button>

          </form>

          <div className="login-footer">

            © 2026 Online Ticket Booking System

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;