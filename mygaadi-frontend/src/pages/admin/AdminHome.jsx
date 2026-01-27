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
    <div className="container mt-4 pb-5">
      <div className="admin-page-header">
        <h1 className="fw-bold mb-2">Admin Dashboard</h1>
        <p className="mb-0 opacity-75">Welcome back! Manage your users, car listings and system reports from here.</p>
      </div>

      <div className="row g-4">
        {/* Manage Users */}
        <div className="col-md-4">
          <div className="admin-card" onClick={() => navigate("/admin/users")}>
            <div className="icon-wrapper">
              <i className="bi bi-people-fill">👥</i>
            </div>
            <h4 className="fw-bold">Manage Users</h4>
            <p className="text-muted">Restrict or unrestrict buyers and sellers</p>
            <button className="btn btn-premium mt-2">Go to Users</button>
          </div>
        </div>

        {/* Approve Cars */}
        <div className="col-md-4">
          <div className="admin-card" onClick={() => navigate("/admin/cars")}>
            <div className="icon-wrapper">
              <i className="bi bi-car-front-fill">🚗</i>
            </div>
            <h4 className="fw-bold">Inventory Control</h4>
            <p className="text-muted">Review, approve or reject car listings</p>
            <button className="btn btn-premium mt-2">Manage Cars</button>
          </div>
        </div>

        {/* Reports */}
        <div className="col-md-4">
          <div className="admin-card" onClick={() => navigate("/admin/reports")}>
            <div className="icon-wrapper">
              <i className="bi bi-graph-up">📊</i>
            </div>
            <h4 className="fw-bold">System Reports</h4>
            <p className="text-muted">View platform statistics and performance</p>
            <button className="btn btn-premium mt-2">View Reports</button>
          </div>
        </div>
      </div>

      {/* Quick Stats Summary if needed */}
      {stats && (
        <div className="mt-5">
          <h3 className="fw-bold mb-4">Quick Insights</h3>
          <div className="row g-4 text-center">
            <div className="col-md-3">
              <div className="stat-item-premium">
                <h2 className="fw-bold text-primary">{stats.totalUsers}</h2>
                <span className="text-muted">Total Users</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item-premium">
                <h2 className="fw-bold text-success">{stats.totalCars}</h2>
                <span className="text-muted">Active Listings</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item-premium">
                <h2 className="fw-bold text-warning">{stats.pendingCars}</h2>
                <span className="text-muted">Pending Approval</span>
              </div>
            </div>
            <div className="col-md-3">
              <div className="stat-item-premium">
                <h2 className="fw-bold text-danger">₹{stats.totalSales?.toLocaleString()}</h2>
                <span className="text-muted">Total Sales</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHome;
