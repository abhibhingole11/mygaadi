import { useEffect, useState } from "react";
import api from "../../api/app";
import AdminStats from "../../components/AdminStats";

const ViewReports = () => {
  const [stats, setStats] = useState(null);

  const loadStats = async () => {
    const res = await api.get("/api/admin/reports/stats");
    setStats(res.data);
  };

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="container mt-4 pb-5">
      <div className="admin-page-header">
        <h2 className="fw-bold mb-2">Platform Performance Reports</h2>
        <p className="mb-0 opacity-75">Detailed overview of system growth, user activity, and sales analytics.</p>
      </div>

      {stats ? (
        <AdminStats stats={stats} />
      ) : (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Generating your reports...</p>
        </div>
      )}
    </div>
  );
};

export default ViewReports;
