import { useState } from "react";
import { createBooking } from "../services/bookingService";

function UserBookingForm({
  event,
  user,
  onClose,
  onBookingSuccess,
}) {

  const [tickets, setTickets] = useState(1);
  const [loading, setLoading] = useState(false);

  const totalAmount = tickets * event.ticketPrice;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (tickets < 1) {
      alert("Please select at least 1 ticket.");
      return;
    }

    if (tickets > event.availableSeats) {
      alert(
        `Only ${event.availableSeats} ticket(s) are available.`
      );
      return;
    }

    const booking = {
      userId: user.id,
      eventId: event.id,
      numberOfTickets: tickets,
    };

    try {

      setLoading(true);

      await createBooking(booking);

      alert("🎉 Ticket Booked Successfully!");

      onBookingSuccess();
      onClose();

    } catch (error) {

      console.error("Booking Error:", error);

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Booking Failed!");
      }

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="booking-popup">

      <div className="booking-card">

        <h2>🎫 Book Ticket</h2>

        <hr />

        <p>
          <strong>Event:</strong> {event.eventName}
        </p>

        <p>
          <strong>Venue:</strong> {event.venue}
        </p>

        <p>
          <strong>Ticket Price:</strong> ₹{event.ticketPrice}
        </p>

        <p>
          <strong>Available Seats:</strong>{" "}
          {event.availableSeats}
        </p>

        <form onSubmit={handleSubmit}>

          <label>Number of Tickets</label>

          <input
            type="number"
            min="1"
            max={event.availableSeats}
            value={tickets}
            onChange={(e) =>
              setTickets(Number(e.target.value))
            }
            required
          />

          <h3>
            Total Amount : ₹{totalAmount}
          </h3>

          <div className="booking-buttons">

            <button
              type="submit"
              disabled={
                loading ||
                event.availableSeats === 0
              }
            >
              {loading
                ? "Booking..."
                : "Confirm Booking"}
            </button>

            <button
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>

          </div>

        </form>

      </div>

    </div>

  );
}

export default UserBookingForm;