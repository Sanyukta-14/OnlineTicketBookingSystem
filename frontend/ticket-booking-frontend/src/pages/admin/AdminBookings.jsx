import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import "../../styles/AdminBookings.css";

// =========================================================
// API URL
// =========================================================

const API_URL = "http://localhost:8080/bookings";

// =========================================================
// ADMIN BOOKINGS
// =========================================================

function AdminBookings() {

  // =========================================================
  // STATE
  // =========================================================

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [deleting, setDeleting] = useState(null);

  const [search, setSearch] = useState("");


  // =========================================================
  // GET ERROR MESSAGE
  // =========================================================

  const getErrorMessage = (error, defaultMessage) => {

    if (error?.response) {

      const data = error.response.data;

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
        "Unable to connect to the backend server. " +
        "Make sure Spring Boot is running on port 8080."
      );
    }

    return defaultMessage;
  };


  // =========================================================
  // LOAD BOOKINGS
  //
  // Used by Refresh button.
  // Initial loading is handled separately inside useEffect.
  // =========================================================

  const loadBookings = useCallback(async () => {

    try {

      setRefreshing(true);

      setError("");

      setSuccess("");


      const response = await axios.get(API_URL);


      const data = Array.isArray(response.data)
        ? response.data
        : [];


      setBookings(data);


      setSuccess(
        "Bookings refreshed successfully."
      );


      setTimeout(() => {
        setSuccess("");
      }, 3000);

    } catch (error) {

      console.error(
        "Error refreshing bookings:",
        error
      );


      setError(
        getErrorMessage(
          error,
          "Unable to refresh bookings."
        )
      );

    } finally {

      setRefreshing(false);

    }

  }, []);


  // =========================================================
  // INITIAL LOAD
  //
  // IMPORTANT:
  // The API request is directly inside useEffect.
  // We do NOT call loadBookings() here.
  // =========================================================

  useEffect(() => {

    let cancelled = false;


    const fetchBookings = async () => {

      try {

        const response =
          await axios.get(API_URL);


        if (cancelled) {
          return;
        }


        const data =
          Array.isArray(response.data)
            ? response.data
            : [];


        setBookings(data);


      } catch (error) {

        if (cancelled) {
          return;
        }


        console.error(
          "Error loading bookings:",
          error
        );


        setError(
          getErrorMessage(
            error,
            "Unable to load bookings."
          )
        );


      } finally {

        if (!cancelled) {

          setLoading(false);

        }

      }

    };


    fetchBookings();


    return () => {

      cancelled = true;

    };

  }, []);


  // =========================================================
  // DELETE BOOKING
  // =========================================================

  const handleDeleteBooking = async (bookingId) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this booking?"
      );


    if (!confirmDelete) {
      return;
    }


    try {

      setDeleting(bookingId);

      setError("");

      setSuccess("");


      await axios.delete(
        `${API_URL}/${bookingId}`
      );


      // -----------------------------------------------------
      // REMOVE BOOKING FROM UI
      // -----------------------------------------------------

      setBookings(
        (previousBookings) =>
          previousBookings.filter(
            (booking) =>
              booking.id !== bookingId
          )
      );


      setSuccess(
        "Booking deleted successfully."
      );


      setTimeout(() => {

        setSuccess("");

      }, 3000);


    } catch (error) {

      console.error(
        "Error deleting booking:",
        error
      );


      setError(
        getErrorMessage(
          error,
          "Unable to delete booking."
        )
      );


    } finally {

      setDeleting(null);

    }

  };


  // =========================================================
  // REFRESH
  // =========================================================

  const handleRefresh = () => {

    loadBookings();

  };


  // =========================================================
  // SEARCH
  // =========================================================

  const searchText =
    search.trim().toLowerCase();


  const filteredBookings =
    bookings.filter((booking) => {

      if (!searchText) {
        return true;
      }


      const userName =
        booking.user?.name ||
        booking.userName ||
        booking.name ||
        "";


      const userEmail =
        booking.user?.email ||
        booking.userEmail ||
        "";


      const eventName =
        booking.event?.name ||
        booking.eventName ||
        booking.event?.title ||
        booking.title ||
        "";


      const bookingId =
        String(booking.id || "");


      const status =
        booking.status ||
        "CONFIRMED";


      return (

        String(userName)
          .toLowerCase()
          .includes(searchText)

        ||

        String(userEmail)
          .toLowerCase()
          .includes(searchText)

        ||

        String(eventName)
          .toLowerCase()
          .includes(searchText)

        ||

        bookingId
          .toLowerCase()
          .includes(searchText)

        ||

        String(status)
          .toLowerCase()
          .includes(searchText)

      );

    });


  // =========================================================
  // STATISTICS
  // =========================================================

  const totalBookings =
    bookings.length;


  const totalTickets =
    bookings.reduce(
      (total, booking) => {

        const tickets =
          Number(
            booking.numberOfTickets ??
            booking.tickets ??
            booking.quantity ??
            0
          );


        return (
          total +
          (
            Number.isFinite(tickets)
              ? tickets
              : 0
          )
        );

      },
      0
    );


  const totalRevenue =
    bookings.reduce(
      (total, booking) => {

        const amount =
          Number(
            booking.totalAmount ??
            booking.amount ??
            booking.totalPrice ??
            booking.price ??
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


  const confirmedBookings =
    bookings.filter(
      (booking) => {

        const status =
          String(
            booking.status ||
            "CONFIRMED"
          )
            .trim()
            .toUpperCase();


        return status === "CONFIRMED";

      }
    ).length;


  // =========================================================
  // CLEAR SEARCH
  // =========================================================

  const handleClearSearch = () => {

    setSearch("");

  };


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
          Loading Bookings...
        </h2>

        <p>
          Please wait while bookings are loaded.
        </p>

      </div>

    );

  }


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="admin-bookings-page">


      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="admin-page-header">

        <div>

          <h1>
            Booking Management
          </h1>

          <p>
            View and manage all TicketBook bookings.
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

      </div>


      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (

        <div className="admin-dashboard-error">

          <span>
            ⚠️
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
          SUCCESS MESSAGE
      ===================================================== */}

      {success && (

        <div className="admin-success-message">

          <span>
            ✅
          </span>

          <span>
            {success}
          </span>

          <button
            type="button"
            onClick={() => setSuccess("")}
            aria-label="Close success"
          >
            ×
          </button>

        </div>

      )}


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <section className="admin-booking-summary">


        {/* ===================================================
            TOTAL BOOKINGS
        =================================================== */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            📋
          </div>

          <div className="admin-stat-content">

            <span>
              Total Bookings
            </span>

            <strong>
              {totalBookings}
            </strong>

            <small>
              All bookings
            </small>

          </div>

        </div>


        {/* ===================================================
            TOTAL TICKETS
        =================================================== */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            🎫
          </div>

          <div className="admin-stat-content">

            <span>
              Total Tickets
            </span>

            <strong>
              {totalTickets}
            </strong>

            <small>
              Tickets booked
            </small>

          </div>

        </div>


        {/* ===================================================
            CONFIRMED BOOKINGS
        =================================================== */}

        <div className="admin-stat-card">

          <div className="admin-stat-icon">
            ✅
          </div>

          <div className="admin-stat-content">

            <span>
              Confirmed
            </span>

            <strong>
              {confirmedBookings}
            </strong>

            <small>
              Confirmed bookings
            </small>

          </div>

        </div>


        {/* ===================================================
            TOTAL REVENUE
        =================================================== */}

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
              {totalRevenue.toLocaleString(
                "en-IN"
              )}
            </strong>

            <small>
              Booking revenue
            </small>

          </div>

        </div>

      </section>


      {/* =====================================================
          BOOKINGS SECTION
      ===================================================== */}

      <section className="admin-bookings-section">


        {/* ===================================================
            SECTION HEADER
        =================================================== */}

        <div className="admin-section-header">

          <div>

            <h2>
              All Bookings
            </h2>

            <p>

              {searchText
                ? `Showing ${filteredBookings.length} of ${totalBookings} bookings`
                : `${totalBookings} ${
                    totalBookings === 1
                      ? "booking"
                      : "bookings"
                  } displayed`}

            </p>

          </div>


          {/* =================================================
              SEARCH
          ================================================= */}

          <div className="admin-bookings-search">

            <span className="admin-search-icon">
              🔍
            </span>

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search bookings..."
              aria-label="Search bookings"
            />


            {search && (

              <button
                type="button"
                className="admin-search-clear"
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

        {searchText &&
          filteredBookings.length > 0 && (

            <div className="admin-search-result">

              Found{" "}

              <strong>
                {filteredBookings.length}
              </strong>

              {" "}of{" "}

              <strong>
                {totalBookings}
              </strong>

              {" "}bookings.

            </div>

          )}


        {/* ===================================================
            NO BOOKINGS
        =================================================== */}

        {filteredBookings.length === 0 ? (

          <div className="admin-empty-state">

            <div className="admin-empty-icon">
              {searchText
                ? "🔍"
                : "📋"}
            </div>

            <h2>
              No Bookings Found
            </h2>

            <p>

              {searchText
                ? `No bookings match "${search}".`
                : "There are currently no ticket bookings."}

            </p>


            {searchText && (

              <button
                type="button"
                className="admin-clear-search-button"
                onClick={handleClearSearch}
              >
                Clear Search
              </button>

            )}

          </div>

        ) : (

          /* =================================================
             BOOKINGS TABLE
          ================================================= */

          <div className="admin-table-wrapper">

            <table className="admin-users-table">

              <thead>

                <tr>

                  <th>
                    ID
                  </th>

                  <th>
                    USER
                  </th>

                  <th>
                    EVENT
                  </th>

                  <th>
                    TICKETS
                  </th>

                  <th>
                    AMOUNT
                  </th>

                  <th>
                    STATUS
                  </th>

                  <th>
                    ACTION
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredBookings.map((booking) => {

                  const userName =
                    booking.user?.name ||
                    booking.userName ||
                    booking.name ||
                    booking.user?.email ||
                    "Unknown User";


                  const eventName =
                    booking.event?.name ||
                    booking.eventName ||
                    booking.event?.title ||
                    booking.title ||
                    "Unknown Event";


                  const ticketCount =
                    Number(
                      booking.numberOfTickets ??
                      booking.tickets ??
                      booking.quantity ??
                      0
                    );


                  const amount =
                    Number(
                      booking.totalAmount ??
                      booking.amount ??
                      booking.totalPrice ??
                      booking.price ??
                      0
                    );


                  const status =
                    String(
                      booking.status ||
                      "CONFIRMED"
                    )
                      .trim()
                      .toUpperCase();


                  const isConfirmed =
                    status === "CONFIRMED";


                  return (

                    <tr
                      key={
                        booking.id ||
                        `${booking.userId}-${booking.eventId}`
                      }
                    >


                      {/* ===================================
                          ID
                      =================================== */}

                      <td>

                        <span className="admin-booking-id">
                          #{booking.id || "-"}
                        </span>

                      </td>


                      {/* ===================================
                          USER
                      =================================== */}

                      <td>

                        <div className="admin-table-user">

                          <div className="admin-table-avatar">

                            {userName
                              .charAt(0)
                              .toUpperCase()}

                          </div>

                          <div>

                            <strong>
                              {userName}
                            </strong>

                            {booking.user?.email && (

                              <small>
                                {booking.user.email}
                              </small>

                            )}

                          </div>

                        </div>

                      </td>


                      {/* ===================================
                          EVENT
                      =================================== */}

                      <td>

                        <div className="admin-booking-event">

                          <strong>
                            {eventName}
                          </strong>

                          {booking.eventId && (

                            <small>
                              Event #{booking.eventId}
                            </small>

                          )}

                        </div>

                      </td>


                      {/* ===================================
                          TICKETS
                      =================================== */}

                      <td>

                        <span className="admin-booking-tickets">

                          🎫{" "}

                          {Number.isFinite(
                            ticketCount
                          )
                            ? ticketCount
                            : 0}

                        </span>

                      </td>


                      {/* ===================================
                          AMOUNT
                      =================================== */}

                      <td>

                        <strong className="admin-booking-amount">

                          ₹
                          {Number.isFinite(amount)
                            ? amount.toLocaleString(
                                "en-IN"
                              )
                            : "0"}

                        </strong>

                      </td>


                      {/* ===================================
                          STATUS
                      =================================== */}

                      <td>

                        <span
                          className={
                            isConfirmed
                              ? "admin-role-badge admin-booking-status-confirmed"
                              : "admin-role-badge admin-booking-status-other"
                          }
                        >

                          {status}

                        </span>

                      </td>


                      {/* ===================================
                          ACTION
                      =================================== */}

                      <td>

                        <button
                          type="button"
                          className="delete-user-button"
                          onClick={() =>
                            handleDeleteBooking(
                              booking.id
                            )
                          }
                          disabled={
                            deleting === booking.id
                          }
                        >

                          {deleting === booking.id
                            ? "Deleting..."
                            : "Delete"}

                        </button>

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

export default AdminBookings;
