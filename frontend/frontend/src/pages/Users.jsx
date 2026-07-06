import { useEffect, useState } from "react";
import {
  getAllUsers,
  deleteUser,
} from "../services/userService";

import UserForm from "../components/UserForm";

import "../styles/users.css";

function Users() {
  const [users, setUsers] =useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await getAllUsers();

      setUsers(data);
    } catch (error) {
      console.error(error);
      alert("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await deleteUser(id);

      alert("User Deleted Successfully");

      fetchUsers();

      if (editingUser?.id === id) {
        setEditingUser(null);
      }
    } catch (error) {
      console.error(error);
      alert("Unable to delete user.");
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="user-container">

      <div className="users-header">

        <div>

          <h1>User Management</h1>

          <p>
            Manage all registered users in the system.
          </p>

        </div>

        <div className="users-count">

          Total Users

          <span>{users.length}</span>

        </div>

      </div>

      <UserForm
        editingUser={editingUser}
        onCancelEdit={() => setEditingUser(null)}
        onUserCreated={() => {
          fetchUsers();
          setEditingUser(null);
        }}
      />

      <div className="users-toolbar">

        <input
          type="text"
          placeholder="🔍 Search by Name or Email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {loading ? (

        <div className="loading">
          Loading Users...
        </div>

      ) : (

        <table>

          <thead>

            <tr>

              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
              <th>Role</th>
              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {filteredUsers.length > 0 ? (

              filteredUsers.map((user) => (

                <tr key={user.id}>

                  <td>{user.id}</td>

                  <td>{user.name}</td>

                  <td>{user.email}</td>

                  <td>••••••••</td>

                  <td>

                    <span
                      className={
                        user.role === "ADMIN"
                          ? "role admin"
                          : "role user"
                      }
                    >
                      {user.role}
                    </span>

                  </td>

                  <td>

                    <button
                      className="edit-btn"
                      onClick={() => setEditingUser(user)}
                    >
                      ✏ Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user.id)}
                    >
                      🗑 Delete
                    </button>

                  </td>

                </tr>

              ))

            ) : (

              <tr>

                <td colSpan="6">
                  No Users Found
                </td>

              </tr>

            )}

          </tbody>

        </table>

      )}

    </div>
  );
}

export default Users;