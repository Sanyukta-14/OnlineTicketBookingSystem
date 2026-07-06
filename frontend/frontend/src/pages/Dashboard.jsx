import { useEffect, useState } from "react";
import { getAllUsers } from "../services/userService";
import { getAllEvents } from "../services/eventService";
import { getAllBookings } from "../services/bookingService";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

import {
  FaUsers,
  FaCalendarAlt,
  FaTicketAlt,
  FaRupeeSign,
  FaCheckCircle,
  FaTimesCircle,
  FaPercentage,
  FaTrophy,
} from "react-icons/fa";

import "../styles/dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function Dashboard() {

  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {

      const usersData = await getAllUsers();
      const eventsData = await getAllEvents();
      const bookingsData = await getAllBookings();

      setUsers(usersData);
      setEvents(eventsData);
      setBookings(bookingsData);

    } catch (error) {
      console.error(error);
    }
  };

  const getUserName = (id) => {
    const user = users.find((u) => u.id === id);
    return user ? user.name : "Unknown User";
  };

  const getEventName = (id) => {
    const event = events.find((e) => e.id === id);
    return event ? event.eventName : "Unknown Event";
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

  const cancellationRate =
    bookings.length > 0
      ? (
          (cancelledBookings.length / bookings.length) *
          100
        ).toFixed(1)
      : "0";

  // Top Selling Event

  const eventSales = {};

  confirmedBookings.forEach((booking) => {

    eventSales[booking.eventId] =
      (eventSales[booking.eventId] || 0) +
      booking.numberOfTickets;

  });

  let topEventId = null;
  let maxTickets = 0;

  Object.keys(eventSales).forEach((id) => {

    if (eventSales[id] > maxTickets) {

      maxTickets = eventSales[id];
      topEventId = Number(id);

    }

  });

  const topEvent =
    events.find((e) => e.id === topEventId);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const barData = {
    labels: ["Users", "Events", "Bookings"],
    datasets: [
      {
        label: "System Overview",
        data: [
          users.length,
          events.length,
          bookings.length,
        ],
        backgroundColor: [
          "#4F46E5",
          "#10B981",
          "#F59E0B",
        ],
        borderRadius: 10,
      },
    ],
  };

  const pieData = {
    labels: ["Confirmed", "Cancelled"],
    datasets: [
      {
        data: [
          confirmedBookings.length,
          cancelledBookings.length,
        ],
        backgroundColor: [
          "#22C55E",
          "#EF4444",
        ],
      },
    ],
  };

  return (

    <div className="dashboard-container">

      <div className="dashboard-header">

        <div>

          <h1>Admin Dashboard 👋</h1>

          <p>
            Welcome back! Here's what's happening in your ticket booking system.
          </p>

        </div>

        <div>

          <strong>{today}</strong>

        </div>

      </div>

      {/* Statistics */}

      <div className="cards">

        <div className="card users">
          <FaUsers className="card-icon" />
          <h3>Total Users</h3>
          <p>{users.length}</p>
        </div>

        <div className="card events">
          <FaCalendarAlt className="card-icon" />
          <h3>Total Events</h3>
          <p>{events.length}</p>
        </div>

        <div className="card bookings">
          <FaTicketAlt className="card-icon" />
          <h3>Total Bookings</h3>
          <p>{bookings.length}</p>
        </div>

        <div className="card revenue">
          <FaRupeeSign className="card-icon" />
          <h3>Total Revenue</h3>
          <p>
            ₹
            {totalRevenue.toLocaleString("en-IN")}
          </p>
        </div>

      </div>

      {/* Charts */}

      <h2 className="section-title">
        Analytics
      </h2>

      <div className="charts">

        <div className="chart-box">
          <h3>System Overview</h3>
          <Bar data={barData} />
        </div>

        <div className="chart-box">
          <h3>Booking Status</h3>
          <Pie data={pieData} />
        </div>

      </div>

      {/* Summary */}

      <h2 className="section-title">
        Booking Summary
      </h2>

      <div className="summary-box">

        <div className="summary-card confirmed">
          <FaCheckCircle className="summary-icon" />
          <div>
            <h4>Confirmed</h4>
            <p>{confirmedBookings.length}</p>
          </div>
        </div>

        <div className="summary-card cancelled">
          <FaTimesCircle className="summary-icon" />
          <div>
            <h4>Cancelled</h4>
            <p>{cancelledBookings.length}</p>
          </div>
        </div>

        <div className="summary-card rate">
          <FaPercentage className="summary-icon" />
          <div>
            <h4>Cancellation Rate</h4>
            <p>{cancellationRate}%</p>
          </div>
        </div>

      </div>

      {/* Top Event */}

      <div className="top-event-card">

        <FaTrophy className="top-event-icon" />

        <h3>Top Selling Event</h3>

        {topEvent ? (

          <>
            <h2>{topEvent.eventName}</h2>

            <p>
              🎟 Tickets Sold :
              <strong> {maxTickets}</strong>
            </p>
          </>

        ) : (

          <p>No confirmed bookings yet.</p>

        )}

      </div>

      {/* Recent Bookings */}

      <h2 className="section-title">
        Recent Bookings
      </h2>

      <table>

        <thead>

          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Event</th>
            <th>Tickets</th>
            <th>Total Amount</th>
            <th>Status</th>
          </tr>

        </thead>

        <tbody>

          {bookings.length > 0 ? (

            [...bookings]
              .sort((a, b) => b.id - a.id)
              .slice(0, 5)
              .map((booking) => (

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

                </tr>

              ))

          ) : (

            <tr>

              <td colSpan="6">
                No bookings available.
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>

  );

}

export default Dashboard;