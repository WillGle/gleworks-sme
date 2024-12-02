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

// Add this before the UserList component
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0"); // Đảm bảo ngày có 2 chữ số
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Đảm bảo tháng có 2 chữ số
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // Định dạng dd-mm-yyyy
  };
const UserList: React.FC = () => {
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
          setMessage("Failed to fetch users.");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setMessage("Error fetching users.");
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
          `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (filterRole === "" || user.role.toLowerCase().includes(filterRole.toLowerCase())) &&
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
    navigate(`user-detail/${userId}`); // Thêm "user-list/user-detail/" vào đường dẫn
  };

  return (
    <div className="user-list-container">
      <h1>Users</h1>

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
            placeholder="Filter"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          />
        </div>
        <div className="filter-item">
          <label>Created At:</label>
          <input
            type="text"
            placeholder="Filter"
            value={filterCreatedAt}
            onChange={(e) => setFilterCreatedAt(e.target.value)}
          />
        </div>
      </div>

      <table className="user-table">
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Joined</th>
            <th>Permission</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user, index) => (
            <tr key={index} onClick={() => navigateToUserDetail(user.id)}> {/* Navigate on click */}
              <td>
                <input type="checkbox" />
              </td>
              <td>{user.id}</td>
              <td>{`${user.firstName} ${user.lastName}`}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{formatDate(user.createdAt)}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
