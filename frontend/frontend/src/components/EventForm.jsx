import { useState, useEffect } from "react";
import {
  createEvent,
  updateEvent,
} from "../services/eventService";

function EventForm({
  onEventCreated,
  editingEvent,
}) {
  const [event, setEvent] = useState({
    eventName: "",
    location: "",
    ticketPrice: "",
    eventDate: "",
    availableSeats: "",
  });

  useEffect(() => {
    if (editingEvent) {
      setEvent({
        eventName: editingEvent.eventName || "",
        location: editingEvent.location || "",
        ticketPrice: editingEvent.ticketPrice || "",
        eventDate: editingEvent.eventDate || "",
        availableSeats: editingEvent.availableSeats || "",
      });
    } else {
      setEvent({
        eventName: "",
        location: "",
        ticketPrice: "",
        eventDate: "",
        availableSeats: "",
      });
    }
  }, [editingEvent]);

  const handleChange = (e) => {
    setEvent({
      ...event,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingEvent) {
        await updateEvent(
          editingEvent.id,
          event
        );

        alert("Event Updated Successfully!");
      } else {
        await createEvent(event);

        alert("Event Created Successfully!");
      }

      setEvent({
        eventName: "",
        location: "",
        ticketPrice: "",
        eventDate: "",
        availableSeats: "",
      });

      onEventCreated();
    } catch (error) {
      console.error(
        "Error saving event:",
        error
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>
        {editingEvent
          ? "Update Event"
          : "Create Event"}
      </h3>

      <div>
        <label>Event Name</label>
        <br />
        <input
          type="text"
          name="eventName"
          value={event.eventName}
          onChange={handleChange}
          required
        />
      </div>

      <br />

      <div>
        <label>Location</label>
        <br />
        <input
          type="text"
          name="location"
          value={event.location}
          onChange={handleChange}
          required
        />
      </div>

      <br />

      <div>
        <label>Ticket Price</label>
        <br />
        <input
          type="number"
          name="ticketPrice"
          value={event.ticketPrice}
          onChange={handleChange}
          min="0"
          required
        />
      </div>

      <br />

      <div>
        <label>Available Seats</label>
        <br />
        <input
          type="number"
          name="availableSeats"
          value={event.availableSeats}
          onChange={handleChange}
          min="0"
          required
        />
      </div>

      <br />

      <div>
        <label>Event Date</label>
        <br />
        <input
          type="date"
          name="eventDate"
          value={event.eventDate}
          onChange={handleChange}
          required
        />
      </div>

      <br />

      <button type="submit">
        {editingEvent
          ? "Update Event"
          : "Create Event"}
      </button>
    </form>
  );
}

export default EventForm;