import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import "./AdminLayout.css";


// =========================================================
// ADMIN LAYOUT
// =========================================================

function AdminLayout({ children, title, subtitle }) {

  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);


  // =========================================================
  // GET ADMIN
  // =========================================================

  const getAdmin = () => {

    try {

      const savedAdmin =
        localStorage.getItem("loggedInAdmin");

      if (!savedAdmin) {
        return null;
      }

      return JSON.parse(savedAdmin);

    } catch (error) {

      console.error(
        "Unable to read admin:",
        error
      );

      return null;
    }
  };


  const admin = getAdmin();


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {

    const confirmLogout =
      window.confirm(
        "Are you sure you want to logout?"
      );


    if (!confirmLogout) {
      return;
    }


    localStorage.removeItem(
      "loggedInAdmin"
    );


    window.dispatchEvent(
      new Event("adminAuthChange")
    );


    navigate(
      "/admin/login",
      {
        replace: true,
      }
    );
  };


  // =========================================================
  // NAVIGATION ITEMS
  // =========================================================

  const navigationItems = [

    {
      path: "/admin",
      label: "Dashboard",
      icon: "📊",
      end: true,
    },

    {
      path: "/admin/users",
      label: "Users",
      icon: "👥",
    },

    {
      path: "/admin/events",
      label: "Events",
      icon: "🎫",
    },

    {
      path: "/admin/bookings",
      label: "Bookings",
      icon: "📋",
    },

  ];


  // =========================================================
  // CLOSE SIDEBAR
  // =========================================================

  const closeSidebar = () => {

    setSidebarOpen(false);

  };


  // =========================================================
  // ADMIN INITIAL
  // =========================================================

  const adminInitial =
    admin?.name
      ? admin.name
          .charAt(0)
          .toUpperCase()
      : "A";


  // =========================================================
  // PAGE
  // =========================================================

  return (

    <div className="admin-layout">


      {/* =====================================================
          MOBILE OVERLAY
      ===================================================== */}

      {sidebarOpen && (

        <div
          className="admin-sidebar-overlay"
          onClick={closeSidebar}
        />

      )}


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={
          sidebarOpen
            ? "admin-sidebar admin-sidebar-open"
            : "admin-sidebar"
        }
      >


        {/* ===================================================
            LOGO
        =================================================== */}

        <div className="admin-sidebar-logo">

          <div className="admin-logo-icon">
            🎟️
          </div>


          <div className="admin-logo-text">

            <strong>
              TicketBook
            </strong>

            <span>
              ADMIN PANEL
            </span>

          </div>

        </div>


        {/* ===================================================
            NAVIGATION
        =================================================== */}

        <nav className="admin-sidebar-navigation">


          <div className="admin-navigation-title">
            MAIN MENU
          </div>


          {navigationItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                isActive
                  ? "admin-nav-link admin-nav-link-active"
                  : "admin-nav-link"
              }
              onClick={closeSidebar}
            >

              <span className="admin-nav-icon">
                {item.icon}
              </span>


              <span className="admin-nav-label">
                {item.label}
              </span>

            </NavLink>

          ))}


        </nav>


        {/* ===================================================
            SIDEBAR BOTTOM
        =================================================== */}

        <div className="admin-sidebar-bottom">


          <div className="admin-sidebar-security">

            <span>
              🔐
            </span>

            <div>

              <strong>
                Secure Admin
              </strong>

              <small>
                Session protected
              </small>

            </div>

          </div>


          <button
            type="button"
            className="admin-sidebar-logout"
            onClick={handleLogout}
          >

            <span>
              🚪
            </span>

            <span>
              Logout
            </span>

          </button>


        </div>

      </aside>


      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="admin-main">


        {/* ===================================================
            TOP HEADER
        =================================================== */}

        <header className="admin-top-header">


          {/* =================================================
              MOBILE MENU BUTTON
          ================================================= */}

          <button
            type="button"
            className="admin-mobile-menu-button"
            onClick={() =>
              setSidebarOpen(true)
            }
            aria-label="Open admin menu"
          >
            ☰
          </button>


          {/* =================================================
              PAGE TITLE
          ================================================= */}

          <div className="admin-top-title">

            <h1>
              {title || "Admin Dashboard"}
            </h1>


            {subtitle && (

              <p>
                {subtitle}
              </p>

            )}

          </div>


          {/* =================================================
              ADMIN PROFILE
          ================================================= */}

          <div className="admin-top-profile">


            <div className="admin-top-profile-avatar">
              {adminInitial}
            </div>


            <div className="admin-top-profile-info">

              <strong>
                {admin?.name || "Administrator"}
              </strong>

              <span>
                Administrator
              </span>

            </div>


          </div>

        </header>


        {/* ===================================================
            CONTENT
        =================================================== */}

        <main className="admin-main-content">

          {children}

        </main>


      </div>

    </div>
  );
}


export default AdminLayout;