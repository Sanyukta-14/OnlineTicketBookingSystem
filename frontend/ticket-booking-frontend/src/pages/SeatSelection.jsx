import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function SeatSelection() {
  const { eventId } = useParams();
  const navigate = useNavigate();

  // =========================================================
  // STATES
  // =========================================================

  const [seats, setSeats] = useState([]);
  const [event, setEvent] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD EVENT AND SEATS
  // =========================================================

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        if (!eventId) {
          setError("Event information is missing.");
          setLoading(false);
          return;
        }

        // -----------------------------------------------------
        // GET EVENT
        // -----------------------------------------------------

        const eventResponse = await axios.get(
          `http://localhost:8080/events/${eventId}`
        );

        // -----------------------------------------------------
        // GET SEATS
        // -----------------------------------------------------

        const seatResponse = await axios.get(
          `http://localhost:8080/seats/event/${eventId}`
        );

        if (!isMounted) {
          return;
        }

        setEvent(eventResponse.data);

        const loadedSeats = Array.isArray(seatResponse.data)
          ? seatResponse.data
          : [];

        setSeats(loadedSeats);
        setSelectedSeats([]);

      } catch (err) {
        console.error(
          "Error loading event and seats:",
          err
        );

        if (!isMounted) {
          return;
        }

        let errorMessage =
          "Unable to load event and seats.";

        if (err.response?.data) {
          if (typeof err.response.data === "string") {
            errorMessage = err.response.data;
          } else if (err.response.data?.message) {
            errorMessage = err.response.data.message;
          } else if (err.response.data?.error) {
            errorMessage = err.response.data.error;
          }
        } else if (err.request) {
          errorMessage =
            "Unable to connect to the backend server. Please make sure Spring Boot is running.";
        }

        setError(errorMessage);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [eventId]);

  // =========================================================
  // CHECK IF SEAT IS BOOKED
  // =========================================================

  const isSeatBooked = (seat) => {
    const status = String(seat?.status || "")
      .trim()
      .toUpperCase();

    return status === "BOOKED";
  };

  // =========================================================
  // GET SEAT NUMBER
  // =========================================================

  const getSeatNumber = (seat) => {
    return (
      seat?.seatNumber ||
      `Seat ${seat?.id || ""}`
    );
  };

  // =========================================================
  // HANDLE SEAT CLICK
  // =========================================================

  const handleSeatClick = (seat) => {
    if (isSeatBooked(seat)) {
      return;
    }

    if (!seat?.id) {
      return;
    }

    setSelectedSeats((previousSeats) => {
      const alreadySelected =
        previousSeats.includes(seat.id);

      if (alreadySelected) {
        return previousSeats.filter(
          (id) => id !== seat.id
        );
      }

      return [
        ...previousSeats,
        seat.id,
      ];
    });
  };

  // =========================================================
  // CONTINUE TO BOOKING
  // =========================================================

  const continueBooking = () => {
    const savedUser =
      localStorage.getItem("loggedInUser");

    if (!savedUser) {
      alert(
        "Please login before booking tickets."
      );

      navigate("/login");
      return;
    }

    if (selectedSeats.length === 0) {
      alert(
        "Please select at least one seat."
      );

      return;
    }

    const unavailableSeat = seats.find(
      (seat) =>
        selectedSeats.includes(seat.id) &&
        isSeatBooked(seat)
    );

    if (unavailableSeat) {
      alert(
        `Seat ${
          unavailableSeat.seatNumber ||
          unavailableSeat.id
        } is already booked. Please select another seat.`
      );

      setSelectedSeats((previousSeats) =>
        previousSeats.filter(
          (id) => id !== unavailableSeat.id
        )
      );

      return;
    }

    const seatIds =
      selectedSeats.join(",");

    navigate(
      `/booking?eventId=${eventId}&seats=${seatIds}`
    );
  };

  // =========================================================
  // GET SEAT CLASS
  // =========================================================

  const getSeatClass = (seat) => {
    if (isSeatBooked(seat)) {
      return "seat booked";
    }

    if (selectedSeats.includes(seat.id)) {
      return "seat selected";
    }

    return "seat available";
  };

  // =========================================================
  // PRICE CALCULATION
  // =========================================================

  const pricePerSeat = Number(
    event?.ticketPrice || 0
  );

  const totalAmount =
    selectedSeats.length * pricePerSeat;

  // =========================================================
  // SELECTED SEAT NAMES
  // =========================================================

  const selectedSeatNames = seats
    .filter((seat) =>
      selectedSeats.includes(seat.id)
    )
    .map((seat) =>
      getSeatNumber(seat)
    );

  // =========================================================
  // SORT SEATS
  // =========================================================

  const getRowSeats = (row) => {
    return seats
      .filter((seat) => {
        const seatNumber = String(
          seat?.seatNumber || ""
        );

        return seatNumber
          .toUpperCase()
          .startsWith(row);
      })
      .sort((a, b) => {
        const numberA =
          parseInt(
            String(a?.seatNumber || "").substring(1),
            10
          ) || 0;

        const numberB =
          parseInt(
            String(b?.seatNumber || "").substring(1),
            10
          ) || 0;

        return numberA - numberB;
      });
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="seat-page-message">
        <div className="seat-loading-card">
          <div className="seat-loading-spinner"></div>

          <h2>
            Loading seats...
          </h2>

          <p>
            Please wait while we prepare the seating layout.
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <div className="seat-page-message">
        <div className="seat-error-card">

          <div className="seat-error-icon">
            !
          </div>

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="seat-retry-button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="seat-selection-page">

      {/* =====================================================
          BACK BUTTON
      ===================================================== */}

      <div className="seat-page-container">

        <button
          type="button"
          className="seat-back-button"
          onClick={() =>
            navigate("/events")
          }
        >
          <span>←</span>
          Back to Events
        </button>

        {/* ===================================================
            EVENT HEADER
        =================================================== */}

        <section className="seat-event-card">

          <div className="seat-event-main">

            <div className="seat-event-icon">
              🎬
            </div>

            <div className="seat-event-title">

              <span className="seat-event-category">
                {event?.category || "EVENT"}
              </span>

              <h1>
                {event?.name || "Event"}
              </h1>

            </div>

          </div>

          <div className="seat-event-details">

            <div className="seat-event-detail">

              <span className="seat-detail-icon">
                📅
              </span>

              <div>
                <small>
                  DATE
                </small>

                <strong>
                  {event?.date ||
                    "Date not available"}
                </strong>
              </div>

            </div>


            <div className="seat-event-detail">

              <span className="seat-detail-icon">
                🕐
              </span>

              <div>
                <small>
                  TIME
                </small>

                <strong>
                  {event?.time ||
                    "Time not available"}
                </strong>
              </div>

            </div>


            <div className="seat-event-detail">

              <span className="seat-detail-icon">
                📍
              </span>

              <div>
                <small>
                  VENUE
                </small>

                <strong>
                  {event?.venue ||
                    "Venue not available"}
                </strong>
              </div>

            </div>


            <div className="seat-event-detail">

              <span className="seat-detail-icon">
                💰
              </span>

              <div>
                <small>
                  PRICE
                </small>

                <strong>
                  ₹{pricePerSeat.toFixed(2)}
                </strong>
              </div>

            </div>

          </div>

        </section>


        {/* ===================================================
            MAIN BOOKING AREA
        =================================================== */}

        <section className="seat-booking-area">

          {/* =================================================
              SEAT MAP
          ================================================= */}

          <div className="seat-map-card">

            <div className="seat-map-header">

              <div>
                <span className="seat-section-label">
                  SELECT YOUR SEATS
                </span>

                <h2>
                  Choose your perfect spot
                </h2>
              </div>

              <span className="seat-count">
                {selectedSeats.length} selected
              </span>

            </div>


            {/* =================================================
                SCREEN
            ================================================= */}

            <div className="screen-wrapper">

              <div className="screen-glow"></div>

              <div className="screen">
                SCREEN
              </div>

              <span className="screen-label">
                All eyes on the screen
              </span>

            </div>


            {/* =================================================
                SEAT LAYOUT
            ================================================= */}

            <div className="seat-layout">

              {["A", "B", "C", "D", "E"].map(
                (row) => {

                  const rowSeats =
                    getRowSeats(row);

                  return (
                    <div
                      className="seat-row"
                      key={row}
                    >

                      <div className="row-label">
                        {row}
                      </div>

                      <div className="seat-row-buttons">

                        {rowSeats.map(
                          (seat) => {

                            const booked =
                              isSeatBooked(seat);

                            const selected =
                              selectedSeats.includes(
                                seat.id
                              );

                            return (
                              <button
                                type="button"
                                key={seat.id}
                                className={getSeatClass(
                                  seat
                                )}
                                onClick={() =>
                                  handleSeatClick(
                                    seat
                                  )
                                }
                                disabled={booked}
                                title={
                                  booked
                                    ? "Seat already booked"
                                    : selected
                                    ? "Click to deselect"
                                    : "Click to select"
                                }
                              >
                                {getSeatNumber(
                                  seat
                                )}
                              </button>
                            );
                          }
                        )}

                      </div>

                    </div>
                  );
                }
              )}

            </div>


            {/* =================================================
                LEGEND
            ================================================= */}

            <div className="seat-legend">

              <div className="legend-item">
                <span className="legend-box available"></span>
                <span>Available</span>
              </div>

              <div className="legend-item">
                <span className="legend-box selected"></span>
                <span>Selected</span>
              </div>

              <div className="legend-item">
                <span className="legend-box booked"></span>
                <span>Booked</span>
              </div>

            </div>

          </div>


          {/* =================================================
              BOOKING SUMMARY
          ================================================= */}

          <aside className="seat-summary-card">

            <div className="summary-header">

              <span>
                YOUR BOOKING
              </span>

              <h2>
                Booking Summary
              </h2>

            </div>


            {/* Selected Seats */}

            <div className="summary-selected">

              <div className="summary-title-row">

                <strong>
                  Selected Seats
                </strong>

                <span>
                  {selectedSeats.length}
                </span>

              </div>


              {selectedSeatNames.length > 0 ? (

                <div className="selected-seat-list">

                  {selectedSeatNames.map(
                    (seatName) => (
                      <span
                        key={seatName}
                        className="selected-seat-item"
                      >
                        {seatName}
                      </span>
                    )
                  )}

                </div>

              ) : (

                <div className="no-selected-seats">
                  Select seats from the layout
                </div>

              )}

            </div>


            {/* Price */}

            <div className="summary-price-details">

              <div className="summary-price-row">

                <span>
                  Seats
                </span>

                <strong>
                  {selectedSeats.length}
                </strong>

              </div>


              <div className="summary-price-row">

                <span>
                  Price per seat
                </span>

                <strong>
                  ₹{pricePerSeat.toFixed(2)}
                </strong>

              </div>

            </div>


            {/* Total */}

            <div className="summary-total">

              <span>
                Total Amount
              </span>

              <strong>
                ₹{totalAmount.toFixed(2)}
              </strong>

            </div>


            {/* Continue */}

            <button
              type="button"
              className="continue-booking-button"
              onClick={continueBooking}
              disabled={
                selectedSeats.length === 0
              }
            >
              Continue Booking
              <span>→</span>
            </button>


            <p className="summary-note">
              🔒 Your seat selection is protected
              until you complete the booking.
            </p>

          </aside>

        </section>

      </div>

    </div>
  );
}

export default SeatSelection;
