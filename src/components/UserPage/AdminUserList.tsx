import React, { useState } from "react";
import "./AdminUserList.css";

const mockUsers = [
  {
    id: "xxxxxx",
    fullName: "Will Kenason",
    email: "will.kenason@example.com",
    address: "ABC Street",
    joined: "01/01/2023",
    permission: "Admin",
  },
  {
    id: "xxxxxx",
    fullName: "John Smiths",
    email: "john.smith@example.com",
    address: "ABC Street",
    joined: "02/01/2023",
    permission: "User",
  },
  // Add more mock users as needed
];

const UserList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPermission, setFilterPermission] = useState("");
  const [filterJoined, setFilterJoined] = useState("");

  const filteredUsers = mockUsers.filter((user) => {
    return (
      (searchTerm === "" ||
        `${user.lastName} ${user.firstName}`.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterPermission === "" || user.permission.toLowerCase().includes(filterPermission.toLowerCase())) &&
      (filterJoined === "" || user.joined.includes(filterJoined))
    );
  });

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
          <label>Permissions:</label>
          <input
            type="text"
            placeholder="Filter"
            value={filterPermission}
            onChange={(e) => setFilterPermission(e.target.value)}
          />
        </div>
        <div className="filter-item">
          <label>Joined:</label>
          <input
            type="text"
            placeholder="Filter"
            value={filterJoined}
            onChange={(e) => setFilterJoined(e.target.value)}
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
            <tr key={index}>
              <td>
                <input type="checkbox" />
              </td>
              <td>{user.id}</td>
              <td>{user.fullName}</td>
              <td>{user.email}</td>
              <td>{user.address}</td>
              <td>{user.joined}</td>
              <td>{user.permission}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserList;
