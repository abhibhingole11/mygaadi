const AdminStats = ({ stats }) => {
  return (
    <div className="row g-4">
      {/* User Stats Section */}
      <div className="col-12 mt-4">
        <h4 className="fw-bold mb-3">User Demographics</h4>
      </div>
      <div className="col-md-4">
        <div className="stat-item-premium text-center">
          <div className="display-5 fw-bold text-primary mb-1">{stats.totalUsers}</div>
          <div className="text-muted fw-medium">Total Registered Users</div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="stat-item-premium text-center">
          <div className="display-6 fw-bold text-dark mb-1">{stats.buyers}</div>
          <div className="text-muted fw-medium">Active Buyers</div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="stat-item-premium text-center">
          <div className="display-6 fw-bold text-dark mb-1">{stats.sellers}</div>
          <div className="text-muted fw-medium">Verified Sellers</div>
        </div>
      </div>

      {/* Inventory Stats Section */}
      <div className="col-12 mt-5">
        <h4 className="fw-bold mb-3">Inventory Performance</h4>
      </div>
      <div className="col-md-4">
        <div className="stat-item-premium text-center" style={{ borderLeft: "5px solid #0d6efd" }}>
          <div className="display-5 fw-bold text-primary mb-1">{stats.totalCars}</div>
          <div className="text-muted fw-medium">Total Cars cataloged</div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="stat-item-premium text-center" style={{ borderLeft: "5px solid #28a745" }}>
          <div className="display-6 fw-bold text-success mb-1">{stats.soldCars}</div>
          <div className="text-muted fw-medium">Successfully Sold</div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="stat-item-premium text-center" style={{ borderLeft: "5px solid #f59e0b" }}>
          <div className="display-6 fw-bold text-warning mb-1">{stats.availableCars}</div>
          <div className="text-muted fw-medium">Currently Available</div>
        </div>
      </div>

      {/* Financial Section if stats.totalSales exists */}
      {stats.totalSales !== undefined && (
        <div className="col-12 mt-5">
          <div className="stat-item-premium bg-dark text-white text-center py-5">
            <h5 className="opacity-75 mb-2">Total Platform Revenue</h5>
            <h1 className="display-3 fw-bold">₹{stats.totalSales?.toLocaleString()}</h1>
            <p className="mb-0 text-success fw-bold">↑ Growth this period</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStats;
