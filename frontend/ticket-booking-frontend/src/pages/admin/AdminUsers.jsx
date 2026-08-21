import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/AdminUsers.css";

// =========================================================
// API
// =========================================================

const API_URL = "http://localhost:8080/users";

// =========================================================
// ADMIN USERS PAGE
// =========================================================

function AdminUsers() {

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

    let cancelled = false;

    const fetchUsers = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await axios.get(API_URL);

        if (cancelled) {
          return;
        }

        const data = Array.isArray(response.data)
          ? response.data
          : [];

        setUsers(data);

      } catch (error) {

        if (cancelled) {
          return;
        }

        console.error(
          "Error loading admin users:",
          error
        );

        if (error.response) {

          const data = error.response.data;

          if (typeof data === "string") {

            setError(data);

          } else if (data?.message) {

            setError(data.message);

          } else if (data?.error) {

            setError(data.error);

          } else {

            setError(
              "Unable to load users."
            );

          }

        } else if (error.request) {

          setError(
            "Unable to connect to the backend server. Make sure Spring Boot is running on port 8080."
          );

        } else {

          setError(
            "Unable to load users."
          );

        }

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }

    };

    fetchUsers();

    return () => {
      cancelled = true;
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

      await axios.delete(
        `${API_URL}/${userId}`
      );


      // -----------------------------------------------------
      // REMOVE USER FROM UI
      // -----------------------------------------------------

      setUsers((previousUsers) =>
        previousUsers.filter(
          (user) => user.id !== userId
        )
      );


      // -----------------------------------------------------
      // SUCCESS MESSAGE
      // -----------------------------------------------------

      setSuccess(
        "User deleted successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);

    } catch (error) {

      console.error(
        "Error deleting user:",
        error
      );

      if (error.response) {

        const data = error.response.data;

        if (typeof data === "string") {

          setError(data);

        } else if (data?.message) {

          setError(data.message);

        } else if (data?.error) {

          setError(data.error);

        } else {

          setError(
            "Unable to delete user."
          );

        }

      } else if (error.request) {

        setError(
          "Unable to connect to the backend server."
        );

      } else {

        setError(
          "Unable to delete user."
        );

      }

    } finally {

      setDeleting(null);

    }

  };


  // =========================================================
  // SEARCH
  // =========================================================

  const searchText =
    search.trim().toLowerCase();

  const filteredUsers = users.filter(
    (user) => {

      if (!searchText) {
        return true;
      }

      return (

        String(user.name || "")
          .toLowerCase()
          .includes(searchText)

        ||

        String(user.email || "")
          .toLowerCase()
          .includes(searchText)

        ||

        String(user.phone || "")
          .toLowerCase()
          .includes(searchText)

        ||

        String(user.role || "")
          .toLowerCase()
          .includes(searchText)

        ||

        String(user.id || "")
          .toLowerCase()
          .includes(searchText)

      );

    }
  );


  // =========================================================
  // STATISTICS
  // =========================================================

  const totalUsers = users.length;

  const adminUsers = users.filter(
    (user) => {

      const role = String(
        user.role || ""
      )
        .trim()
        .toUpperCase();

      return role === "ADMIN";

    }
  ).length;

  const normalUsers =
    totalUsers - adminUsers;


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

      <div className="admin-users-loading">

        <div className="admin-users-spinner"></div>

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

    <div className="admin-users-page">


      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <header className="admin-users-header">

        <div className="admin-users-title">

          <h1>
            User Management
          </h1>

          <p>
            View and manage all registered TicketBook users.
          </p>

        </div>


        {/* TOTAL COUNT */}

        <div className="admin-users-header-count">

          <strong>
            {totalUsers}
          </strong>

          <span>
            {totalUsers === 1
              ? "User"
              : "Users"}
          </span>

        </div>

      </header>


      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (

        <div
          className="
            admin-users-alert
            admin-users-alert-error
          "
        >

          <span className="admin-users-alert-icon">
            !
          </span>

          <span className="admin-users-alert-message">
            {error}
          </span>

          <button
            type="button"
            className="admin-users-alert-close"
            onClick={() => setError("")}
            aria-label="Close error"
          >
            ×
          </button>

        </div>

      )}


      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {success && (

        <div
          className="
            admin-users-alert
            admin-users-alert-success
          "
        >

          <span className="admin-users-alert-icon">
            ✓
          </span>

          <span className="admin-users-alert-message">
            {success}
          </span>

          <button
            type="button"
            className="admin-users-alert-close"
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

      <section className="admin-users-stats">


        {/* TOTAL USERS */}

        <div className="admin-users-stat-card">

          <div className="admin-users-stat-icon">
            👥
          </div>

          <div className="admin-users-stat-content">

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


        {/* NORMAL USERS */}

        <div className="admin-users-stat-card">

          <div className="admin-users-stat-icon">
            👤
          </div>

          <div className="admin-users-stat-content">

            <span>
              Normal Users
            </span>

            <strong>
              {normalUsers}
            </strong>

            <small>
              Customer accounts
            </small>

          </div>

        </div>


        {/* ADMIN USERS */}

        <div className="admin-users-stat-card">

          <div className="admin-users-stat-icon">
            🛡️
          </div>

          <div className="admin-users-stat-content">

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
          MAIN USERS SECTION
      ===================================================== */}

      <section className="admin-users-section">


        {/* ===================================================
            SECTION HEADER
        =================================================== */}

        <div className="admin-users-section-header">

          <div className="admin-users-section-title">

            <h2>
              Registered Users
            </h2>

            <p>

              {searchText
                ? `Showing ${filteredUsers.length} of ${totalUsers} users`
                : `${totalUsers} ${
                    totalUsers === 1
                      ? "user"
                      : "users"
                  } displayed`
              }

            </p>

          </div>


          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="admin-users-search">

            <span className="admin-users-search-icon">
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
                className="admin-users-search-clear"
                onClick={handleClearSearch}
                aria-label="Clear search"
              >
                ×
              </button>

            )}

          </div>

        </div>


        {/* ===================================================
            SEARCH RESULT
        =================================================== */}

        {searchText && (

          <div className="admin-users-search-result">

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


        {/* ===================================================
            EMPTY STATE
        =================================================== */}

        {filteredUsers.length === 0 ? (

          <div className="admin-users-empty">

            <div className="admin-users-empty-icon">

              {searchText
                ? "🔍"
                : "👥"}

            </div>

            <h3>

              {searchText
                ? "No Users Found"
                : "No Registered Users"}

            </h3>

            <p>

              {searchText
                ? `No users match "${search}".`
                : "There are currently no registered TicketBook users."
              }

            </p>

            {searchText && (

              <button
                type="button"
                className="admin-users-clear-search"
                onClick={handleClearSearch}
              >
                Clear Search
              </button>

            )}

          </div>

        ) : (

          /* =================================================
             USERS TABLE
          ================================================= */

          <div className="admin-users-table-wrapper">

            <table className="admin-users-table">

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
                    ID
                  </th>

                  <th>
                    ACTIONS
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredUsers.map((user) => {

                  const role =
                    String(
                      user.role || "USER"
                    )
                      .trim()
                      .toUpperCase();

                  const isAdmin =
                    role === "ADMIN";

                  const userName =
                    user.name ||
                    "Unknown User";

                  const initial =
                    userName
                      .charAt(0)
                      .toUpperCase();

                  return (

                    <tr key={user.id}>

                      {/* USER */}

                      <td>

                        <div className="admin-users-table-user">

                          <div className="admin-users-avatar">
                            {initial}
                          </div>

                          <div className="admin-users-name">

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

                        <span className="admin-users-email">

                          {user.email ||
                            "No email available"}

                        </span>

                      </td>


                      {/* PHONE */}

                      <td>

                        <span className="admin-users-phone">

                          {user.phone ||
                            "No phone available"}

                        </span>

                      </td>


                      {/* ROLE */}

                      <td>

                        <span
                          className={
                            isAdmin
                              ? "admin-users-role admin-users-role-admin"
                              : "admin-users-role admin-users-role-user"
                          }
                        >

                          {isAdmin
                            ? "ADMIN"
                            : "USER"}

                        </span>

                      </td>


                      {/* ID */}

                      <td>

                        <span className="admin-users-id">
                          #{user.id}
                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td>

                        <div className="admin-users-actions">

                          <button
                            type="button"
                            className="admin-users-delete-button"
                            onClick={() =>
                              handleDeleteUser(
                                user.id
                              )
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


// =========================================================
// EXPORT
// =========================================================

export default AdminUsers;