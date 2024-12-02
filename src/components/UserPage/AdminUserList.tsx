import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminUserList.css";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  joined: string; // This will be createdAt
  permission: string; // This will be role
}

const AdminUserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPermission, setFilterPermission] = useState("");
  const [filterJoined, setFilterJoined] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [navigate]);

  const filteredUsers = users.filter((user) => {
    return (
      (searchTerm === "" ||
        `${user.lastName} ${user.firstName}`.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterPermission === "" || user.permission.toLowerCase().includes(filterPermission.toLowerCase())) &&
      (filterJoined === "" || user.joined.includes(filterJoined))
    );
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-list-container">
      <h1>Users</h1>

      <div className="filters">
        <div className="filter-item">
          <label>User:</label>
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-item">
          <label>Permission:</label>
          <input
            type="text"
            placeholder="Filter by permission"
            value={filterPermission}
            onChange={(e) => setFilterPermission(e.target.value)}
          />
        </div>
        <div className="filter-item">
          <label>Joined:</label>
          <input
            type="text"
            placeholder="Filter by joined date"
            value={filterJoined}
            onChange={(e) => setFilterJoined(e.target.value)}
          />
        </div>
      </div>

      <div className="user-list">
        {filteredUsers.map((user) => (
          <div key={user.id} className="user-item">
            <p>{`${user.lastName} ${user.firstName}`}</p> {/* Full name */}
            <p>{user.email}</p>
            <p>{user.address}</p>
            <p>{user.joined}</p> {/* createdAt */}
            <p>{user.permission}</p> {/* role */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUserList;