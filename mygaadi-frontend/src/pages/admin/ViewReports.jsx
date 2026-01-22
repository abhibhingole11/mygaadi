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
    <div className="container mt-4">
      <h2 className="mb-4">System Reports</h2>

      {stats ? <AdminStats stats={stats} /> : <p>Loading reports...</p>}
    </div>
  );
};

export default ViewReports;
