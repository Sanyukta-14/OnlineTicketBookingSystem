import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaTicketAlt,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

import "../styles/sidebar.css";

function UserSidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-header">

        <FaTicketAlt className="logo-icon" />

        <h2>Ticket Booking</h2>

      </div>

      <nav className="sidebar-menu">

        <NavLink
          to="/user-dashboard"
          aria-label="Dashboard"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/user-events"
          aria-label="Events"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <FaCalendarAlt />
          <span>Events</span>
        </NavLink>

        <NavLink
          to="/my-bookings"
          aria-label="My Bookings"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <FaTicketAlt />
          <span>My Bookings</span>
        </NavLink>

        <NavLink
          to="/profile"
          aria-label="Profile"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <FaUser />
          <span>Profile</span>
        </NavLink>

      </nav>

      <div className="sidebar-footer">

        <NavLink
          to="/logout"
          aria-label="Logout"
          className={({ isActive }) =>
            isActive ? "active" : ""
          }
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </NavLink>

      </div>

    </aside>
  );
}

export default UserSidebar;