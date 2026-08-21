import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/UserProfile.css";

const API_BASE_URL = "http://localhost:8080";

function UserProfile() {
  const { userId } = useParams();

  // =========================================================
  // STATES
  // =========================================================

  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");

  // =========================================================
  // LOAD USER PROFILE
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const loadUserProfile = async () => {
      if (!userId) {
        setError("User ID is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          `${API_BASE_URL}/users/${userId}`
        );

        if (!mounted) {
          return;
        }

        if (!response.data) {
          setUser(null);
          setError("User profile was not found.");
          return;
        }

        setUser(response.data);
      } catch (error) {
        console.error(
          "Error loading user profile:",
          error
        );

        if (!mounted) {
          return;
        }

        setUser(null);

        if (error.response) {
          const data = error.response.data;

          if (typeof data === "string") {
            setError(data);
          } else if (data?.message) {
            setError(data.message);
          } else if (data?.error) {
            setError(data.error);
          } else if (error.response.status === 404) {
            setError("User not found.");
          } else if (error.response.status === 500) {
            setError(
              "Server error. Please try again."
            );
          } else {
            setError(
              "Unable to load user profile."
            );
          }
        } else if (error.request) {
          setError(
            "Unable to connect to the backend server. " +
            "Make sure Spring Boot is running."
          );
        } else {
          setError(
            "Something went wrong. Please try again."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadUserProfile();

    return () => {
      mounted = false;
    };
  }, [userId]);

  // =========================================================
  // LOAD USER BOOKINGS
  // =========================================================

  useEffect(() => {
    let mounted = true;

    const loadUserBookings = async () => {
      if (!userId) {
        setBookingError("User ID is missing.");
        setBookingsLoading(false);
        return;
      }

      try {
        setBookingsLoading(true);
        setBookingError("");

        const response = await axios.get(
          `${API_BASE_URL}/bookings/user/${userId}`
        );

        if (!mounted) {
          return;
        }

        if (Array.isArray(response.data)) {
          setBookings(response.data);
        } else {
          setBookings([]);
          setBookingError(
            "Invalid booking data received from server."
          );
        }
      } catch (error) {
        console.error(
          "Error loading user bookings:",
          error
        );

        if (!mounted) {
          return;
        }

        setBookings([]);

        if (error.response) {
          const data = error.response.data;

          if (typeof data === "string") {
            setBookingError(data);
          } else if (data?.message) {
            setBookingError(data.message);
          } else if (data?.error) {
            setBookingError(data.error);
          } else if (error.response.status === 404) {
            setBookingError(
              "No booking information was found."
            );
          } else if (error.response.status === 500) {
            setBookingError(
              "Server error while loading bookings."
            );
          } else {
            setBookingError(
              "Unable to load user bookings."
            );
          }
        } else if (error.request) {
          setBookingError(
            "Unable to connect to the booking server."
          );
        } else {
          setBookingError(
            "Something went wrong while loading bookings."
          );
        }
      } finally {
        if (mounted) {
          setBookingsLoading(false);
        }
      }
    };

    loadUserBookings();

    return () => {
      mounted = false;
    };
  }, [userId]);

  // =========================================================
  // FORMAT BOOKING DATE
  // =========================================================

  const formatBookingDate = (date) => {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // FORMAT EVENT DATE
  // =========================================================

  const formatEventDate = (date) => {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // FORMAT EVENT TIME
  // =========================================================

  const formatEventTime = (date) => {
    if (!date) {
      return "Not available";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =========================================================
  // BOOKING STATUS
  // =========================================================

  const getBookingStatus = (status) => {
    if (!status) {
      return "CONFIRMED";
    }

    return String(status)
      .trim()
      .toUpperCase();
  };

  // =========================================================
  // GET SEAT NUMBERS
  // =========================================================

  const getSeatNumbers = (booking) => {
    if (
      !booking?.seats ||
      !Array.isArray(booking.seats)
    ) {
      return [];
    }

    return booking.seats
      .map((seat) => {
        if (typeof seat === "string") {
          return seat;
        }

        return (
          seat?.seatNumber ||
          seat?.number ||
          seat?.name ||
          null
        );
      })
      .filter(Boolean);
  };

  // =========================================================
  // TOTAL AMOUNT
  // =========================================================

  const getTotalAmount = (booking) => {
    const amount = Number(
      booking?.totalAmount ?? 0
    );

    if (!Number.isFinite(amount)) {
      return "0.00";
    }

    return amount.toFixed(2);
  };

  // =========================================================
  // EVENT NAME
  // =========================================================

  const getEventName = (booking) => {
    return (
      booking?.event?.name ||
      booking?.eventName ||
      "Event"
    );
  };

  // =========================================================
  // EVENT VENUE
  // =========================================================

  const getVenue = (booking) => {
    return (
      booking?.event?.venue ||
      booking?.venue ||
      "Venue not available"
    );
  };

  // =========================================================
  // USER INFORMATION
  // =========================================================

  const userName =
    user?.name || "User";

  const initial = userName
    .charAt(0)
    .toUpperCase();

  // =========================================================
  // LOADING USER
  // =========================================================

  if (loading) {
    return (
      <div className="profile-loading-page">

        <div className="profile-loading-spinner"></div>

        <h2>
          Loading Your Profile...
        </h2>

        <p>
          Please wait while your profile is being loaded.
        </p>

      </div>
    );
  }

  // =========================================================
  // USER ERROR
  // =========================================================

  if (error) {
    return (
      <div className="profile-message-page">

        <div className="profile-message-card">

          <div className="profile-message-icon">
            !
          </div>

          <h2>
            Unable to Load Profile
          </h2>

          <p>
            {error}
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // USER NOT FOUND
  // =========================================================

  if (!user) {
    return (
      <div className="profile-message-page">

        <div className="profile-message-card">

          <div className="profile-message-icon">
            ?
          </div>

          <h2>
            User Not Found
          </h2>

          <p>
            The requested user profile does not exist.
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="user-profile-page">

      <div className="user-profile-container">

        {/* =====================================================
            PROFILE HEADER
        ===================================================== */}

        <section className="profile-hero">

          <div className="profile-avatar-large">
            {initial}
          </div>

          <div className="profile-hero-info">

            <span className="profile-overline">
              MY PROFILE
            </span>

            <h1>
              {userName}
            </h1>

            <p>
              Your TicketBook account
            </p>

            <span className="profile-user-id">
              User ID #{user.id}
            </span>

          </div>

        </section>


        {/* =====================================================
            PERSONAL INFORMATION
        ===================================================== */}

        <section className="profile-information-section">

          <div className="profile-section-heading">

            <div>

              <span className="profile-section-label">
                ACCOUNT
              </span>

              <h2>
                Personal Information
              </h2>

              <p>
                Your basic account information.
              </p>

            </div>

          </div>


          <div className="profile-information-grid">

            {/* NAME */}

            <div className="profile-information-card">

              <div className="profile-information-icon">
                👤
              </div>

              <div>

                <span>
                  Name
                </span>

                <strong>
                  {user.name || "Not available"}
                </strong>

              </div>

            </div>


            {/* EMAIL */}

            <div className="profile-information-card">

              <div className="profile-information-icon">
                📧
              </div>

              <div>

                <span>
                  Email Address
                </span>

                <strong>
                  {user.email || "Not available"}
                </strong>

              </div>

            </div>


            {/* PHONE */}

            <div className="profile-information-card">

              <div className="profile-information-icon">
                📱
              </div>

              <div>

                <span>
                  Phone Number
                </span>

                <strong>
                  {user.phone || "Not available"}
                </strong>

              </div>

            </div>


            {/* BOOKINGS */}

            <div className="profile-information-card">

              <div className="profile-information-icon">
                🎟️
              </div>

              <div>

                <span>
                  Total Bookings
                </span>

                <strong>
                  {bookingsLoading
                    ? "..."
                    : bookings.length}
                </strong>

              </div>

            </div>

          </div>

        </section>


        {/* =====================================================
            BOOKING HISTORY
        ===================================================== */}

        <section className="profile-booking-section">

          <div className="profile-booking-heading">

            <div>

              <span className="profile-section-label">
                ACTIVITY
              </span>

              <h2>
                My Booking History
              </h2>

              <p>
                View all tickets you have booked.
              </p>

            </div>

            <div className="profile-booking-count">

              {bookingsLoading
                ? "Loading..."
                : `${bookings.length} ${
                    bookings.length === 1
                      ? "Booking"
                      : "Bookings"
                  }`}

            </div>

          </div>


          {/* ===================================================
              BOOKING LOADING
          =================================================== */}

          {bookingsLoading && (
            <div className="profile-booking-loading">

              <div className="profile-small-spinner"></div>

              <p>
                Loading your booking history...
              </p>

            </div>
          )}


          {/* ===================================================
              BOOKING ERROR
          =================================================== */}

          {!bookingsLoading &&
            bookingError && (

              <div className="profile-booking-error">

                <div className="profile-error-icon">
                  !
                </div>

                <div>

                  <strong>
                    Unable to load bookings
                  </strong>

                  <p>
                    {bookingError}
                  </p>

                </div>

              </div>

            )}


          {/* ===================================================
              NO BOOKINGS
          =================================================== */}

          {!bookingsLoading &&
            !bookingError &&
            bookings.length === 0 && (

              <div className="profile-no-bookings">

                <div className="profile-no-bookings-icon">
                  🎟️
                </div>

                <h3>
                  No Bookings Yet
                </h3>

                <p>
                  You have not booked any tickets yet.
                </p>

              </div>

            )}


          {/* ===================================================
              BOOKINGS
          =================================================== */}

          {!bookingsLoading &&
            !bookingError &&
            bookings.length > 0 && (

              <div className="profile-bookings-list">

                {bookings.map((booking) => {

                  const status =
                    getBookingStatus(
                      booking.status
                    );

                  const statusClass =
                    status
                      .toLowerCase()
                      .replace(/\s+/g, "-");

                  const seats =
                    getSeatNumbers(booking);

                  const eventDate =
                    booking?.event?.date ||
                    booking?.eventDate ||
                    null;

                  return (
                    <article
                      className="profile-booking-card"
                      key={booking.id}
                    >

                      {/* =======================================
                          BOOKING MAIN
                      ======================================= */}

                      <div className="profile-booking-main">

                        <div className="profile-booking-icon">
                          🎟️
                        </div>

                        <div className="profile-booking-info">

                          <div className="profile-booking-title-row">

                            <h3>
                              {getEventName(booking)}
                            </h3>

                            <span
                              className={`profile-status ${statusClass}`}
                            >
                              {status}
                            </span>

                          </div>


                          <p className="profile-booking-id">
                            Booking #{booking.id}
                          </p>


                          <div className="profile-event-details">

                            {/* EVENT DATE */}

                            <div className="profile-event-detail">

                              <span className="detail-icon">
                                📅
                              </span>

                              <div>

                                <small>
                                  Event Date
                                </small>

                                <strong>
                                  {formatEventDate(
                                    eventDate
                                  )}
                                </strong>

                              </div>

                            </div>


                            {/* EVENT TIME */}

                            <div className="profile-event-detail">

                              <span className="detail-icon">
                                🕐
                              </span>

                              <div>

                                <small>
                                  Event Time
                                </small>

                                <strong>
                                  {formatEventTime(
                                    eventDate
                                  )}
                                </strong>

                              </div>

                            </div>


                            {/* VENUE */}

                            <div className="profile-event-detail">

                              <span className="detail-icon">
                                📍
                              </span>

                              <div>

                                <small>
                                  Venue
                                </small>

                                <strong>
                                  {getVenue(booking)}
                                </strong>

                              </div>

                            </div>

                          </div>


                          {/* SEATS */}

                          <div className="profile-seats-row">

                            <span>
                              Selected Seats
                            </span>

                            <div className="profile-seat-list">

                              {seats.length > 0 ? (

                                seats.map(
                                  (seat, index) => (

                                    <span
                                      className="profile-seat"
                                      key={`${booking.id}-${seat}-${index}`}
                                    >
                                      {seat}
                                    </span>

                                  )
                                )

                              ) : (

                                <span className="profile-no-seat">
                                  No seats available
                                </span>

                              )}

                            </div>

                          </div>

                        </div>

                      </div>


                      {/* =======================================
                          BOOKING SUMMARY
                      ======================================= */}

                      <div className="profile-booking-summary">

                        <div className="profile-summary-item">

                          <span>
                            Booked On
                          </span>

                          <strong>
                            {formatBookingDate(
                              booking.bookingDate
                            )}
                          </strong>

                        </div>


                        <div className="profile-summary-divider"></div>


                        <div className="profile-summary-item profile-total">

                          <span>
                            Total Amount
                          </span>

                          <strong>
                            ₹{getTotalAmount(booking)}
                          </strong>

                        </div>

                      </div>

                    </article>
                  );
                })}

              </div>

            )}

        </section>

      </div>

    </div>
  );
}

export default UserProfile;