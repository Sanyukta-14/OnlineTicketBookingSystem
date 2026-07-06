import { useEffect, useState } from "react";
import { getAllEvents } from "../services/eventService";
import UserBookingForm from "../components/UserBookingForm";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChair,
  FaSearch,
  FaTicketAlt,
  FaClock,
} from "react-icons/fa";

import "../styles/userEvents.css";

function UserEvents() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleBookingSuccess = () => {
    setSelectedEvent(null);
    loadEvents();
  };

  const filteredEvents = events.filter((event) =>
    event.eventName
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  return (
    <div className="user-events-container">

      {/* Hero */}

      <div className="events-hero">

        <div>

          <h1>🎉 Explore Events</h1>

          <p>
            Welcome <strong>{user?.name}</strong>! Browse upcoming events
            and book your tickets in just a few clicks.
          </p>

        </div>

      </div>

      {/* Summary */}

      <div className="events-summary">

        <div className="summary-card">

          <FaCalendarAlt className="summary-icon blue" />

          <div>

            <h4>Total Events</h4>

            <h2>{events.length}</h2>

          </div>

        </div>

        <div className="summary-card">

          <FaChair className="summary-icon green" />

          <div>

            <h4>Total Available Seats</h4>

            <h2>
              {events.reduce(
                (sum, event) => sum + event.availableSeats,
                0
              )}
            </h2>

          </div>

        </div>

      </div>

      {/* Search */}

      <div className="search-box">

        <FaSearch />

        <input
          type="text"
          placeholder="Search Events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      </div>

      {/* Events */}

      <div className="events-grid">

        {filteredEvents.length > 0 ? (

          filteredEvents.map((event) => (

            <div
              key={event.id}
              className="event-card"
            >

              <div className="event-icon">
                <FaCalendarAlt />
              </div>

              <h2>{event.eventName}</h2>

              <p>
                <FaMapMarkerAlt />
                {event.location || event.venue}
              </p>

              <p>
                <FaClock />
                {" "}
                {event.eventDate}
              </p>

              <div className="event-info">

                <span>

                  <FaTicketAlt />

                  ₹{event.ticketPrice}

                </span>

                <span>

                  <FaChair />

                  {event.availableSeats} Seats

                </span>

              </div>

              <div className="seat-status">

                {event.availableSeats > 20 ? (
                  <span className="available">
                    Seats Available
                  </span>
                ) : event.availableSeats > 0 ? (
                  <span className="limited">
                    Few Seats Left
                  </span>
                ) : (
                  <span className="sold">
                    Sold Out
                  </span>
                )}

              </div>

              {event.availableSeats > 0 ? (

                <button
                  className="book-btn"
                  onClick={() =>
                    setSelectedEvent(event)
                  }
                >
                  Book Ticket
                </button>

              ) : (

                <button
                  className="sold-btn"
                  disabled
                >
                  Sold Out
                </button>

              )}

            </div>

          ))

        ) : (

          <div className="empty-events">

            <h2>No Events Found</h2>

            <p>
              Try searching with another event name.
            </p>

          </div>

        )}

      </div>

      {selectedEvent && (

        <UserBookingForm
          event={selectedEvent}
          user={user}
          onClose={() => setSelectedEvent(null)}
          onBookingSuccess={handleBookingSuccess}
        />

      )}

    </div>
  );
}

export default UserEvents;