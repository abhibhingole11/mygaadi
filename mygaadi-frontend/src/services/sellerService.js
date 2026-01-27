import api from "../api/app";

// Add a new car
const addCar = async (carData) => {
    return await api.post("/api/seller/cars", carData);
};

// Get all cars for a specific seller
const getSellerCars = async (sellerId) => {
    const response = await api.get(`/api/seller/cars/${sellerId}`);
    return response.data;
};

// Update an existing car
const updateCar = async (carId, carData) => {
    return await api.put(`/api/seller/cars/update/${carId}`, carData);
};

// Delete a car
const deleteCar = async (carId) => {
    return await api.delete(`/api/seller/cars/delete/${carId}`);
};

export default {
    addCar,
    getSellerCars,
    updateCar,
    deleteCar,
};
