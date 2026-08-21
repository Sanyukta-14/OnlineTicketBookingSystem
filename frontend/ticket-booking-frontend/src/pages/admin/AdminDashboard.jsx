import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/AdminDashboard.css";

function AdminDashboard() {

  const navigate = useNavigate();

  // =========================================================
  // API URLS
  // =========================================================

  const USERS_API = "http://localhost:8080/users";
  const EVENTS_API = "http://localhost:8080/events";
  const BOOKINGS_API = "http://localhost:8080/bookings";

  // =========================================================
  // GET ADMIN FROM LOCAL STORAGE
  // =========================================================

  const getAdminFromStorage = () => {

    const savedAdmin =
      localStorage.getItem("loggedInAdmin");

    if (!savedAdmin) {
      return null;
    }

    try {

      const adminData =
        JSON.parse(savedAdmin);

      const role =
        typeof adminData?.role === "string"
          ? adminData.role.trim().toUpperCase()
          : "";

      if (!adminData?.id || role !== "ADMIN") {

        localStorage.removeItem(
          "loggedInAdmin"
        );

        return null;
      }

      return {
        ...adminData,
        role: "ADMIN",
      };

    } catch (error) {

      console.error(
        "Invalid admin session:",
        error
      );

      localStorage.removeItem(
        "loggedInAdmin"
      );

      return null;
    }
  };

  // =========================================================
  // ADMIN
  // =========================================================

  const [admin] = useState(
    getAdminFromStorage
  );

  // =========================================================
  // DATA
  // =========================================================

  const [users, setUsers] = useState([]);

  const [bookings, setBookings] =
    useState([]);

  // =========================================================
  // STATE
  // =========================================================

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================================================
  // STATISTICS
  // =========================================================

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  // =========================================================
  // ERROR MESSAGE HELPER
  // =========================================================

  const getErrorMessage = (
    error,
    defaultMessage
  ) => {

    if (error?.response) {

      const data =
        error.response.data;

      if (typeof data === "string") {
        return data;
      }

      if (data?.message) {
        return data.message;
      }

      if (data?.error) {
        return data.error;
      }

      return defaultMessage;
    }

    if (error?.request) {

      return (
        "Unable to connect to Spring Boot backend. " +
        "Make sure the backend is running on port 8080."
      );
    }

    return defaultMessage;
  };

  // =========================================================
  // CALCULATE REVENUE
  // =========================================================

  const calculateRevenue = (
    bookingList
  ) => {

    if (!Array.isArray(bookingList)) {
      return 0;
    }

    return bookingList.reduce(
      (total, booking) => {

        const amount = Number(
          booking?.totalAmount ??
          booking?.amount ??
          booking?.totalPrice ??
          booking?.price ??
          0
        );

        return (
          total +
          (
            Number.isFinite(amount)
              ? amount
              : 0
          )
        );
      },
      0
    );
  };

  // =========================================================
  // LOAD DASHBOARD
  // =========================================================

  const loadDashboard = async (
    isRefresh = false
  ) => {

    try {

      if (isRefresh) {
        setRefreshing(true);
      }

      setError("");

      // =====================================================
      // CALL ALL APIs
      // =====================================================

      const results =
        await Promise.allSettled([

          axios.get(USERS_API),

          axios.get(EVENTS_API),

          axios.get(BOOKINGS_API),

        ]);

      // =====================================================
      // USERS
      // =====================================================

      let usersData = [];

      if (
        results[0].status ===
        "fulfilled"
      ) {

        const response =
          results[0].value;

        usersData =
          Array.isArray(response.data)
            ? response.data
            : [];

        console.log(
          "USERS API RESPONSE:",
          response.data
        );

      } else {

        console.error(
          "Users API error:",
          results[0].reason
        );
      }

      // =====================================================
      // EVENTS
      // =====================================================

      let eventsData = [];

      if (
        results[1].status ===
        "fulfilled"
      ) {

        const response =
          results[1].value;

        console.log(
          "EVENTS API RESPONSE:",
          response.data
        );

        eventsData =
          Array.isArray(response.data)
            ? response.data
            : [];

      } else {

        console.error(
          "Events API error:",
          results[1].reason
        );
      }

      // =====================================================
      // BOOKINGS
      // =====================================================

      let bookingsData = [];

      if (
        results[2].status ===
        "fulfilled"
      ) {

        const response =
          results[2].value;

        console.log(
          "BOOKINGS API RESPONSE:",
          response.data
        );

        bookingsData =
          Array.isArray(response.data)
            ? response.data
            : [];

      } else {

        console.error(
          "Bookings API error:",
          results[2].reason
        );
      }

      // =====================================================
      // SAVE USERS
      // =====================================================

      setUsers(usersData);

      // =====================================================
      // SAVE BOOKINGS
      // =====================================================

      setBookings(bookingsData);

      // =====================================================
      // CALCULATE REVENUE
      // =====================================================

      const revenue =
        calculateRevenue(
          bookingsData
        );

      // =====================================================
      // UPDATE STATISTICS
      // =====================================================

      setStats({
        totalUsers:
          usersData.length,

        totalEvents:
          eventsData.length,

        totalBookings:
          bookingsData.length,

        totalRevenue:
          revenue,
      });

      // =====================================================
      // CHECK FAILED REQUESTS
      // =====================================================

      const failedRequests =
        results.filter(
          (result) =>
            result.status ===
            "rejected"
        );

      if (
        failedRequests.length === 3
      ) {

        setError(
          getErrorMessage(
            failedRequests[0].reason,
            "Unable to load dashboard data."
          )
        );

      } else if (
        failedRequests.length > 0
      ) {

        setError(
          "Some dashboard information could not be loaded."
        );
      }

    } catch (error) {

      console.error(
        "Dashboard loading error:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Unable to load dashboard."
        )
      );

    } finally {

      setLoading(false);

      setRefreshing(false);
    }
  };

  // =========================================================
  // INITIAL DASHBOARD LOAD
  // =========================================================
  // IMPORTANT:
  // API request is started inside the effect.
  // State updates happen after the async request resolves.
  // This avoids the React cascading-render warning.
  // =========================================================

  useEffect(() => {

    let cancelled = false;

    const fetchDashboard = async () => {

      try {

        setError("");

        const results =
          await Promise.allSettled([

            axios.get(USERS_API),

            axios.get(EVENTS_API),

            axios.get(BOOKINGS_API),

          ]);

        if (cancelled) {
          return;
        }

        // ===================================================
        // USERS
        // ===================================================

        let usersData = [];

        if (
          results[0].status ===
          "fulfilled"
        ) {

          usersData =
            Array.isArray(
              results[0].value.data
            )
              ? results[0].value.data
              : [];

        } else {

          console.error(
            "Users API error:",
            results[0].reason
          );
        }

        // ===================================================
        // EVENTS
        // ===================================================

        let eventsData = [];

        if (
          results[1].status ===
          "fulfilled"
        ) {

          eventsData =
            Array.isArray(
              results[1].value.data
            )
              ? results[1].value.data
              : [];

        } else {

          console.error(
            "Events API error:",
            results[1].reason
          );
        }

        // ===================================================
        // BOOKINGS
        // ===================================================

        let bookingsData = [];

        if (
          results[2].status ===
          "fulfilled"
        ) {

          bookingsData =
            Array.isArray(
              results[2].value.data
            )
              ? results[2].value.data
              : [];

        } else {

          console.error(
            "Bookings API error:",
            results[2].reason
          );
        }

        // ===================================================
        // SAVE DATA
        // ===================================================

        setUsers(usersData);

        setBookings(bookingsData);

        // ===================================================
        // REVENUE
        // ===================================================

        const revenue =
          calculateRevenue(
            bookingsData
          );

        // ===================================================
        // STATISTICS
        // ===================================================

        setStats({
          totalUsers:
            usersData.length,

          totalEvents:
            eventsData.length,

          totalBookings:
            bookingsData.length,

          totalRevenue:
            revenue,
        });

        // ===================================================
        // FAILED REQUESTS
        // ===================================================

        const failedRequests =
          results.filter(
            (result) =>
              result.status ===
              "rejected"
          );

        if (
          failedRequests.length === 3
        ) {

          setError(
            getErrorMessage(
              failedRequests[0].reason,
              "Unable to load dashboard data."
            )
          );

        } else if (
          failedRequests.length > 0
        ) {

          setError(
            "Some dashboard information could not be loaded."
          );
        }

      } catch (error) {

        if (cancelled) {
          return;
        }

        console.error(
          "Dashboard loading error:",
          error
        );

        setError(
          getErrorMessage(
            error,
            "Unable to load dashboard."
          )
        );

      } finally {

        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchDashboard();

    return () => {
      cancelled = true;
    };

  }, []);

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleAdminLogout = () => {

    const confirmLogout =
      window.confirm(
        "Are you sure you want to logout from the admin panel?"
      );

    if (!confirmLogout) {
      return;
    }

    localStorage.removeItem(
      "loggedInAdmin"
    );

    window.dispatchEvent(
      new Event("adminAuthChange")
    );

    navigate(
      "/admin/login",
      {
        replace: true,
      }
    );
  };

  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = () => {

    loadDashboard(true);
  };

  // =========================================================
  // SESSION CHECK
  // =========================================================

  if (!admin) {
    return null;
  }

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {

    return (

      <div className="admin-page-message">

        <div className="admin-loading-icon">
          ⏳
        </div>

        <h2>
          Loading Admin Dashboard...
        </h2>

        <p>
          Please wait while we load
          your dashboard.
        </p>

      </div>
    );
  }

  // =========================================================
  // RECENT USERS
  // =========================================================

  const recentUsers =
    [...users]
      .reverse()
      .slice(0, 5);

  // =========================================================
  // RECENT BOOKINGS
  // =========================================================

  const recentBookings =
    [...bookings]
      .reverse()
      .slice(0, 5);

  // =========================================================
  // DASHBOARD
  // =========================================================

  return (

    <div className="admin-dashboard-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="admin-dashboard-header">

        <div className="admin-header-left">

          <div className="admin-dashboard-logo">
            🛡️
          </div>

          <div>

            <h1>
              Admin Dashboard
            </h1>

            <p>
              TicketBook Administration Panel
            </p>

          </div>

        </div>

        <div className="admin-header-right">

          <div className="admin-profile">

            <div className="admin-avatar">

              {admin?.name
                ? admin.name
                    .charAt(0)
                    .toUpperCase()
                : "A"}

            </div>

            <div className="admin-profile-info">

              <strong>
                {admin?.name ||
                  "Administrator"}
              </strong>

              <span>
                Administrator
              </span>

            </div>

          </div>

          <button
            type="button"
            className="admin-logout-button"
            onClick={handleAdminLogout}
          >
            Logout
          </button>

        </div>

      </header>

      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="admin-dashboard-content">

        {/* ===================================================
            WELCOME
        =================================================== */}

        <section className="admin-welcome-section">

          <div>

            <h2>
              Welcome back,{" "}
              {admin?.name ||
                "Administrator"} 👋
            </h2>

            <p>
              Here's what's happening with
              your TicketBook system.
            </p>

          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={handleRefresh}
            disabled={refreshing}
          >

            {refreshing
              ? "↻ Refreshing..."
              : "↻ Refresh"}

          </button>

        </section>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (

          <div className="admin-dashboard-error">

            <span>
              ⚠️
            </span>

            <span>
              {error}
            </span>

          </div>

        )}

        {/* ===================================================
            STATISTICS
        =================================================== */}

        <section className="admin-stats-grid">

          {/* USERS */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              👥
            </div>

            <div className="admin-stat-content">

              <span>
                Total Users
              </span>

              <strong>
                {stats.totalUsers}
              </strong>

              <small>
                Registered accounts
              </small>

            </div>

          </div>

          {/* EVENTS */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              🎫
            </div>

            <div className="admin-stat-content">

              <span>
                Total Events
              </span>

              <strong>
                {stats.totalEvents}
              </strong>

              <small>
                Available events
              </small>

            </div>

          </div>

          {/* BOOKINGS */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              📋
            </div>

            <div className="admin-stat-content">

              <span>
                Total Bookings
              </span>

              <strong>
                {stats.totalBookings}
              </strong>

              <small>
                Ticket bookings
              </small>

            </div>

          </div>

          {/* REVENUE */}

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              💰
            </div>

            <div className="admin-stat-content">

              <span>
                Total Revenue
              </span>

              <strong>
                ₹
                {stats.totalRevenue.toLocaleString(
                  "en-IN"
                )}
              </strong>

              <small>
                Booking revenue
              </small>

            </div>

          </div>

        </section>

        {/* ===================================================
            MANAGEMENT
        =================================================== */}

        <section className="admin-management-section">

          {/* USERS */}

          <div className="admin-management-card">

            <div className="admin-management-icon">
              👥
            </div>

            <div className="admin-management-content">

              <h3>
                User Management
              </h3>

              <p>
                View and manage all registered
                TicketBook users.
              </p>

              <span className="admin-management-count">
                {stats.totalUsers} users
              </span>

            </div>

            <button
              type="button"
              className="admin-management-button"
              onClick={() =>
                navigate("/admin/users")
              }
            >
              Manage Users →
            </button>

          </div>

          {/* EVENTS */}

          <div className="admin-management-card">

            <div className="admin-management-icon">
              🎫
            </div>

            <div className="admin-management-content">

              <h3>
                Event Management
              </h3>

              <p>
                Create, update and manage
                ticket booking events.
              </p>

              <span className="admin-management-count">
                {stats.totalEvents} events
              </span>

            </div>

            <button
              type="button"
              className="admin-management-button"
              onClick={() =>
                navigate("/admin/events")
              }
            >
              Manage Events →
            </button>

          </div>

          {/* BOOKINGS */}

          <div className="admin-management-card">

            <div className="admin-management-icon">
              📋
            </div>

            <div className="admin-management-content">

              <h3>
                Booking Management
              </h3>

              <p>
                View and manage customer
                ticket bookings.
              </p>

              <span className="admin-management-count">
                {stats.totalBookings} bookings
              </span>

            </div>

            <button
              type="button"
              className="admin-management-button"
              onClick={() =>
                navigate("/admin/bookings")
              }
            >
              Manage Bookings →
            </button>

          </div>

        </section>

        {/* ===================================================
            RECENT USERS
        =================================================== */}

        <section className="admin-recent-section">

          <div className="admin-section-header">

            <div>

              <h2>
                Recent Users
              </h2>

              <p>
                Latest registered users
              </p>

            </div>

            <button
              type="button"
              className="admin-view-all-button"
              onClick={() =>
                navigate("/admin/users")
              }
            >
              View All →
            </button>

          </div>

          {recentUsers.length === 0 ? (

            <div className="admin-empty-state">

              <div>
                👥
              </div>

              <h3>
                No Users Found
              </h3>

              <p>
                There are currently no
                registered users.
              </p>

            </div>

          ) : (

            <div className="admin-users-table-wrapper">

              <table className="admin-users-table">

                <thead>

                  <tr>

                    <th>
                      User
                    </th>

                    <th>
                      Email
                    </th>

                    <th>
                      Phone
                    </th>

                    <th>
                      Role
                    </th>

                    <th>
                      Action
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {recentUsers.map(
                    (user) => (

                      <tr key={user.id}>

                        <td>

                          <div className="admin-table-user">

                            <div className="admin-table-avatar">

                              {user.name
                                ? user.name
                                    .charAt(0)
                                    .toUpperCase()
                                : "U"}

                            </div>

                            <strong>
                              {user.name ||
                                "Unknown User"}
                            </strong>

                          </div>

                        </td>

                        <td>
                          {user.email ||
                            "-"}
                        </td>

                        <td>
                          {user.phone ||
                            "-"}
                        </td>

                        <td>

                          <span className="admin-role-badge">

                            {user.role ||
                              "USER"}

                          </span>

                        </td>

                        <td>

                          <button
                            type="button"
                            className="admin-table-action"
                            onClick={() =>
                              navigate(
                                `/admin/users/${user.id}`
                              )
                            }
                          >
                            View
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

        {/* ===================================================
            RECENT BOOKINGS
        =================================================== */}

        <section className="admin-recent-section">

          <div className="admin-section-header">

            <div>

              <h2>
                Recent Bookings
              </h2>

              <p>
                Latest ticket bookings
              </p>

            </div>

            <button
              type="button"
              className="admin-view-all-button"
              onClick={() =>
                navigate(
                  "/admin/bookings"
                )
              }
            >
              View All →
            </button>

          </div>

          {recentBookings.length === 0 ? (

            <div className="admin-empty-state">

              <div>
                📋
              </div>

              <h3>
                No Bookings Found
              </h3>

              <p>
                There are currently no
                ticket bookings.
              </p>

            </div>

          ) : (

            <div className="admin-bookings-preview">

              {recentBookings.map(
                (booking) => (

                  <div
                    className="admin-booking-preview-card"
                    key={
                      booking.id ||
                      `${booking.userId}-${booking.eventId}`
                    }
                  >

                    <div className="admin-booking-preview-icon">
                      🎫
                    </div>

                    <div className="admin-booking-preview-content">

                      <strong>

                        {booking.event?.name ||
                          booking.eventName ||
                          `Event #${
                            booking.eventId ||
                            "-"
                          }`}

                      </strong>

                      <span>

                        User:{" "}
                        {booking.user?.name ||
                          booking.userName ||
                          `User #${
                            booking.userId ||
                            "-"
                          }`}

                      </span>

                      <small>

                        Booking ID:{" "}
                        {booking.id || "-"}

                      </small>

                    </div>

                    <div className="admin-booking-preview-amount">

                      ₹
                      {Number(
                        booking.totalAmount ??
                        booking.amount ??
                        booking.totalPrice ??
                        booking.price ??
                        0
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>

        {/* ===================================================
            QUICK ACTIONS
        =================================================== */}

        <section className="admin-quick-actions-section">

          <div className="admin-section-header">

            <div>

              <h2>
                Quick Actions
              </h2>

              <p>
                Frequently used administration
                tools
              </p>

            </div>

          </div>

          <div className="admin-quick-actions-grid">

            <button
              type="button"
              className="admin-quick-action-card"
              onClick={() =>
                navigate("/admin/users")
              }
            >

              <span className="admin-quick-action-icon">
                👥
              </span>

              <span>
                Manage Users
              </span>

              <small>
                View and manage accounts
              </small>

            </button>

            <button
              type="button"
              className="admin-quick-action-card"
              onClick={() =>
                navigate("/admin/events")
              }
            >

              <span className="admin-quick-action-icon">
                🎫
              </span>

              <span>
                Manage Events
              </span>

              <small>
                Create and update events
              </small>

            </button>

            <button
              type="button"
              className="admin-quick-action-card"
              onClick={() =>
                navigate("/admin/bookings")
              }
            >

              <span className="admin-quick-action-icon">
                📋
              </span>

              <span>
                Manage Bookings
              </span>

              <small>
                View ticket bookings
              </small>

            </button>

          </div>

        </section>

        {/* ===================================================
            SYSTEM INFORMATION
        =================================================== */}

        <section className="admin-system-section">

          <div className="admin-system-card">

            <div className="admin-system-icon">
              ⚙️
            </div>

            <div>

              <h3>
                System Status
              </h3>

              <p>
                TicketBook backend connection
              </p>

            </div>

            <span className="admin-status-online">
              ● Online
            </span>

          </div>

          <div className="admin-system-card">

            <div className="admin-system-icon">
              🔐
            </div>

            <div>

              <h3>
                Admin Security
              </h3>

              <p>
                Administrator session is active
              </p>

            </div>

            <span className="admin-status-secure">
              ● Secure
            </span>

          </div>

        </section>

      </main>

    </div>
  );
}

export default AdminDashboard;