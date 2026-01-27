import { useEffect, useState } from "react";
import api from "../../api/app";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const res = await api.get("/api/admin/users");
    setUsers(res.data);
  };

  const toggleUser = async (userId) => {
    await api.put(`/api/admin/users/${userId}/toggle-restrict`);
    loadUsers();
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="container mt-4 pb-5">
      <div className="admin-page-header">
        <h2 className="fw-bold mb-2">User Management</h2>
        <p className="mb-0 opacity-75">View and manage platform users. You can restrict access for buyers and sellers here.</p>
      </div>

      <div className="premium-table-container">
        <table className="premium-table">
          <thead>
            <tr>
              <th>User Email</th>
              <th>Account Role</th>
              <th>Current Status</th>
              <th className="text-end">Management Actions</th>
            </tr>
          </thead>

          <tbody>
            {users
              .filter((u) => u.role !== "ADMIN")
              .map((u) => (
                <tr key={u.userId}>
                  <td className="fw-medium">{u.email}</td>
                  <td>
                    <span className="badge bg-light text-dark border">{u.role}</span>
                  </td>
                  <td>
                    <span className={`status-badge ${u.restricted ? "status-restricted" : "status-active"}`}>
                      {u.restricted ? "Restricted" : "Active"}
                    </span>
                  </td>
                  <td className="text-end">
                    <button
                      className={`btn btn-sm ${u.restricted ? "btn-success" : "btn-danger"
                        } px-3 rounded-pill`}
                      onClick={() => toggleUser(u.userId)}
                    >
                      {u.restricted ? "Unrestrict User" : "Restrict User"}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
