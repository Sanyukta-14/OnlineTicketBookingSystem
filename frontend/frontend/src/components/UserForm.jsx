import { useState, useEffect } from "react";
import {
  createUser,
  updateUser,
} from "../services/userService";

function UserForm({
  onUserCreated,
  editingUser,
  onCancelEdit,
}) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });

  useEffect(() => {
    if (editingUser) {
      setUser({
        name: editingUser.name || "",
        email: editingUser.email || "",
        password: editingUser.password || "",
        role: editingUser.role || "",
      });
    } else {
      setUser({
        name: "",
        email: "",
        password: "",
        role: "",
      });
    }
  }, [editingUser]);

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        await updateUser(editingUser.id, user);
        alert("User Updated Successfully!");
      } else {
        await createUser(user);
        alert("User Created Successfully!");
      }

      setUser({
        name: "",
        email: "",
        password: "",
        role: "",
      });

      onUserCreated();
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>
        {editingUser ? "Update User" : "Create User"}
      </h3>

      <div>
        <label>Name</label>
        <br />
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          required
        />
      </div>

      <br />

      <div>
        <label>Email</label>
        <br />
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          required
        />
      </div>

      <br />

      <div>
        <label>Password</label>
        <br />
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          required
        />
      </div>

      <br />

      <div>
        <label>Role</label>
        <br />
        <input
          type="text"
          name="role"
          value={user.role}
          onChange={handleChange}
          placeholder="USER or ADMIN"
          required
        />
      </div>

      <br />

      <button type="submit">
        {editingUser ? "Update User" : "Create User"}
      </button>

      {editingUser && (
        <button
          type="button"
          onClick={onCancelEdit}
          style={{ marginLeft: "10px", background: "#777", color: "white" }}
        >
          Cancel
        </button>
      )}
    </form>
  );
}

export default UserForm;