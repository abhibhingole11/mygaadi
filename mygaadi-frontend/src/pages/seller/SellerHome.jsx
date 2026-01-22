import { Link, Outlet } from "react-router-dom";

const SellerHome = () => {
  console.log("SellerHome rendered");

  return (
    <div className="container mt-4">
      <h2>Seller Dashboard</h2>

      <Link to="list-car" className="btn btn-success mt-3">
        List a New Car
      </Link>

      <hr />

      {/* 👇 THIS IS REQUIRED */}
      <Outlet />
    </div>
  );
};

export default SellerHome;
