import { Link } from "react-router-dom";
import {
  FaCalendarAlt,
  FaTicketAlt,
  FaUser,
  FaArrowRight,
  FaStar,
  FaCalendarCheck,
  FaClock,
} from "react-icons/fa";

import "../styles/userDashboard.css";

function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="user-dashboard">

      {/* ================= HERO ================= */}

      <div className="user-hero">

        <div className="hero-content">

          <h1>
            Welcome back, {user?.name || "User"} 👋
          </h1>

          <p>
            Discover amazing events, reserve your seats,
            manage your bookings, and enjoy a seamless
            ticket booking experience.
          </p>

        </div>

        <div className="hero-right">

          <div className="hero-date">
            {today}
          </div>

          <div className="hero-icon">
            <FaTicketAlt />
          </div>

        </div>

      </div>

      {/* ================= QUICK STATS ================= */}

      <div className="user-stats">

        <div className="stat-card">

          <div className="stat-icon blue">
            <FaCalendarAlt />
          </div>

          <div>

            <h4>Explore</h4>

            <h2>Events</h2>

            <p>Browse upcoming events</p>

          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon green">
            <FaCalendarCheck />
          </div>

          <div>

            <h4>Manage</h4>

            <h2>Bookings</h2>

            <p>View and manage your booked tickets</p>

          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon orange">
            <FaUser />
          </div>

          <div>

            <h4>Account</h4>

            <h2>Profile</h2>

            <p>Update your personal information</p>

          </div>

        </div>

      </div>

      {/* ================= QUICK ACTIONS ================= */}

      <h2 className="section-title">
        Quick Actions
      </h2>

      <div className="user-cards">

        <Link
          to="/user-events"
          className="user-card"
        >

          <div className="user-icon events-icon">
            <FaCalendarAlt />
          </div>

          <h3>Browse Events</h3>

          <p>
            Explore concerts, workshops,
            festivals, and reserve your seats instantly.
          </p>

          <button type="button">
            Explore Events
            <FaArrowRight />
          </button>

        </Link>

        <Link
          to="/my-bookings"
          className="user-card"
        >

          <div className="user-icon booking-icon">
            <FaTicketAlt />
          </div>

          <h3>My Bookings</h3>

          <p>
            Track your tickets, booking history,
            and manage cancellations whenever required.
          </p>

          <button type="button">
            View Bookings
            <FaArrowRight />
          </button>

        </Link>

        <Link
          to="/profile"
          className="user-card"
        >

          <div className="user-icon profile-icon">
            <FaUser />
          </div>

          <h3>My Profile</h3>

          <p>
            Update your personal details,
            password, and account information.
          </p>

          <button type="button">
            Edit Profile
            <FaArrowRight />
          </button>

        </Link>

      </div>

      {/* ================= BOOKING TIP ================= */}

      <div className="tips-card">

        <div className="tips-icon">
          <FaStar />
        </div>

        <div>

          <h3>Booking Tip</h3>

          <p>
            Popular events sell out quickly.
            Reserve your tickets early to secure the best seats.
          </p>

        </div>

      </div>

      {/* ================= REMINDER ================= */}

      <div className="tips-card secondary">

        <div className="tips-icon">
          <FaClock />
        </div>

        <div>

          <h3>Reminder</h3>

          <p>
            Check your booking details before the event,
            and arrive at least 30 minutes early.
          </p>

        </div>

      </div>

    </div>
  );
}

export default UserDashboard;