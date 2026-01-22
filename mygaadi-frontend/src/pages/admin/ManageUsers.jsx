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
    <div className="container mt-4">
      <h3>Manage Users</h3>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {users
            .filter((u) => u.role !== "ADMIN")
            .map((u) => (
              <tr key={u.userId}>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  {u.restricted ? "Restricted ❌" : "Active ✅"}
                </td>
                <td>
                  <button
                    className={`btn btn-sm ${
                      u.restricted ? "btn-success" : "btn-danger"
                    }`}
                    onClick={() => toggleUser(u.userId)}
                  >
                    {u.restricted ? "Unrestrict" : "Restrict"}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageUsers;
