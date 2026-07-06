import { useEffect, useState } from "react";
import {
  getAllEvents,
  deleteEvent,
} from "../services/eventService";

import EventForm from "../components/EventForm";

import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChair,
  FaSearch,
  FaDownload,
} from "react-icons/fa";

import "../styles/events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);

      const data = await getAllEvents();

      setEvents(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load events.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await deleteEvent(id);

      alert("Event Deleted Successfully!");

      if (editingEvent?.id === id) {
        setEditingEvent(null);
      }

      fetchEvents();
    } catch (error) {
      console.error(error);
      alert("Unable to delete event.");
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const filteredEvents = events.filter((event) =>
    event.eventName
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const exportCSV = () => {
    const rows = [
      [
        "ID",
        "Event",
        "Location",
        "Date",
        "Price",
        "Seats",
      ],
    ];

    filteredEvents.forEach((event) => {
      rows.push([
        event.id,
        event.eventName,
        event.location,
        event.eventDate,
        event.ticketPrice,
        event.availableSeats,
      ]);
    });

    const csvContent = rows
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "Events.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="event-container">

      <div className="page-header">

        <div>

          <h2>🎉 Event Management</h2>

          <p>Create, update and manage all events.</p>

        </div>

      </div>

      <div className="summary-box">

        <div className="summary-card">

          <FaCalendarAlt className="summary-icon blue" />

          <div>

            <h4>Total Events</h4>

            <h2>{events.length}</h2>

          </div>

        </div>

        <div className="summary-card">

          <FaMapMarkerAlt className="summary-icon green" />

          <div>

            <h4>Locations</h4>

            <h2>
              {new Set(events.map((e) => e.location)).size}
            </h2>

          </div>

        </div>

        <div className="summary-card">

          <FaChair className="summary-icon orange" />

          <div>

            <h4>Total Seats</h4>

            <h2>
              {events.reduce(
                (sum, e) => sum + e.availableSeats,
                0
              )}
            </h2>

          </div>

        </div>

      </div>

      <EventForm
        editingEvent={editingEvent}
        onCancelEdit={() => setEditingEvent(null)}
        onEventCreated={() => {
          fetchEvents();
          setEditingEvent(null);
        }}
      />

      <hr />

      <div className="toolbar">

        <div className="search-box">

          <FaSearch />

          <input
            type="text"
            placeholder="Search Event..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

        </div>

        <button
          className="export-btn"
          onClick={exportCSV}
        >
          <FaDownload />
          Export CSV
        </button>

      </div>

      {loading ? (

        <div className="loading">
          Loading Events...
        </div>

      ) : (

        <table>

          <thead>

            <tr>

              <th>ID</th>
              <th>Event</th>
              <th>Location</th>
              <th>Date</th>
              <th>Price</th>
              <th>Seats</th>
              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredEvents.length > 0 ? (

              filteredEvents.map((event) => (

                <tr key={event.id}>

                  <td>{event.id}</td>

                  <td>{event.eventName}</td>

                  <td>{event.location}</td>

                  <td>{event.eventDate}</td>

                  <td>₹{event.ticketPrice}</td>

                  <td>{event.availableSeats}</td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(event)}
                    >
                      ✏ Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(event.id)}
                    >
                      🗑 Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td colSpan="7">
                  No Events Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      )}

    </div>
  );
}

export default Events;