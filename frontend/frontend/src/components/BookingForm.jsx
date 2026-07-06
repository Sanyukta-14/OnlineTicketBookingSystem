import { useState, useEffect } from "react";
import {
  createBooking,
  updateBooking,
} from "../services/bookingService";
import { getAllUsers } from "../services/userService";
import { getAllEvents } from "../services/eventService";

function BookingForm({
  onBookingCreated,
  editingBooking,
  onCancelEdit,
}) {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [ticketPrice, setTicketPrice] = useState(0);

  const [booking, setBooking] = useState({
    userId: "",
    eventId: "",
    numberOfTickets: 1,
    totalAmount: 0,
    status: "CONFIRMED",
  });

  useEffect(() => {
    fetchUsers();
    fetchEvents();
  }, []);

  useEffect(() => {
    if (editingBooking) {
      setBooking({
        userId: editingBooking.userId || "",
        eventId: editingBooking.eventId || "",
        numberOfTickets:
          editingBooking.numberOfTickets || 1,
        totalAmount:
          editingBooking.totalAmount || 0,
        status:
          editingBooking.status || "CONFIRMED",
      });

      const selectedEvent = events.find(
        (event) =>
          event.id === Number(editingBooking.eventId)
      );

      if (selectedEvent) {
        setTicketPrice(selectedEvent.ticketPrice);
      }
    } else {
      setBooking({
        userId: "",
        eventId: "",
        numberOfTickets: 1,
        totalAmount: 0,
        status: "CONFIRMED",
      });

      setTicketPrice(0);
    }
  }, [editingBooking, events]);

  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedBooking = {
      ...booking,
      [name]: value,
    };

    if (name === "eventId") {
      const selectedEvent = events.find(
        (event) => event.id === Number(value)
      );

      if (selectedEvent) {
        setTicketPrice(selectedEvent.ticketPrice);

        updatedBooking.totalAmount =
          selectedEvent.ticketPrice *
          Number(updatedBooking.numberOfTickets);
      } else {
        setTicketPrice(0);
        updatedBooking.totalAmount = 0;
      }
    }

    if (name === "numberOfTickets") {
      updatedBooking.totalAmount =
        ticketPrice * Number(value);
    }

    setBooking(updatedBooking);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingBooking) {
        await updateBooking(
          editingBooking.id,
          booking
        );
        alert("Booking Updated Successfully!");
      } else {
        await createBooking(booking);
        alert("Booking Created Successfully!");
      }

      setBooking({
        userId: "",
        eventId: "",
        numberOfTickets: 1,
        totalAmount: 0,
        status: "CONFIRMED",
      });

      setTicketPrice(0);

      onBookingCreated();
    } catch (error) {
      console.error(
        "Error saving booking:",
        error
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>
        {editingBooking
          ? "Update Booking"
          : "Create Booking"}
      </h3>

      <div>
        <label>Select User</label>
        <br />
        <select
          name="userId"
          value={booking.userId}
          onChange={handleChange}
          required
        >
          <option value="">
            -- Select User --
          </option>

          {users.map((user) => (
            <option
              key={user.id}
              value={user.id}
            >
              {user.name}
            </option>
          ))}
        </select>
      </div>

      <br />

      <div>
        <label>Select Event</label>
        <br />
        <select
          name="eventId"
          value={booking.eventId}
          onChange={handleChange}
          required
        >
          <option value="">
            -- Select Event --
          </option>

          {events.map((event) => (
            <option
              key={event.id}
              value={event.id}
            >
              {event.eventName}
            </option>
          ))}
        </select>
      </div>

      <br />

      <div>
        <label>Ticket Price</label>
        <br />
        <input
          type="number"
          value={ticketPrice}
          readOnly
        />
      </div>

      <br />

      <div>
        <label>Number of Tickets</label>
        <br />
        <input
          type="number"
          name="numberOfTickets"
          value={booking.numberOfTickets}
          onChange={handleChange}
          min="1"
          required
        />
      </div>

      <br />

      <div>
        <label>Total Amount</label>
        <br />
        <input
          type="number"
          value={booking.totalAmount}
          readOnly
        />
      </div>

      <br />

      <div>
        <label>Status</label>
        <br />
        <select
          name="status"
          value={booking.status}
          onChange={handleChange}
        >
          <option value="CONFIRMED">
            CONFIRMED
          </option>
          <option value="CANCELLED">
            CANCELLED
          </option>
        </select>
      </div>

      <br />

      <div className="form-buttons">
  <button type="submit" className="save-btn">
    {editingBooking ? "Update Booking" : "Create Booking"}
  </button>

  {editingBooking && (
    <button
      type="button"
      className="cancel-edit-btn"
      onClick={onCancelEdit}
    >
      Cancel
    </button>
  )}
</div>
    </form>
  );
}

export default BookingForm;