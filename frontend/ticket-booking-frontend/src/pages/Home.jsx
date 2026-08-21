import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-page">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="home-hero">

        <div className="home-hero-background">
          <div className="home-glow home-glow-one"></div>
          <div className="home-glow home-glow-two"></div>
        </div>

        <div className="home-hero-content">

          <div className="home-badge">
            <span>🎟️</span>
            <span>Your gateway to unforgettable experiences</span>
          </div>

          <h1>
            Book Your
            <span> Tickets Easily</span>
          </h1>

          <p>
            Discover movies, concerts and exciting events.
            Choose your seats and book your tickets in just
            a few simple clicks.
          </p>

          <div className="home-hero-actions">

            <Link
              to="/events"
              className="home-primary-button"
            >
              Explore Events
              <span>→</span>
            </Link>

            <Link
              to="/bookings"
              className="home-secondary-button"
            >
              My Bookings
            </Link>

          </div>

          <div className="home-trust">

            <div className="home-trust-item">
              <span className="home-trust-icon">✓</span>
              <span>Easy booking</span>
            </div>

            <div className="home-trust-item">
              <span className="home-trust-icon">✓</span>
              <span>Secure tickets</span>
            </div>

            <div className="home-trust-item">
              <span className="home-trust-icon">✓</span>
              <span>Choose your seat</span>
            </div>

          </div>

        </div>


        {/* ===================================================
            HERO TICKET VISUAL
        =================================================== */}

        <div className="home-hero-visual">

          <div className="ticket-card">

            <div className="ticket-top">

              <div className="ticket-logo">
                🎟️
              </div>

              <div className="ticket-brand">

                <span className="ticket-label">
                  TICKETBOOK
                </span>

                <strong>
                  Your Event
                </strong>

              </div>

            </div>


            <div className="ticket-event">

              <span>
                🎬 MOVIE / EVENT
              </span>

              <h3>
                An Experience
                <br />
                Worth Remembering
              </h3>

            </div>


            <div className="ticket-details">

              <div>
                <span>DATE</span>
                <strong>20 AUG</strong>
              </div>

              <div>
                <span>TIME</span>
                <strong>07:30 PM</strong>
              </div>

              <div>
                <span>SEAT</span>
                <strong>A12</strong>
              </div>

            </div>


            <div className="ticket-divider"></div>


            <div className="ticket-barcode">

              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>

            </div>

          </div>


          {/* FLOATING CARD 1 */}

          <div className="home-floating-card home-floating-card-one">

            <span>🎟️</span>

            <div>
              <strong>Easy Booking</strong>
              <small>Book in seconds</small>
            </div>

          </div>


          {/* FLOATING CARD 2 */}

          <div className="home-floating-card home-floating-card-two">

            <span>💺</span>

            <div>
              <strong>Choose Your Seat</strong>
              <small>Your choice, your comfort</small>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          STATS
      ===================================================== */}

      <section className="home-stats">

        <div className="home-stat">
          <strong>100+</strong>
          <span>Events Available</span>
        </div>

        <div className="home-stat">
          <strong>1K+</strong>
          <span>Happy Customers</span>
        </div>

        <div className="home-stat">
          <strong>24/7</strong>
          <span>Easy Access</span>
        </div>

        <div className="home-stat">
          <strong>100%</strong>
          <span>Secure Booking</span>
        </div>

      </section>


      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section className="home-features">

        <div className="home-section-heading">

          <span className="home-section-label">
            WHY TICKETBOOK?
          </span>

          <h2>
            Everything you need for
            <span> better bookings.</span>
          </h2>

          <p>
            We make finding and booking your next experience
            simple, fast and convenient.
          </p>

        </div>


        <div className="home-features-grid">


          {/* FEATURE 1 */}

          <div className="home-feature-card">

            <div className="home-feature-top">

              <div className="home-feature-icon purple">
                🎬
              </div>

              <span className="home-feature-number">
                01
              </span>

            </div>

            <h3>
              Discover Events
            </h3>

            <p>
              Explore movies, concerts and exciting events
              available for booking in one place.
            </p>

            <Link to="/events">
              Explore events →
            </Link>

          </div>


          {/* FEATURE 2 */}

          <div className="home-feature-card">

            <div className="home-feature-top">

              <div className="home-feature-icon blue">
                💺
              </div>

              <span className="home-feature-number">
                02
              </span>

            </div>

            <h3>
              Choose Your Seat
            </h3>

            <p>
              Select your preferred seats and make sure you
              get the perfect spot for your experience.
            </p>

            <Link to="/events">
              Choose a seat →
            </Link>

          </div>


          {/* FEATURE 3 */}

          <div className="home-feature-card">

            <div className="home-feature-top">

              <div className="home-feature-icon pink">
                🎟️
              </div>

              <span className="home-feature-number">
                03
              </span>

            </div>

            <h3>
              Easy Booking
            </h3>

            <p>
              Complete your booking quickly through our
              simple and user-friendly booking process.
            </p>

            <Link to="/events">
              Book now →
            </Link>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="home-how-section">

        <div className="home-section-heading">

          <span className="home-section-label">
            SIMPLE PROCESS
          </span>

          <h2>
            Book your ticket in
            <span> 3 easy steps.</span>
          </h2>

        </div>


        <div className="home-steps">


          <div className="home-step">

            <div className="home-step-number">
              1
            </div>

            <div>
              <h3>
                Find an Event
              </h3>

              <p>
                Browse through available movies and events
                and choose the one you love.
              </p>
            </div>

          </div>


          <div className="home-step-line"></div>


          <div className="home-step">

            <div className="home-step-number">
              2
            </div>

            <div>
              <h3>
                Select Your Seat
              </h3>

              <p>
                Pick your preferred seats and enter the
                number of tickets you need.
              </p>
            </div>

          </div>


          <div className="home-step-line"></div>


          <div className="home-step">

            <div className="home-step-number">
              3
            </div>

            <div>
              <h3>
                Confirm Booking
              </h3>

              <p>
                Confirm your booking and enjoy your event
                with your tickets ready.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="home-cta">

        <div className="home-cta-content">

          <span className="home-section-label">
            READY TO GO?
          </span>

          <h2>
            Your next experience
            <br />
            is just a click away.
          </h2>

          <p>
            Find your event, choose your seat and book
            your tickets today.
          </p>

          <Link
            to="/events"
            className="home-cta-button"
          >
            Explore Events
            <span>→</span>
          </Link>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="home-footer">

        <div className="home-footer-brand">

          <div className="home-footer-logo">
            🎟️
          </div>

          <div>

            <strong>
              TicketBook
            </strong>

            <span>
              Your gateway to great experiences.
            </span>

          </div>

        </div>

        <p>
          © {new Date().getFullYear()} TicketBook.
          All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default Home;