const AdminStats = ({ stats }) => {
  return (
    <div className="row">
      <div className="col-md-4 mb-3">
        <div className="card text-center shadow">
          <div className="card-body">
            <h5>Total Users</h5>
            <h3>{stats.totalUsers}</h3>
          </div>
        </div>
      </div>

      <div className="col-md-4 mb-3">
        <div className="card text-center shadow">
          <div className="card-body">
            <h5>Buyers</h5>
            <h3>{stats.buyers}</h3>
          </div>
        </div>
      </div>

      <div className="col-md-4 mb-3">
        <div className="card text-center shadow">
          <div className="card-body">
            <h5>Sellers</h5>
            <h3>{stats.sellers}</h3>
          </div>
        </div>
      </div>

      <div className="col-md-4 mb-3">
        <div className="card text-center shadow">
          <div className="card-body">
            <h5>Total Cars</h5>
            <h3>{stats.totalCars}</h3>
          </div>
        </div>
      </div>

      <div className="col-md-4 mb-3">
        <div className="card text-center shadow">
          <div className="card-body">
            <h5>Sold Cars</h5>
            <h3>{stats.soldCars}</h3>
          </div>
        </div>
      </div>

      <div className="col-md-4 mb-3">
        <div className="card text-center shadow">
          <div className="card-body">
            <h5>Available Cars</h5>
            <h3>{stats.availableCars}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;
