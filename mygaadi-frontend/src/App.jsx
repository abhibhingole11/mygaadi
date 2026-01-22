import Home from "./pages/common/Home";
import Navbar from "./components/Navbar";
import { Routes,Route } from "react-router-dom";
import Login from "./pages/common/Login";
import Register from "./pages/common/Register";
import CarDetails from "./pages/buyer/CarDetails";
import Wishlist from "./pages/buyer/Wishlist";
import ListCar from "./pages/seller/ListCar";
import React from "react";
import ProtectedRoute from "./utils/ProtectedRoute";
import BuyerHome from "./pages/buyer/BuyerHome";
import SellerHome from "./pages/seller/SellerHome";
import AdminHome from "./pages/admin/AdminHome";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageCars from "./pages/admin/ManageCars";
import ViewReports from "./pages/admin/ViewReports";




function App() {
  return (
    <div>
      <Navbar/>
        

         <Routes>
          <Route path="/" element={<Home/>} />
          <Route  path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/car/:id" element={<CarDetails/>}/>
          <Route path="/wishlist" element={<Wishlist />} />
          
          
          
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
    </div>
  );
}

export default App;
