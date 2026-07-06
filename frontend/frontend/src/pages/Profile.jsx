import { useState } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaLock,
  FaUserTag,
  FaSave,
  FaCalendarAlt,
  FaShieldAlt,
  FaUserEdit,
} from "react-icons/fa";

import { updateUser } from "../services/userService";
import "../styles/profile.css";

function Profile() {
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(currentUser);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedUser = await updateUser(user.id, user);

      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);

      alert("Profile Updated Successfully!");

    } catch (error) {
      console.error(error);
      alert("Update Failed");
    }
  };

  return (
    <div className="profile-page">

      {/* Hero */}

      <div className="profile-hero">

        <div>

          <h1>
            Welcome, {user.name} 👋
          </h1>

          <p>
            Keep your account information updated and secure.
          </p>

        </div>

        <div className="profile-date">

          <FaCalendarAlt />

          <span>{today}</span>

        </div>

      </div>

      {/* Summary Cards */}

      <div className="profile-summary">

        <div className="summary-card">

          <div className="summary-icon blue">

            <FaUserCircle />

          </div>

          <div>

            <h4>User ID</h4>

            <h2>{user.id}</h2>

          </div>

        </div>

        <div className="summary-card">

          <div className="summary-icon green">

            <FaShieldAlt />

          </div>

          <div>

            <h4>Role</h4>

            <h2>{user.role}</h2>

          </div>

        </div>

        <div className="summary-card">

          <div className="summary-icon orange">

            <FaUserEdit />

          </div>

          <div>

            <h4>Status</h4>

            <h2>Active</h2>

          </div>

        </div>

      </div>

      {/* Profile Form */}

      <div className="profile-card">

        <div className="profile-header">

          <FaUserCircle className="profile-avatar" />

          <h2>{user.name}</h2>

          <p>{user.email}</p>

        </div>

        <form onSubmit={handleSubmit}>

          <div className="profile-group">

            <label>

              <FaUserCircle />

              Full Name

            </label>

            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              required
            />

          </div>

          <div className="profile-group">

            <label>

              <FaEnvelope />

              Email Address

            </label>

            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />

          </div>

          <div className="profile-group">

            <label>

              <FaLock />

              Password

            </label>

            <input
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
            />

          </div>

          <div className="profile-group">

            <label>

              <FaUserTag />

              Account Role

            </label>

            <input
              value={user.role}
              disabled
            />

          </div>

          <button
            type="submit"
            className="save-btn"
          >

            <FaSave />

            Save Changes

          </button>

        </form>

      </div>

    </div>
  );
}

export default Profile;