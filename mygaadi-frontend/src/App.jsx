import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

import { useAuth } from "./utils/AuthContext";
import Login from "./pages/common/Login";
import Register from "./pages/common/Register";
import CarDetails from "./pages/buyer/CarDetails";
import Wishlist from "./pages/buyer/Wishlist";
import ListCar from "./pages/seller/ListCar";
import React from "react";
import ProtectedRoute from "./utils/ProtectedRoute";
import BuyerHome from "./pages/buyer/BuyerHome";
import SellerHome from "./pages/seller/SellerHome";
import Sales from "./pages/seller/Sales";
import EditCar from "./pages/seller/EditCar";
import AdminHome from "./pages/admin/AdminHome";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageCars from "./pages/admin/ManageCars";
import ViewReports from "./pages/admin/ViewReports";
import ToastProvider from "./components/ToastProvider";

const HomeRedirector = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <BuyerHome />; // Visitors see BuyerHome data
  }

  // Redirect to dashboard based on role
  if (user.role === "ADMIN") return <AdminHome />;
  if (user.role === "SELLER") return <SellerHome />;

  return <BuyerHome />;
};

function App() {

  return (
    <div>
      <Navbar />


      <Routes>
        <Route path="/" element={<HomeRedirector />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/car/:id"
          element={
            <ProtectedRoute allowedRoles={["BUYER", "SELLER", "ADMIN"]}>
              <CarDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute allowedRoles={["BUYER"]}>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller"
          element={
            <ProtectedRoute allowedRoles={["SELLER"]}>
              <SellerHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/seller/list-car"
          element={
            <ProtectedRoute allowedRoles={["SELLER"]}>
              <ListCar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/edit-car/:carId"
          element={
            <ProtectedRoute allowedRoles={["SELLER"]}>
              <EditCar />
            </ProtectedRoute>
          }
        />
        <Route
          path="/seller/sales"
          element={
            <ProtectedRoute allowedRoles={["SELLER"]}>
              <Sales />
            </ProtectedRoute>
          }
        />
        <Route
          path="/buyer"
          element={
            <ProtectedRoute allowedRoles={["BUYER"]}>
              <BuyerHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminHome />
            </ProtectedRoute>
          }
        />



        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ManageUsers />
            </ProtectedRoute>
          }
        />


        <Route
          path="/admin/cars"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ManageCars />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <ViewReports />
            </ProtectedRoute>
          }
        />

      </Routes>

      <ToastProvider />
    </div>
  );
}

export default App;
