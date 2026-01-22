import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/app";
import AdminStats from "../../components/AdminStats";

const AdminHome = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);

  const loadStats = async () => {
    try {
      const res = await api.get("/api/admin/reports/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load admin stats", err);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Admin Dashboard</h2>

      {/* 🔹 QUICK ACTION BUTTONS */}
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <button
            className="btn btn-primary w-100 p-3"
            onClick={() => navigate("/admin/users")}
          >
            Manage Users
          </button>
        </div>

        <div className="col-md-4 mb-3">
          <button
            className="btn btn-warning w-100 p-3"
            onClick={() => navigate("/admin/cars")}
          >
            Approve / Reject Cars
          </button>
        </div>

        <div className="col-md-4 mb-3">
          <button
            className="btn btn-success w-100 p-3"
            onClick={() => navigate("/admin/reports")}
          >
            View Reports
          </button>
        </div>
      </div>

    </div>
  );
};

export default AdminHome;
