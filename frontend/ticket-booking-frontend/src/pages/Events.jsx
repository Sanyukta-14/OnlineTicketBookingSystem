import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function Events() {

  const navigate = useNavigate();

  // =========================================================
  // STATE
  // =========================================================

  const [events, setEvents] = useState([]);

  const [search, setSearch] = useState("");

  const [venue, setVenue] = useState("");

  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // =========================================================
  // LOAD EVENTS
  // =========================================================

  useEffect(() => {

    let cancelled = false;

    const loadEvents = async () => {

      try {

        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:8080/events"
        );

        if (!response.ok) {
          throw new Error(
            "Failed to load events."
          );
        }

        const data = await response.json();

        if (!cancelled) {
          setEvents(
            Array.isArray(data)
              ? data
              : []
          );
        }

      } catch (error) {

        if (cancelled) {
          return;
        }

        console.error(
          "Error loading events:",
          error
        );

        setError(
          "Unable to load events. Please try again."
        );

      } finally {

        if (!cancelled) {
          setLoading(false);
        }

      }
    };

    loadEvents();

    return () => {
      cancelled = true;
    };

  }, []);


  // =========================================================
  // CHECK LOGIN BEFORE SELECTING SEATS
  // =========================================================

  const handleSelectSeats = (eventId) => {

    const savedUser =
      localStorage.getItem(
        "loggedInUser"
      );

    if (!savedUser) {

      alert(
        "Please login before selecting seats."
      );

      navigate("/login");

      return;
    }

    navigate(
      `/seats/${eventId}`
    );
  };


  // =========================================================
  // GET EVENT CATEGORIES
  // =========================================================

  const categories = useMemo(() => {

    const uniqueCategories = events
      .map((event) =>
        event.category
          ? event.category.trim()
          : ""
      )
      .filter(Boolean);

    return [
      ...new Set(uniqueCategories)
    ];

  }, [events]);


  // =========================================================
  // FILTER EVENTS
  // =========================================================

  const filteredEvents = useMemo(() => {

    return events.filter((event) => {

      const eventName =
        event.name || "";

      const eventVenue =
        event.venue || "";

      const eventCategory =
        event.category || "";


      const searchText =
        search.trim().toLowerCase();

      const venueText =
        venue.trim().toLowerCase();


      const matchesSearch =
        eventName
          .toLowerCase()
          .includes(searchText);


      const matchesVenue =
        eventVenue
          .toLowerCase()
          .includes(venueText);


      const matchesCategory =
        category === "" ||
        eventCategory.toLowerCase() ===
          category.toLowerCase();


      return (
        matchesSearch &&
        matchesVenue &&
        matchesCategory
      );

    });

  }, [
    events,
    search,
    venue,
    category
  ]);


  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {

    if (!date) {
      return "Date unavailable";
    }

    try {

      return new Date(
        `${date}T00:00:00`
      ).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );

    } catch {
      return date;
    }
  };


  // =========================================================
  // FORMAT TIME
  // =========================================================

  const formatTime = (time) => {

    if (!time) {
      return "Time unavailable";
    }

    try {

      const [hours, minutes] =
        time.split(":");

      const date =
        new Date();

      date.setHours(
        Number(hours),
        Number(minutes),
        0
      );

      return date.toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );

    } catch {
      return time;
    }
  };


  // =========================================================
  // GET CATEGORY ICON
  // =========================================================

  const getCategoryIcon = (
    eventCategory
  ) => {

    const value =
      (eventCategory || "")
        .toLowerCase();

    if (
      value.includes("movie") ||
      value.includes("film")
    ) {
      return "🎬";
    }

    if (
      value.includes("concert") ||
      value.includes("music")
    ) {
      return "🎵";
    }

    if (
      value.includes("sport")
    ) {
      return "🏆";
    }

    if (
      value.includes("theatre") ||
      value.includes("theater")
    ) {
      return "🎭";
    }

    if (
      value.includes("conference")
    ) {
      return "💼";
    }

    return "🎟️";
  };


  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {

    return (

      <div className="events-page">

        <div className="events-loading">

          <div className="events-spinner"></div>

          <h2>
            Loading events...
          </h2>

          <p>
            Finding the best experiences
            for you.
          </p>

        </div>

      </div>

    );
  }


  // =========================================================
  // ERROR
  // =========================================================

  if (error) {

    return (

      <div className="events-page">

        <div className="events-error">

          <div className="events-error-icon">
            ⚠️
          </div>

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            className="events-retry-button"
            onClick={() =>
              window.location.reload()
            }
          >
            Try Again
          </button>

        </div>

      </div>

    );
  }


  // =========================================================
  // EVENTS PAGE
  // =========================================================

  return (

    <div className="events-page">

      {/* =====================================================
          HERO / HEADER
      ===================================================== */}

      <section className="events-hero">

        <div className="events-hero-glow events-hero-glow-one"></div>

        <div className="events-hero-glow events-hero-glow-two"></div>


        <div className="events-hero-content">

          <div className="events-badge">

            <span>
              🎟️
            </span>

            <span>
              DISCOVER YOUR NEXT EXPERIENCE
            </span>

          </div>


          <h1>
            Upcoming
            <span> Events</span>
          </h1>


          <p>
            Find your favorite movies, concerts
            and exciting events. Choose your
            perfect seat and book your tickets
            with ease.
          </p>

        </div>

      </section>


      {/* =====================================================
          FILTER SECTION
      ===================================================== */}

      <section className="events-filter-section">

        <div className="events-filter-container">


          {/* =================================================
              SEARCH EVENT
          ================================================= */}

          <div className="events-search-box">

            <span className="events-input-icon">
              🔎
            </span>

            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>


          {/* =================================================
              SEARCH VENUE
          ================================================= */}

          <div className="events-search-box">

            <span className="events-input-icon">
              📍
            </span>

            <input
              type="text"
              placeholder="Search venue..."
              value={venue}
              onChange={(e) =>
                setVenue(
                  e.target.value
                )
              }
            />

          </div>


          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="events-category-box">

            <span className="events-input-icon">
              🏷️
            </span>

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
            >

              <option value="">
                All Categories
              </option>

              {categories.map(
                (item) => (

                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>

                )
              )}

            </select>

          </div>


          {/* =================================================
              CLEAR FILTERS
          ================================================= */}

          {(search ||
            venue ||
            category) && (

            <button
              type="button"
              className="events-clear-button"
              onClick={() => {

                setSearch("");
                setVenue("");
                setCategory("");

              }}
            >
              Clear
            </button>

          )}

        </div>

      </section>


      {/* =====================================================
          EVENTS CONTENT
      ===================================================== */}

      <main className="events-content">


        {/* =================================================
            EVENTS HEADER
        ================================================= */}

        <div className="events-content-header">

          <div>

            <span className="events-section-label">
              AVAILABLE NOW
            </span>

            <h2>
              Explore Events
            </h2>

          </div>


          <div className="events-count">

            <strong>
              {filteredEvents.length}
            </strong>

            <span>
              {filteredEvents.length === 1
                ? " event found"
                : " events found"}
            </span>

          </div>

        </div>


        {/* =================================================
            EVENT CARDS
        ================================================= */}

        {filteredEvents.length > 0 ? (

          <div className="events-grid">

            {filteredEvents.map(
              (event) => (

                <article
                  className="event-card"
                  key={event.id}
                >

                  {/* =========================================
                      EVENT TOP
                  ========================================= */}

                  <div className="event-card-top">

                    <div className="event-card-icon">

                      {getCategoryIcon(
                        event.category
                      )}

                    </div>


                    {event.category && (

                      <span className="event-category">

                        {event.category}

                      </span>

                    )}

                  </div>


                  {/* =========================================
                      EVENT INFORMATION
                  ========================================= */}

                  <div className="event-details">

                    <h3>
                      {event.name ||
                        "Untitled Event"}
                    </h3>


                    {/* Venue */}

                    <div className="event-info-row">

                      <span className="event-info-icon">
                        📍
                      </span>

                      <div>

                        <small>
                          VENUE
                        </small>

                        <p>
                          {event.venue ||
                            "Venue unavailable"}
                        </p>

                      </div>

                    </div>


                    {/* Date */}

                    <div className="event-info-row">

                      <span className="event-info-icon">
                        📅
                      </span>

                      <div>

                        <small>
                          DATE
                        </small>

                        <p>
                          {formatDate(
                            event.date
                          )}
                        </p>

                      </div>

                    </div>


                    {/* Time */}

                    <div className="event-info-row">

                      <span className="event-info-icon">
                        🕐
                      </span>

                      <div>

                        <small>
                          TIME
                        </small>

                        <p>
                          {formatTime(
                            event.time
                          )}
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* =========================================
                      EVENT FOOTER
                  ========================================= */}

                  <div className="event-card-footer">

                    <div className="event-price-box">

                      <small>
                        TICKET FROM
                      </small>

                      <strong>
                        ₹
                        {Number(
                          event.ticketPrice || 0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>


                    <button
                      type="button"
                      className="select-event-button"
                      onClick={() =>
                        handleSelectSeats(
                          event.id
                        )
                      }
                    >

                      Select Seats

                      <span>
                        →
                      </span>

                    </button>

                  </div>

                </article>

              )
            )}

          </div>

        ) : (

          /* =================================================
             NO EVENTS
          ================================================= */

          <div className="no-events">

            <div className="no-events-icon">
              🎟️
            </div>

            <h2>
              No events found
            </h2>

            <p>
              We couldn't find any events
              matching your search.
            </p>

            <button
              type="button"
              onClick={() => {

                setSearch("");
                setVenue("");
                setCategory("");

              }}
            >
              View All Events
            </button>

          </div>

        )}

      </main>


      {/* =====================================================
          BOTTOM CTA
      ===================================================== */}

      <section className="events-bottom-cta">

        <div>

          <span>
            READY FOR YOUR NEXT EXPERIENCE?
          </span>

          <h2>
            Pick your event.
            <br />
            Choose your seat.
            <br />
            Make memories.
          </h2>

        </div>

        <div className="events-bottom-ticket">
          🎟️
        </div>

      </section>

    </div>
  );
}

export default Events;