import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaTicketAlt,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";

import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">

      {/* Logo */}

      <div className="navbar-logo">

        <span className="logo-icon">🎟️</span>

        <div>

          <h2>Ticket Booking</h2>

          <p>Management System</p>

        </div>

      </div>

      {/* Navigation */}

      <ul className="navbar-links">

        {user?.role === "ADMIN" ? (
          <>

            <li>

              <NavLink
                to="/admin-dashboard"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <FaHome />
                Dashboard
              </NavLink>

            </li>

            <li>

              <NavLink
                to="/users"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <FaUsers />
                Users
              </NavLink>

            </li>

            <li>

              <NavLink
                to="/events"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <FaCalendarAlt />
                Events
              </NavLink>

            </li>

            <li>

              <NavLink
                to="/bookings"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <FaTicketAlt />
                Bookings
              </NavLink>

            </li>

          </>
        ) : (
          <>

            <li>

              <NavLink
                to="/user-dashboard"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <FaHome />
                Dashboard
              </NavLink>

            </li>

            <li>

              <NavLink
                to="/user-events"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <FaCalendarAlt />
                Events
              </NavLink>

            </li>

            <li>

              <NavLink
                to="/my-bookings"
                className={({ isActive }) =>
                  isActive ? "active" : ""
                }
              >
                <FaTicketAlt />
                My Bookings
              </NavLink>

            </li>

          </>
        )}

        <li>

          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? "active" : ""
            }
          >
            <FaUserCircle />
            Profile
          </NavLink>

        </li>

      </ul>

      {/* Right Side */}

      <div className="navbar-user">

        <div className="user-info">

          <FaUserCircle className="user-avatar" />

          <div>

            <h4>{user?.name}</h4>

            <span>{user?.role}</span>

          </div>

        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />

          Logout
        </button>

      </div>

    </nav>
  );
}

export default Navbar;