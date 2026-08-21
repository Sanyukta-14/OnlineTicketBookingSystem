import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Booking() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // =========================================================
  // GET DATA FROM URL
  // =========================================================

  const eventId = searchParams.get("eventId");
  const seatsParam = searchParams.get("seats") || "";

  // =========================================================
  // STATES
  // =========================================================

  const [event, setEvent] = useState(null);
  const [seats, setSeats] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // GET SEAT IDS FROM URL
  // =========================================================

  const getSeatIds = () => {
    if (!seatsParam) {
      return [];
    }

    return seatsParam
      .split(",")
      .map((id) => Number(id.trim()))
      .filter(
        (id) =>
          Number.isInteger(id) &&
          id > 0
      );
  };

  // =========================================================
  // LOAD LOGGED-IN USER
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
        "Invalid logged-in user:",
        error
      );

      localStorage.removeItem(
        "loggedInUser"
      );

      return null;
    }
  };

  // =========================================================
  // LOAD BOOKING DATA
  // =========================================================

  useEffect(() => {
    let isMounted = true;

    const loadBookingData = async () => {
      try {
        // -----------------------------------------------------
        // CHECK LOGIN
        // -----------------------------------------------------

        const user =
          getLoggedInUser();

        if (!user?.id) {
          navigate("/login");
          return;
        }

        if (isMounted) {
          setLoggedInUser(user);
        }

        // -----------------------------------------------------
        // CHECK EVENT
        // -----------------------------------------------------

        if (!eventId) {
          if (isMounted) {
            setError(
              "Event information is missing."
            );
          }

          return;
        }

        // -----------------------------------------------------
        // GET EVENT
        // -----------------------------------------------------

        const eventResponse =
          await axios.get(
            `http://localhost:8080/events/${eventId}`
          );

        // -----------------------------------------------------
        // GET SEAT IDS
        // -----------------------------------------------------

        const seatIds =
          getSeatIds();

        // -----------------------------------------------------
        // CHECK SEATS
        // -----------------------------------------------------

        if (seatIds.length === 0) {
          if (isMounted) {
            setEvent(
              eventResponse.data
            );

            setSeats([]);

            setError(
              "No seats have been selected."
            );
          }

          return;
        }

        // -----------------------------------------------------
        // GET SELECTED SEATS
        // -----------------------------------------------------

        const seatRequests =
          seatIds.map((seatId) =>
            axios.get(
              `http://localhost:8080/seats/${seatId}`
            )
          );

        const seatResponses =
          await Promise.all(
            seatRequests
          );

        const loadedSeats =
          seatResponses.map(
            (response) =>
              response.data
          );

        // -----------------------------------------------------
        // UPDATE STATE
        // -----------------------------------------------------

        if (isMounted) {
          setEvent(
            eventResponse.data
          );

          setSeats(
            loadedSeats
          );
        }

      } catch (err) {
        console.error(
          "Error loading booking data:",
          err
        );

        if (isMounted) {
          let errorMessage =
            "Unable to load booking details.";

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

          } else if (err.request) {

            errorMessage =
              "Unable to connect to the backend server. Please make sure Spring Boot is running.";
          }

          setError(
            errorMessage
          );
        }

      } finally {

        if (isMounted) {
          setLoading(false);
        }

      }
    };

    loadBookingData();

    return () => {
      isMounted = false;
    };

  }, [eventId, seatsParam, navigate]);

  // =========================================================
  // PRICE CALCULATION
  // =========================================================

  const pricePerSeat =
    Number(
      event?.ticketPrice || 0
    );

  const totalAmount =
    seats.length *
    pricePerSeat;

  // =========================================================
  // CONFIRM BOOKING
  // =========================================================

  const handleConfirmBooking =
    async () => {

      setError("");
      setMessage("");

      // -----------------------------------------------------
      // CHECK USER
      // -----------------------------------------------------

      if (!loggedInUser?.id) {

        setError(
          "Please login before booking."
        );

        navigate("/login");

        return;
      }

      // -----------------------------------------------------
      // CHECK EVENT
      // -----------------------------------------------------

      if (!eventId) {

        setError(
          "Event information is missing."
        );

        return;
      }

      // -----------------------------------------------------
      // CHECK SEATS
      // -----------------------------------------------------

      if (seats.length === 0) {

        setError(
          "Please select at least one seat."
        );

        return;
      }

      // -----------------------------------------------------
      // GET SEAT IDS
      // -----------------------------------------------------

      const seatIds =
        getSeatIds();

      if (seatIds.length === 0) {

        setError(
          "No valid seats selected."
        );

        return;
      }

      // -----------------------------------------------------
      // START BOOKING
      // -----------------------------------------------------

      try {

        setBooking(true);

        // ---------------------------------------------------
        // CREATE BOOKING
        // ---------------------------------------------------

        const response =
          await axios.post(
            "http://localhost:8080/bookings",
            seatIds,
            {
              params: {
                userId:
                  Number(
                    loggedInUser.id
                  ),

                eventId:
                  Number(eventId),
              },

              headers: {
                "Content-Type":
                  "application/json",
              },
            }
          );

        console.log(
          "Booking created successfully:",
          response.data
        );

        // ---------------------------------------------------
        // SUCCESS
        // ---------------------------------------------------

        setMessage(
          "Booking confirmed successfully! 🎉"
        );

        // ---------------------------------------------------
        // REDIRECT
        // ---------------------------------------------------

        setTimeout(() => {
          navigate("/bookings");
        }, 1500);

      } catch (err) {

        console.error(
          "Booking error:",
          err
        );

        let errorMessage =
          "Booking failed. Please try again.";

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

        } else if (err.request) {

          errorMessage =
            "Unable to connect to the backend server. Please make sure Spring Boot is running.";
        }

        setError(
          errorMessage
        );

      } finally {

        setBooking(false);

      }
    };

  // =========================================================
  // GO BACK
  // =========================================================

  const handleBack = () => {

    if (eventId) {

      navigate(
        `/events/${eventId}/seats`
      );

    } else {

      navigate("/events");

    }
  };

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {

    return (

      <div className="page-message">

        <h2>
          Loading booking details...
        </h2>

      </div>

    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="booking-page">

      <div className="booking-card">

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          type="button"
          className="back-button"
          onClick={handleBack}
          disabled={booking}
        >
          ← Back
        </button>


        {/* =================================================
            TITLE
        ================================================= */}

        <h1>
          Confirm Your Booking
        </h1>


        {/* =================================================
            ERROR
        ================================================= */}

        {error && (

          <div className="booking-error">
            {error}
          </div>

        )}


        {/* =================================================
            SUCCESS
        ================================================= */}

        {message && (

          <div className="booking-success">
            {message}
          </div>

        )}


        {/* =================================================
            EVENT DETAILS
        ================================================= */}

        {event && (

          <div className="booking-event">

            <h2>
              {event.name ||
                "Event"}
            </h2>

            {event.date && (

              <p>
                📅 {event.date}
              </p>

            )}

            {event.time && (

              <p>
                🕐 {event.time}
              </p>

            )}

            {event.venue && (

              <p>
                📍 {event.venue}
              </p>

            )}

            {event.category && (

              <p>
                🎭 {event.category}
              </p>

            )}

            <p>
              💰 Ticket Price: ₹
              {pricePerSeat.toFixed(2)}
            </p>

          </div>

        )}


        {/* =================================================
            LOGGED-IN USER
        ================================================= */}

        {loggedInUser && (

          <div className="booking-section">

            <h3>
              Booking For
            </h3>


            <div className="logged-in-user">

              <p>
                👤{" "}
                <strong>
                  {loggedInUser.name ||
                    "User"}
                </strong>
              </p>


              {loggedInUser.email && (

                <p>
                  📧{" "}
                  {loggedInUser.email}
                </p>

              )}


              {loggedInUser.phone && (

                <p>
                  📱{" "}
                  {loggedInUser.phone}
                </p>

              )}

            </div>

          </div>

        )}


        {/* =================================================
            SELECTED SEATS
        ================================================= */}

        <div className="booking-section">

          <h3>
            Selected Seats
          </h3>


          {seats.length > 0 ? (

            <div className="selected-seat-list">

              {seats.map(
                (seat) => (

                  <span
                    key={seat.id}
                    className="selected-seat-item"
                  >
                    {seat.seatNumber ||
                      `Seat ${seat.id}`}
                  </span>

                )
              )}

            </div>

          ) : (

            <p>
              No seats selected.
            </p>

          )}

        </div>


        {/* =================================================
            BOOKING SUMMARY
        ================================================= */}

        <div className="booking-total">

          <p>
            Number of Seats:{" "}

            <strong>
              {seats.length}
            </strong>

          </p>


          <p>
            Price per Seat:{" "}

            <strong>
              ₹
              {pricePerSeat.toFixed(2)}
            </strong>

          </p>


          <h2>
            Total Amount:{" "}

            ₹
            {totalAmount.toFixed(2)}

          </h2>

        </div>


        {/* =================================================
            CONFIRM BUTTON
        ================================================= */}

        <button
          type="button"
          className="confirm-booking-button"
          onClick={
            handleConfirmBooking
          }
          disabled={
            booking ||
            !loggedInUser?.id ||
            seats.length === 0 ||
            !!message
          }
        >

          {booking
            ? "Confirming Booking..."
            : "Confirm Booking"}

        </button>

      </div>

    </div>

  );
}

export default Booking;