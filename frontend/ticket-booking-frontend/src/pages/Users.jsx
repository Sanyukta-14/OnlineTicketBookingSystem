import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Users.css";

const API_URL = "http://localhost:8080/users";

function Users() {
  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");

  // =========================================================
  // LOAD USERS
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const loadUsers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axios.get(API_URL);

        if (!mounted) {
          return;
        }

        setUsers(
          Array.isArray(response.data)
            ? response.data
            : []
        );
      } catch (error) {
        console.error("Error loading users:", error);

        if (!mounted) {
          return;
        }

        if (error.response) {
          const data = error.response.data;

          if (typeof data === "string") {
            setError(data);
          } else if (data?.message) {
            setError(data.message);
          } else if (data?.error) {
            setError(data.error);
          } else {
            setError("Unable to load users.");
          }
        } else if (error.request) {
          setError(
            "Unable to connect to the backend server. Make sure Spring Boot is running on port 8080."
          );
        } else {
          setError("Unable to load users.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      mounted = false;
    };
  }, []);

  // =========================================================
  // DELETE USER
  // =========================================================

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleting(userId);
      setError("");
      setSuccess("");

      await axios.delete(`${API_URL}/${userId}`);

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user.id !== userId
        )
      );

      setSuccess("User deleted successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("Error deleting user:", error);

      if (error.response) {
        const data = error.response.data;

        if (typeof data === "string") {
          setError(data);
        } else if (data?.message) {
          setError(data.message);
        } else if (data?.error) {
          setError(data.error);
        } else {
          setError("Unable to delete user.");
        }
      } else if (error.request) {
        setError(
          "Unable to connect to the backend server."
        );
      } else {
        setError("Unable to delete user.");
      }
    } finally {
      setDeleting(null);
    }
  };

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalUsers = users.length;

  const adminUsers = users.filter(
    (user) =>
      String(user.role || "")
        .trim()
        .toUpperCase() === "ADMIN"
  ).length;

  const regularUsers = totalUsers - adminUsers;

  // =========================================================
  // SEARCH
  // =========================================================

  const searchValue = search.trim().toLowerCase();

  const filteredUsers = users.filter((user) => {
    if (!searchValue) {
      return true;
    }

    return (
      String(user.name || "")
        .toLowerCase()
        .includes(searchValue) ||

      String(user.email || "")
        .toLowerCase()
        .includes(searchValue) ||

      String(user.phone || "")
        .toLowerCase()
        .includes(searchValue) ||

      String(user.role || "")
        .toLowerCase()
        .includes(searchValue) ||

      String(user.id || "")
        .toLowerCase()
        .includes(searchValue)
    );
  });

  // =========================================================
  // VIEW USER
  // =========================================================

  const handleViewUser = (userId) => {
    navigate(`/users/${userId}`);
  };

  // =========================================================
  // CLEAR SEARCH
  // =========================================================

  const handleClearSearch = () => {
    setSearch("");
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="users-loading-page">
        <div className="users-loading-spinner"></div>

        <h2>
          Loading Users...
        </h2>

        <p>
          Please wait while users are being loaded.
        </p>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="users-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="users-page-header">

        <div className="users-title-area">
          <h1>
            User Management
          </h1>

          <p>
            View and manage all registered TicketBook users.
          </p>
        </div>

        <div className="users-header-count">
          <strong>
            {totalUsers}
          </strong>

          <span>
            {totalUsers === 1 ? "User" : "Users"}
          </span>
        </div>

      </div>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="users-alert users-alert-error">

          <span className="users-alert-symbol">
            !
          </span>

          <span>
            {error}
          </span>

          <button
            type="button"
            onClick={() => setError("")}
            aria-label="Close error"
          >
            ×
          </button>

        </div>
      )}


      {/* =====================================================
          SUCCESS
      ===================================================== */}

      {success && (
        <div className="users-alert users-alert-success">

          <span className="users-alert-symbol">
            ✓
          </span>

          <span>
            {success}
          </span>

          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Close success message"
          >
            ×
          </button>

        </div>
      )}


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="users-stats">

        <div className="users-stat-card">

          <div className="users-stat-icon">
            👥
          </div>

          <div className="users-stat-content">

            <span>
              Total Users
            </span>

            <strong>
              {totalUsers}
            </strong>

            <small>
              Registered accounts
            </small>

          </div>

        </div>


        <div className="users-stat-card">

          <div className="users-stat-icon">
            👤
          </div>

          <div className="users-stat-content">

            <span>
              Regular Users
            </span>

            <strong>
              {regularUsers}
            </strong>

            <small>
              Customer accounts
            </small>

          </div>

        </div>


        <div className="users-stat-card">

          <div className="users-stat-icon">
            🛡️
          </div>

          <div className="users-stat-content">

            <span>
              Administrators
            </span>

            <strong>
              {adminUsers}
            </strong>

            <small>
              Admin accounts
            </small>

          </div>

        </div>

      </section>


      {/* =====================================================
          ALL USERS
      ===================================================== */}

      <section className="users-section">

        <div className="users-section-header">

          <div className="users-section-title">

            <h2>
              All Users
            </h2>

            <p>
              Manage your existing TicketBook users.
            </p>

          </div>


          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="users-search">

            <span
              className="users-search-icon"
              aria-hidden="true"
            >
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search users..."
              aria-label="Search users"
            />

            {search && (
              <button
                type="button"
                className="users-search-clear"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                ×
              </button>
            )}

          </div>

        </div>


        {/* =====================================================
            SEARCH RESULT
        ===================================================== */}

        {search && (
          <div className="users-search-result">

            Showing{" "}

            <strong>
              {filteredUsers.length}
            </strong>

            {" "}of{" "}

            <strong>
              {totalUsers}
            </strong>

            {" "}users

          </div>
        )}


        {/* =====================================================
            EMPTY STATE
        ===================================================== */}

        {filteredUsers.length === 0 ? (

          <div className="users-empty">

            <div className="users-empty-icon">
              {search ? "🔍" : "👥"}
            </div>

            <h3>
              {search
                ? "No Users Found"
                : "No Registered Users"}
            </h3>

            <p>
              {search
                ? `No users match "${search}".`
                : "There are currently no registered TicketBook users."}
            </p>

            {search && (
              <button
                type="button"
                className="users-clear-search"
                onClick={handleClearSearch}
              >
                Clear Search
              </button>
            )}

          </div>

        ) : (

          /* ===================================================
             USERS TABLE
          =================================================== */

          <div className="users-table-wrapper">

            <table className="users-table">

              <thead>

                <tr>

                  <th>
                    USER
                  </th>

                  <th>
                    EMAIL
                  </th>

                  <th>
                    PHONE
                  </th>

                  <th>
                    ROLE
                  </th>

                  <th>
                    USER ID
                  </th>

                  <th>
                    ACTIONS
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredUsers.map((user) => {

                  const role =
                    String(user.role || "USER")
                      .trim()
                      .toUpperCase();

                  const isAdmin =
                    role === "ADMIN";

                  const userName =
                    user.name || "Unknown User";

                  const initial =
                    userName
                      .charAt(0)
                      .toUpperCase();

                  return (
                    <tr key={user.id}>

                      {/* USER */}

                      <td>

                        <div className="users-table-user">

                          <div className="users-avatar">
                            {initial}
                          </div>

                          <div className="users-name">

                            <strong>
                              {userName}
                            </strong>

                            <span>
                              {isAdmin
                                ? "Administrator"
                                : "Registered user"}
                            </span>

                          </div>

                        </div>

                      </td>


                      {/* EMAIL */}

                      <td>

                        <span className="users-email">
                          {user.email ||
                            "No email available"}
                        </span>

                      </td>


                      {/* PHONE */}

                      <td>

                        <span className="users-phone">
                          {user.phone ||
                            "No phone available"}
                        </span>

                      </td>


                      {/* ROLE */}

                      <td>

                        <span
                          className={
                            isAdmin
                              ? "users-role users-role-admin"
                              : "users-role users-role-user"
                          }
                        >
                          {isAdmin
                            ? "ADMIN"
                            : "USER"}
                        </span>

                      </td>


                      {/* USER ID */}

                      <td>

                        <span className="users-id">
                          #{user.id}
                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="users-actions">

                          <button
                            type="button"
                            className="users-view-button"
                            onClick={() =>
                              handleViewUser(user.id)
                            }
                          >
                            View
                          </button>


                          <button
                            type="button"
                            className="users-delete-button"
                            onClick={() =>
                              handleDeleteUser(user.id)
                            }
                            disabled={
                              deleting === user.id
                            }
                          >
                            {deleting === user.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        )}

      </section>

    </div>
  );
}

export default Users;