import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarAlt,
  FaTicketAlt,
  FaSignOutAlt,
  FaTicketAlt as FaLogo,
} from "react-icons/fa";

import "../styles/sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-header">
        <FaLogo className="logo-icon" />
        <h2>Admin Panel</h2>
      </div>

      <nav className="sidebar-menu">

        <NavLink
          to="/dashboard"
          aria-label="Dashboard"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaTachometerAlt />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/users"
          aria-label="Users"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaUsers />
          <span>Users</span>
        </NavLink>

        <NavLink
          to="/events"
          aria-label="Events"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaCalendarAlt />
          <span>Events</span>
        </NavLink>

        <NavLink
          to="/bookings"
          aria-label="Bookings"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaTicketAlt />
          <span>Bookings</span>
        </NavLink>

      </nav>

      <div className="sidebar-footer">

        <NavLink
          to="/logout"
          aria-label="Logout"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </NavLink>

      </div>

    </aside>
  );
}

export default Sidebar;