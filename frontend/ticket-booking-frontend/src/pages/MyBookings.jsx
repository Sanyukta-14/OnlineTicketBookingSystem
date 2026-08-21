import { useEffect, useState } from "react";
import axios from "axios";

function MyBookings() {

  // =========================================================
  // STATE
  // =========================================================

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [cancellingId, setCancellingId] =
    useState(null);


  // =========================================================
  // GET LOGGED-IN USER
  // =========================================================

  const getLoggedInUser = () => {

    const savedUser =
      localStorage.getItem("loggedInUser");

    if (!savedUser) {
      return null;
    }

    try {

      return JSON.parse(savedUser);

    } catch (error) {

      console.error(
        "Unable to read logged-in user:",
        error
      );

      localStorage.removeItem(
        "loggedInUser"
      );

      return null;
    }
  };


  const loggedInUser =
    getLoggedInUser();

  const userId =
    loggedInUser?.id;


  // =========================================================
  // LOAD BOOKINGS
  // =========================================================

  useEffect(() => {

    let cancelled = false;


    const fetchBookings = async () => {

      try {

        setLoading(true);
        setError("");


        // -----------------------------------------------------
        // USER NOT LOGGED IN
        // -----------------------------------------------------

        if (!userId) {

          if (!cancelled) {

            setError(
              "Please login to view your bookings."
            );

            setLoading(false);

          }

          return;
        }


        // -----------------------------------------------------
        // GET BOOKINGS
        // -----------------------------------------------------

        const response =
          await axios.get(
            `http://localhost:8080/bookings/user/${userId}`
          );


        const data =
          Array.isArray(response.data)
            ? response.data
            : [];


        if (!cancelled) {

          setBookings(data);

        }

      } catch (err) {

        console.error(
          "Error loading bookings:",
          err
        );


        if (!cancelled) {

          let errorMessage =
            "Unable to load your bookings.";


          // ---------------------------------------------------
          // BACKEND ERROR
          // ---------------------------------------------------

          if (err.response?.data) {

            if (
              typeof err.response.data ===
              "string"
            ) {

              errorMessage =
                err.response.data;

            } else if (
              err.response.data?.message
            ) {

              errorMessage =
                err.response.data.message;

            } else if (
              err.response.data?.error
            ) {

              errorMessage =
                err.response.data.error;

            }

          }


          // ---------------------------------------------------
          // BACKEND CONNECTION ERROR
          // ---------------------------------------------------

          else if (err.request) {

            errorMessage =
              "Unable to connect to the backend server. Please make sure Spring Boot is running.";

          }


          setError(errorMessage);

        }

      } finally {

        if (!cancelled) {

          setLoading(false);

        }

      }

    };


    fetchBookings();


    // =======================================================
    // CLEANUP
    // =======================================================

    return () => {

      cancelled = true;

    };

  }, [userId]);


  // =========================================================
  // CANCEL BOOKING
  // =========================================================

  const cancelBooking = async (
    bookingId
  ) => {

    const confirmCancel =
      window.confirm(
        "Are you sure you want to cancel this booking?"
      );


    if (!confirmCancel) {
      return;
    }


    try {

      setCancellingId(bookingId);

      setError("");


      // -----------------------------------------------------
      // CANCEL BOOKING
      // -----------------------------------------------------

      await axios.put(
        `http://localhost:8080/bookings/${bookingId}/cancel`
      );


      // -----------------------------------------------------
      // UPDATE BOOKING STATUS
      // -----------------------------------------------------

      setBookings(
        (currentBookings) =>

          currentBookings.map(
            (booking) => {

              if (
                booking.id === bookingId
              ) {

                return {
                  ...booking,
                  status: "CANCELLED",
                };

              }

              return booking;

            }
          )
      );


      alert(
        "Booking cancelled successfully."
      );

    } catch (err) {

      console.error(
        "Cancellation error:",
        err
      );


      let errorMessage =
        "Unable to cancel booking.";


      // -----------------------------------------------------
      // BACKEND ERROR
      // -----------------------------------------------------

      if (err.response?.data) {

        if (
          typeof err.response.data ===
          "string"
        ) {

          errorMessage =
            err.response.data;

        } else if (
          err.response.data?.message
        ) {

          errorMessage =
            err.response.data.message;

        } else if (
          err.response.data?.error
        ) {

          errorMessage =
            err.response.data.error;

        }

      }


      // -----------------------------------------------------
      // CONNECTION ERROR
      // -----------------------------------------------------

      else if (err.request) {

        errorMessage =
          "Unable to connect to the backend server.";

      }


      setError(errorMessage);

    } finally {

      setCancellingId(null);

    }

  };


  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {

    if (!date) {
      return "N/A";
    }

    try {

      return new Date(date).toLocaleString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );

    } catch {

      return date;

    }

  };


  // =========================================================
  // FORMAT EVENT DATE
  // =========================================================

  const formatEventDate = (date) => {

    if (!date) {
      return "Date not available";
    }

    try {

      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    } catch {

      return date;

    }

  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className="page-message">

        <div className="loading-spinner"></div>

        <h2>
          Loading your bookings...
        </h2>

        <p>
          Please wait while we fetch your tickets.
        </p>

      </div>

    );

  }


  // =========================================================
  // ERROR WITH NO BOOKINGS
  // =========================================================

  if (
    error &&
    bookings.length === 0
  ) {

    return (

      <div className="page-message">

        <div className="error-icon">
          ⚠️
        </div>

        <h2 className="error-message">
          {error}
        </h2>

      </div>

    );

  }


  // =========================================================
  // STATISTICS
  // =========================================================

  const totalBookings =
    bookings.length;


  const confirmedBookings =
    bookings.filter(
      (booking) =>
        booking.status === "CONFIRMED"
    ).length;


  const cancelledBookings =
    bookings.filter(
      (booking) =>
        booking.status === "CANCELLED"
    ).length;


  const totalSpent =
    bookings
      .filter(
        (booking) =>
          booking.status !== "CANCELLED"
      )
      .reduce(
        (total, booking) =>
          total +
          Number(
            booking.totalAmount || 0
          ),
        0
      );


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="bookings-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <section className="bookings-hero">

        <div className="bookings-hero-content">

          <span className="bookings-label">
            🎟️ TICKETBOOK
          </span>

          <h1>
            My Bookings
          </h1>

          <p>
            View and manage all your
            ticket bookings in one place.
          </p>

        </div>

      </section>


      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error &&
        bookings.length > 0 && (

          <div className="booking-error">

            <span>
              ⚠️
            </span>

            {error}

          </div>

        )}


      {/* =====================================================
          BOOKING SUMMARY
      ===================================================== */}

      <section className="booking-summary">

        <div className="booking-summary-card">

          <div className="booking-summary-icon purple">
            🎟️
          </div>

          <div>

            <span>
              Total Bookings
            </span>

            <strong>
              {totalBookings}
            </strong>

          </div>

        </div>


        <div className="booking-summary-card">

          <div className="booking-summary-icon green">
            ✓
          </div>

          <div>

            <span>
              Confirmed
            </span>

            <strong>
              {confirmedBookings}
            </strong>

          </div>

        </div>


        <div className="booking-summary-card">

          <div className="booking-summary-icon red">
            ×
          </div>

          <div>

            <span>
              Cancelled
            </span>

            <strong>
              {cancelledBookings}
            </strong>

          </div>

        </div>


        <div className="booking-summary-card">

          <div className="booking-summary-icon blue">
            ₹
          </div>

          <div>

            <span>
              Total Spent
            </span>

            <strong>
              ₹{totalSpent.toFixed(2)}
            </strong>

          </div>

        </div>

      </section>


      {/* =====================================================
          NO BOOKINGS
      ===================================================== */}

      {bookings.length === 0 ? (

        <section className="no-bookings">

          <div className="no-bookings-icon">
            🎟️
          </div>

          <h2>
            No Bookings Yet
          </h2>

          <p>
            You haven't booked any tickets yet.
            Explore our events and find something
            exciting to experience.
          </p>

          <button
            type="button"
            className="browse-events-button"
            onClick={() =>
              window.location.href =
                "/events"
            }
          >
            Explore Events →
          </button>

        </section>

      ) : (

        /* ===================================================
           BOOKINGS
        =================================================== */

        <section className="bookings-section">

          <div className="bookings-section-heading">

            <div>

              <span>
                YOUR TICKETS
              </span>

              <h2>
                Booking History
              </h2>

            </div>

            <span className="booking-count">
              {totalBookings}{" "}
              {totalBookings === 1
                ? "Booking"
                : "Bookings"}
            </span>

          </div>


          <div className="bookings-container">

            {bookings.map(
              (booking) => {

                const event =
                  booking.event || {};

                const user =
                  booking.user || {};

                const seats =
                  Array.isArray(
                    booking.seats
                  )
                    ? booking.seats
                    : [];


                const isConfirmed =
                  booking.status ===
                  "CONFIRMED";


                const isCancelled =
                  booking.status ===
                  "CANCELLED";


                const isCancelling =
                  cancellingId ===
                  booking.id;


                return (

                  <article
                    className={
                      `booking-card ${
                        isCancelled
                          ? "booking-card-cancelled"
                          : ""
                      }`
                    }
                    key={booking.id}
                  >

                    {/* =====================================
                        BOOKING TOP
                    ===================================== */}

                    <div className="booking-card-top">

                      <div className="booking-card-title">

                        <div className="booking-event-icon">
                          🎬
                        </div>

                        <div>

                          <span>
                            BOOKING #
                            {booking.id}
                          </span>

                          <h2>
                            {event.name ||
                              "Event"}
                          </h2>

                        </div>

                      </div>


                      <span
                        className={
                          isConfirmed
                            ? "booking-status confirmed"
                            : "booking-status cancelled"
                        }
                      >

                        <span className="status-dot"></span>

                        {booking.status ||
                          "UNKNOWN"}

                      </span>

                    </div>


                    {/* =====================================
                        DIVIDER
                    ===================================== */}

                    <div className="booking-divider"></div>


                    {/* =====================================
                        EVENT INFORMATION
                    ===================================== */}

                    <div className="booking-event-info">

                      <div className="booking-info-item">

                        <span className="booking-info-icon">
                          📅
                        </span>

                        <div>

                          <small>
                            DATE
                          </small>

                          <strong>
                            {formatEventDate(
                              event.date
                            )}
                          </strong>

                        </div>

                      </div>


                      <div className="booking-info-item">

                        <span className="booking-info-icon">
                          🕐
                        </span>

                        <div>

                          <small>
                            TIME
                          </small>

                          <strong>
                            {event.time ||
                              "N/A"}
                          </strong>

                        </div>

                      </div>


                      <div className="booking-info-item">

                        <span className="booking-info-icon">
                          📍
                        </span>

                        <div>

                          <small>
                            VENUE
                          </small>

                          <strong>
                            {event.venue ||
                              "N/A"}
                          </strong>

                        </div>

                      </div>


                      <div className="booking-info-item">

                        <span className="booking-info-icon">
                          🎭
                        </span>

                        <div>

                          <small>
                            CATEGORY
                          </small>

                          <strong>
                            {event.category ||
                              "Event"}
                          </strong>

                        </div>

                      </div>

                    </div>


                    {/* =====================================
                        SEATS
                    ===================================== */}

                    <div className="booking-seats-section">

                      <div className="booking-seats-heading">

                        <span>
                          💺
                        </span>

                        <strong>
                          Selected Seats
                        </strong>

                        <small>
                          {seats.length}{" "}
                          {seats.length === 1
                            ? "seat"
                            : "seats"}
                        </small>

                      </div>


                      {seats.length > 0 ? (

                        <div className="booking-seat-list">

                          {seats.map(
                            (seat) => (

                              <span
                                key={seat.id}
                                className="booking-seat"
                              >

                                💺{" "}
                                {seat.seatNumber ||
                                  `Seat ${seat.id}`}

                              </span>

                            )
                          )}

                        </div>

                      ) : (

                        <span className="no-seat-text">
                          No seats available
                        </span>

                      )}

                    </div>


                    {/* =====================================
                        BOOKING FOOTER
                    ===================================== */}

                    <div className="booking-card-footer">

                      <div className="booking-meta">

                        <div>

                          <small>
                            BOOKED BY
                          </small>

                          <strong>
                            👤{" "}
                            {user.name ||
                              loggedInUser?.name ||
                              "N/A"}
                          </strong>

                        </div>


                        <div>

                          <small>
                            BOOKING DATE
                          </small>

                          <strong>
                            {formatDate(
                              booking.bookingDate
                            )}
                          </strong>

                        </div>

                      </div>


                      <div className="booking-total">

                        <small>
                          TOTAL AMOUNT
                        </small>

                        <strong>
                          ₹
                          {Number(
                            booking.totalAmount ||
                            0
                          ).toFixed(2)}
                        </strong>

                      </div>

                    </div>


                    {/* =====================================
                        ACTION
                    ===================================== */}

                    {isConfirmed && (

                      <div className="booking-actions">

                        <button
                          type="button"
                          className="cancel-button"
                          onClick={() =>
                            cancelBooking(
                              booking.id
                            )
                          }
                          disabled={
                            isCancelling
                          }
                        >

                          {isCancelling
                            ? "Cancelling..."
                            : "Cancel Booking"}

                        </button>

                      </div>

                    )}


                    {isCancelled && (

                      <div className="cancelled-booking-message">

                        <span>
                          ✓
                        </span>

                        This booking has been cancelled.

                      </div>

                    )}

                  </article>

                );

              }
            )}

          </div>

        </section>

      )}

    </div>

  );

}

export default MyBookings;