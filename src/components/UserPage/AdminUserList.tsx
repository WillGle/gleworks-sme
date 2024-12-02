import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation
import "./AdminUserList.css";

const apiUrl = import.meta.env.VITE_API_URL;

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  createdAt: string;
  role: string;
}

// Utility function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const AdminUserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterCreatedAt, setFilterCreatedAt] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate for navigation

  // Fetching users
  const fetchAllUsers = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await fetch(`${apiUrl}/users`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUsers(userData);
          setFilteredUsers(userData);
        } else {
          const errorResponse = await response.json();
          setMessage(`Failed to fetch users: ${errorResponse.message}`);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setMessage("An unexpected error occurred while fetching users.");
      }
    } else {
      setMessage("Token is missing.");
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleSearchAndFilter = () => {
    const filtered = users.filter((user) => {
      return (
        (searchTerm === "" ||
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) &&
        (filterRole === "" ||
          user.role.toLowerCase().includes(filterRole.toLowerCase())) &&
        (filterCreatedAt === "" || user.createdAt.includes(filterCreatedAt))
      );
    });
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    handleSearchAndFilter();
  }, [searchTerm, filterRole, filterCreatedAt, users]);

  // Navigate to user detail page when a user is clicked
  const navigateToUserDetail = (userId: string) => {
    navigate(`user-detail/${userId}`);
  };

  return (
    <div className="user-list-container">
      <h1>User Management</h1>

      {message && <p className="error-message">{message}</p>}

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
          <label>Role:</label>
          <input
            type="text"
            placeholder="Filter by role"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          />
        </div>
        <div className="filter-item">
          <label>Created At:</label>
          <input
            type="text"
            placeholder="Enter date (dd-mm-yyyy)"
            value={filterCreatedAt}
            onChange={(e) => setFilterCreatedAt(e.target.value)}
          />
        </div>
      </div>

      <div className="user-table">
        <div className="user-table-header">
          <div>ID</div>
          <div>Full Name</div>
          <div>Email</div>
          <div>Address</div>
          <div>Joined</div>
          <div>Permission</div>
        </div>

        {filteredUsers.map((user, index) => (
          <div
            key={index}
            className="user-table-row"
            onClick={() => navigateToUserDetail(user.id)}
            style={{ cursor: "pointer" }}
          >
            <div>{user.id}</div>
            <div>{`${user.firstName} ${user.lastName}`}</div>
            <div>{user.email}</div>
            <div>{user.address || "N/A"}</div>
            <div>{formatDate(user.createdAt)}</div>
            <div>{user.role}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUserList;
