import { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/AdminEvents.css";

// =========================================================
// API URL
// =========================================================

const API_URL = "http://localhost:8080/events";

// =========================================================
// EMPTY FORM
// =========================================================

const EMPTY_FORM = {
  name: "",
  date: "",
  time: "",
  venue: "",
  ticketPrice: "",
  category: "",
};

// =========================================================
// ADMIN EVENTS
// =========================================================

function AdminEvents() {
  // =========================================================
  // STATE
  // =========================================================

  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(null);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });

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
  // LOAD EVENTS
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const fetchEvents = async () => {
      try {
        const response = await axios.get(API_URL);

        if (cancelled) {
          return;
        }

        const eventData = Array.isArray(response.data)
          ? response.data
          : [];

        setEvents(eventData);
        setError("");
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("Error loading events:", error);

        setError(
          getErrorMessage(
            error,
            "Unable to load events."
          )
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchEvents();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================================================
  // REFRESH EVENTS
  // =========================================================

  const loadEvents = async () => {
    try {
      setRefreshing(true);
      setError("");
      setSuccess("");

      const response = await axios.get(API_URL);

      const eventData = Array.isArray(response.data)
        ? response.data
        : [];

      setEvents(eventData);

      setSuccess(
        "Events refreshed successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error(
        "Error refreshing events:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Unable to refresh events."
        )
      );
    } finally {
      setRefreshing(false);
    }
  };

  // =========================================================
  // HANDLE INPUT
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =========================================================
  // RESET FORM
  // =========================================================

  const resetForm = () => {
    setForm({
      ...EMPTY_FORM,
    });

    setEditingId(null);

    setError("");
    setSuccess("");
  };

  // =========================================================
  // VALIDATE FORM
  // =========================================================

  const validateForm = () => {
    if (!form.name.trim()) {
      setError("Please enter the event name.");
      return false;
    }

    if (!form.category.trim()) {
      setError("Please enter the event category.");
      return false;
    }

    if (!form.date) {
      setError("Please select the event date.");
      return false;
    }

    if (!form.time) {
      setError("Please select the event time.");
      return false;
    }

    if (!form.venue.trim()) {
      setError("Please enter the event venue.");
      return false;
    }

    if (
      form.ticketPrice === "" ||
      Number(form.ticketPrice) <= 0
    ) {
      setError("Please enter a valid ticket price.");
      return false;
    }

    return true;
  };

  // =========================================================
  // CREATE / UPDATE EVENT
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    const eventData = {
      name: form.name.trim(),
      date: form.date,
      time: form.time,
      venue: form.venue.trim(),
      ticketPrice: Number(form.ticketPrice),
      category: form.category.trim(),
    };

    try {
      setSaving(true);

      // =====================================================
      // UPDATE EVENT
      // =====================================================

      if (editingId !== null) {
        const response = await axios.put(
          `${API_URL}/${editingId}`,
          eventData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setEvents((previousEvents) =>
          previousEvents.map((existingEvent) =>
            existingEvent.id === editingId
              ? response.data
              : existingEvent
          )
        );

        setSuccess(
          "Event updated successfully."
        );
      }

      // =====================================================
      // CREATE EVENT
      // =====================================================

      else {
        const response = await axios.post(
          API_URL,
          eventData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setEvents((previousEvents) => [
          ...previousEvents,
          response.data,
        ]);

        setSuccess(
          "Event created successfully."
        );
      }

      // =====================================================
      // RESET FORM AFTER SUCCESS
      // =====================================================

      setForm({
        ...EMPTY_FORM,
      });

      setEditingId(null);

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error(
        "Error saving event:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Unable to save event."
        )
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // EDIT EVENT
  // =========================================================

  const handleEdit = (event) => {
    setEditingId(event.id);

    setForm({
      name: event.name || "",

      date: event.date || "",

      time: event.time
        ? event.time.substring(0, 5)
        : "",

      venue: event.venue || "",

      ticketPrice:
        event.ticketPrice ?? "",

      category:
        event.category || "",
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================================================
  // DELETE EVENT
  // =========================================================

  const handleDelete = async (eventId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this event?\n\n" +
        "All seats belonging to this event will also be deleted."
    );

    if (!confirmDelete) {
      return;
    }

    try {
      setDeleting(eventId);

      setError("");
      setSuccess("");

      await axios.delete(
        `${API_URL}/${eventId}`
      );

      setEvents((previousEvents) =>
        previousEvents.filter(
          (event) => event.id !== eventId
        )
      );

      if (editingId === eventId) {
        setForm({
          ...EMPTY_FORM,
        });

        setEditingId(null);
      }

      setSuccess(
        "Event deleted successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error(
        "Error deleting event:",
        error
      );

      setError(
        getErrorMessage(
          error,
          "Unable to delete event."
        )
      );
    } finally {
      setDeleting(null);
    }
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
          Loading Events...
        </h2>

        <p>
          Please wait while events are loaded.
        </p>
      </div>
    );
  }

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="admin-events-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <div className="admin-page-header">

        <div>
          <h1>
            Event Management
          </h1>

          <p>
            Create, update and manage TicketBook events.
          </p>
        </div>

        <div className="admin-page-count">
          {events.length}{" "}
          {events.length === 1
            ? "Event"
            : "Events"}
        </div>

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
          EVENT FORM
      ===================================================== */}

      <section className="admin-event-form-card">

        <div className="admin-section-header">

          <div>
            <h2>
              {editingId !== null
                ? "Edit Event"
                : "Create New Event"}
            </h2>

            <p>
              {editingId !== null
                ? "Update the event information below."
                : "Add a new event to TicketBook."}
            </p>
          </div>

        </div>

        <form
          className="admin-event-form"
          onSubmit={handleSubmit}
        >

          {/* EVENT NAME */}

          <div className="admin-form-group">

            <label htmlFor="name">
              Event Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter event name"
              value={form.name}
              onChange={handleChange}
              disabled={saving}
            />

          </div>

          {/* CATEGORY */}

          <div className="admin-form-group">

            <label htmlFor="category">
              Category
            </label>

            <input
              id="category"
              name="category"
              type="text"
              placeholder="Concert, Sports, Comedy..."
              value={form.category}
              onChange={handleChange}
              disabled={saving}
            />

          </div>

          {/* DATE */}

          <div className="admin-form-group">

            <label htmlFor="date">
              Date
            </label>

            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              disabled={saving}
            />

          </div>

          {/* TIME */}

          <div className="admin-form-group">

            <label htmlFor="time">
              Time
            </label>

            <input
              id="time"
              name="time"
              type="time"
              value={form.time}
              onChange={handleChange}
              disabled={saving}
            />

          </div>

          {/* VENUE */}

          <div className="admin-form-group">

            <label htmlFor="venue">
              Venue
            </label>

            <input
              id="venue"
              name="venue"
              type="text"
              placeholder="Enter event venue"
              value={form.venue}
              onChange={handleChange}
              disabled={saving}
            />

          </div>

          {/* TICKET PRICE */}

          <div className="admin-form-group">

            <label htmlFor="ticketPrice">
              Ticket Price (₹)
            </label>

            <input
              id="ticketPrice"
              name="ticketPrice"
              type="number"
              min="1"
              step="0.01"
              placeholder="Enter ticket price"
              value={form.ticketPrice}
              onChange={handleChange}
              disabled={saving}
            />

          </div>

          {/* FORM ACTIONS */}

          <div className="admin-event-form-actions">

            <button
              type="submit"
              className="admin-primary-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingId !== null
                  ? "Update Event"
                  : "Create Event"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="admin-secondary-button"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>
            )}

          </div>

        </form>

      </section>

      {/* =====================================================
          EVENTS LIST
      ===================================================== */}

      <section className="admin-events-list-section">

        <div className="admin-section-header">

          <div>
            <h2>
              All Events
            </h2>

            <p>
              Manage your existing TicketBook events.
            </p>
          </div>

          <button
            type="button"
            className="admin-refresh-button"
            onClick={loadEvents}
            disabled={refreshing}
          >
            {refreshing
              ? "↻ Refreshing..."
              : "↻ Refresh"}
          </button>

        </div>

        {/* ===================================================
            NO EVENTS
        =================================================== */}

        {events.length === 0 ? (

          <div className="admin-empty-state">

            <div>
              🎫
            </div>

            <h3>
              No Events Found
            </h3>

            <p>
              Create your first event using the form above.
            </p>

          </div>

        ) : (

          /* =================================================
             EVENTS GRID
          ================================================= */

          <div className="admin-events-grid">

            {events.map((event) => (

              <div
                className="admin-event-card"
                key={event.id}
              >

                {/* EVENT ICON */}

                <div className="admin-event-icon">
                  🎫
                </div>

                {/* EVENT DETAILS */}

                <div className="admin-event-details">

                  <h3>
                    {event.name ||
                      "Untitled Event"}
                  </h3>

                  <span className="admin-event-category">
                    {event.category ||
                      "General"}
                  </span>

                  <p>
                    📅 {event.date || "-"}
                  </p>

                  <p>
                    🕐{" "}
                    {event.time
                      ? event.time.substring(0, 5)
                      : "-"}
                  </p>

                  <p>
                    📍 {event.venue || "-"}
                  </p>

                  <strong>
                    ₹
                    {Number(
                      event.ticketPrice || 0
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>

                </div>

                {/* ACTIONS */}

                <div className="admin-event-actions">

                  <button
                    type="button"
                    className="admin-edit-button"
                    onClick={() =>
                      handleEdit(event)
                    }
                    disabled={
                      deleting === event.id ||
                      saving
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="admin-delete-button"
                    onClick={() =>
                      handleDelete(event.id)
                    }
                    disabled={
                      deleting === event.id ||
                      saving
                    }
                  >
                    {deleting === event.id
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}

// =========================================================
// EXPORT
// =========================================================

export default AdminEvents;