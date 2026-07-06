import { useEffect, useState } from "react";

import {
  getBookingsByUser,
  cancelBooking,
} from "../services/bookingService";

import { getAllEvents } from "../services/eventService";

import generateReceipt from "../utils/generateReceipt";

import {
  FaTicketAlt,
  FaCalendarAlt,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaMapMarkerAlt,
  FaRupeeSign,
  FaClock,
  FaDownload,
} from "react-icons/fa";

import "../styles/myBookings.css";

function MyBookings() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadBookings();
    loadEvents();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await getBookingsByUser(user.id);
      setBookings(data);
    } catch (error) {
      console.error(error);
    }
  };

  const loadEvents = async () => {
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch (error) {
      console.error(error);
    }
  };

  const getEvent = (eventId) =>
    events.find((e) => e.id === eventId);

  const confirmed = bookings.filter(
    (b) => b.status === "CONFIRMED"
  ).length;

  const cancelled = bookings.filter(
    (b) => b.status === "CANCELLED"
  ).length;

  const totalSpent = bookings
    .filter((b) => b.status === "CONFIRMED")
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const filteredBookings = bookings.filter((booking) => {
    const event = getEvent(booking.eventId);

    return event?.eventName
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const handleCancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await cancelBooking(id);

      alert("Booking Cancelled Successfully");

      loadBookings();
    } catch (error) {
      console.error(error);

      alert("Unable to cancel booking.");
    }
  };

  const handleDownload = (booking) => {
    const event = getEvent(booking.eventId);

    if (!event) {
      alert("Event details not found.");
      return;
    }

    generateReceipt(booking, event, user);
  };

  return (
    <div className="my-bookings">

      {/* Hero */}

      <div className="booking-hero">

        <div>

          <h1>🎟 My Bookings</h1>

          <p>
            Welcome back <strong>{user.name}</strong>.
            Manage all your bookings in one place.
          </p>

        </div>

      </div>

      {/* Summary */}

      <div className="booking-summary">

        <div className="summary-card">

          <FaTicketAlt className="summary-icon blue" />

          <div>

            <h4>Total Bookings</h4>

            <h2>{bookings.length}</h2>

          </div>

        </div>

        <div className="summary-card">

          <FaCheckCircle className="summary-icon green" />

          <div>

            <h4>Confirmed</h4>

            <h2>{confirmed}</h2>

          </div>

        </div>

        <div className="summary-card">

          <FaTimesCircle className="summary-icon red" />

          <div>

            <h4>Cancelled</h4>

            <h2>{cancelled}</h2>

          </div>

        </div>

        <div className="summary-card">

          <FaRupeeSign className="summary-icon orange" />

          <div>

            <h4>Total Spent</h4>

            <h2>
              ₹{totalSpent.toLocaleString("en-IN")}
            </h2>

          </div>

        </div>

      </div>

      {/* Search */}

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

      {/* Booking Cards */}

      <div className="booking-grid">

        {filteredBookings.length > 0 ? (

          filteredBookings.map((booking) => {

            const event = getEvent(booking.eventId);

            return (

              <div
                className="booking-card"
                key={booking.id}
              >

                <div className="booking-icon">

                  <FaCalendarAlt />

                </div>

                <h2>{event?.eventName}</h2>

                <p>

                  <FaMapMarkerAlt />

                  {event?.location}

                </p>

                <p>

                  <FaClock />

                  {event?.eventDate}

                </p>

                <div className="booking-details">

                  <span>
                    🎫 {booking.numberOfTickets} Tickets
                  </span>

                  <span>
                    ₹{booking.totalAmount}
                  </span>

                </div>

                <span
                  className={
                    booking.status === "CONFIRMED"
                      ? "status confirmed"
                      : "status cancelled"
                  }
                >
                  {booking.status}
                </span>

                <div className="booking-actions">

                  <button
                    className="download-btn"
                    onClick={() =>
                      handleDownload(booking)
                    }
                  >
                    <FaDownload />
                    Download Ticket
                  </button>

                  {booking.status === "CONFIRMED" && (

                    <button
                      className="cancel-btn"
                      onClick={() =>
                        handleCancel(booking.id)
                      }
                    >
                      Cancel Booking
                    </button>

                  )}

                </div>

              </div>

            );

          })

        ) : (

          <div className="empty-bookings">

            <FaTicketAlt size={70} />

            <h2>No Bookings Found</h2>

            <p>
              Book your first event to see it here.
            </p>

          </div>

        )}

      </div>

    </div>
  );
}

export default MyBookings;