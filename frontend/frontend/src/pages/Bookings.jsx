import { useEffect, useState } from "react";
import {
  getAllBookings,
  deleteBooking,
  cancelBooking,
} from "../services/bookingService";

import { getAllUsers } from "../services/userService";
import { getAllEvents } from "../services/eventService";

import BookingForm from "../components/BookingForm";

import {
  FaTicketAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaRupeeSign,
  FaDownload,
  FaSearch,
} from "react-icons/fa";

import "../styles/bookings.css";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [editingBooking, setEditingBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [bookingData, userData, eventData] =
        await Promise.all([
          getAllBookings(),
          getAllUsers(),
          getAllEvents(),
        ]);

      setBookings(bookingData);
      setUsers(userData);
      setEvents(eventData);
    } catch (error) {
      console.error(error);
      alert("Unable to load bookings.");
    } finally {
      setLoading(false);
    }
  };

  const getUserName = (userId) => {
    const user = users.find((u) => u.id === userId);
    return user ? user.name : "Unknown";
  };

  const getEventName = (eventId) => {
    const event = events.find((e) => e.id === eventId);
    return event ? event.eventName : "Unknown";
  };

  const confirmedBookings = bookings.filter(
    (b) => b.status === "CONFIRMED"
  );

  const cancelledBookings = bookings.filter(
    (b) => b.status === "CANCELLED"
  );

  const totalRevenue = confirmedBookings.reduce(
    (sum, booking) => sum + booking.totalAmount,
    0
  );

  const filteredBookings = bookings.filter((booking) => {
    const user = getUserName(booking.userId).toLowerCase();
    const event = getEventName(booking.eventId).toLowerCase();

    return (
      user.includes(searchTerm.toLowerCase()) ||
      event.includes(searchTerm.toLowerCase())
    );
  });

  const handleEdit = (booking) => {
    setEditingBooking(booking);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleCancelBooking = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;

    try {
      await cancelBooking(id);

      alert("Booking Cancelled Successfully");

      loadData();

      if (editingBooking?.id === id) {
        setEditingBooking(null);
      }
    } catch (error) {
      console.error(error);
      alert("Unable to cancel booking.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) return;

    try {
      await deleteBooking(id);

      alert("Booking Deleted Successfully");

      loadData();

      if (editingBooking?.id === id) {
        setEditingBooking(null);
      }
    } catch (error) {
      console.error(error);
      alert("Unable to delete booking.");
    }
  };

  const exportBookings = () => {
    const rows = [
      [
        "ID",
        "User",
        "Event",
        "Tickets",
        "Amount",
        "Status",
      ],
    ];

    filteredBookings.forEach((booking) => {
      rows.push([
        booking.id,
        getUserName(booking.userId),
        getEventName(booking.eventId),
        booking.numberOfTickets,
        booking.totalAmount,
        booking.status,
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
    link.download = "Bookings_Report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="booking-container">

      <div className="booking-header">

        <div>
          <h2>🎟 Booking Management</h2>
          <p>Manage all bookings, cancellations and reports.</p>
        </div>

      </div>

      <div className="summary-box">

        <div className="summary-card">
          <FaTicketAlt className="summary-icon blue" />
          <div>
            <h4>Total Bookings</h4>
            <p>{bookings.length}</p>
          </div>
        </div>

        <div className="summary-card">
          <FaCheckCircle className="summary-icon green" />
          <div>
            <h4>Confirmed</h4>
            <p>{confirmedBookings.length}</p>
          </div>
        </div>

        <div className="summary-card">
          <FaTimesCircle className="summary-icon red" />
          <div>
            <h4>Cancelled</h4>
            <p>{cancelledBookings.length}</p>
          </div>
        </div>

        <div className="summary-card">
          <FaRupeeSign className="summary-icon orange" />
          <div>
            <h4>Revenue</h4>
            <p>₹{totalRevenue.toLocaleString("en-IN")}</p>
          </div>
        </div>

      </div>

      <BookingForm
        editingBooking={editingBooking}
        onBookingCreated={() => {
          loadData();
          setEditingBooking(null);
        }}
        onCancelEdit={() => setEditingBooking(null)}
      />

      <hr />

      <div className="booking-toolbar">

        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Search User or Event..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          className="export-btn"
          onClick={exportBookings}
        >
          <FaDownload />
          Export CSV
        </button>

      </div>

      {loading ? (
        <div className="loading">
          Loading Bookings...
        </div>
      ) : (
        <table>

          <thead>
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Event</th>
              <th>Tickets</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredBookings.length > 0 ? (
              filteredBookings.map((booking) => (
                <tr key={booking.id}>

                  <td>{booking.id}</td>

                  <td>{getUserName(booking.userId)}</td>

                  <td>{getEventName(booking.eventId)}</td>

                  <td>{booking.numberOfTickets}</td>

                  <td>
                    ₹{booking.totalAmount.toLocaleString("en-IN")}
                  </td>

                  <td>
                    <span
                      className={
                        booking.status === "CONFIRMED"
                          ? "status confirmed"
                          : "status cancelled"
                      }
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td>

                    <button
                      className="edit-btn"
                      disabled={booking.status === "CANCELLED"}
                      onClick={() => handleEdit(booking)}
                    >
                      ✏ Edit
                    </button>

                    {booking.status !== "CANCELLED" && (
                      <button
                        className="cancel-btn"
                        onClick={() =>
                          handleCancelBooking(booking.id)
                        }
                      >
                        ❌ Cancel
                      </button>
                    )}

                    <button
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(booking.id)
                      }
                    >
                      🗑 Delete
                    </button>

                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
                  No Bookings Found
                </td>
              </tr>
            )}

          </tbody>

        </table>
      )}

    </div>
  );
}

export default Bookings;