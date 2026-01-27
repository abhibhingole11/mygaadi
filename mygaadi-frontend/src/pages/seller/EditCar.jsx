import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import sellerService from "../../services/sellerService";
import { useAuth } from "../../utils/AuthContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const EditCar = () => {
    const { user } = useAuth();
    const { state } = useLocation();
    const { carId } = useParams(); // URL param
    const navigate = useNavigate();

    const [carData, setCarData] = useState({
        make: "",
        model: "",
        year: "",
        price: "",
    });

    const [image, setImage] = useState(null);
    const [currentImage, setCurrentImage] = useState(null); // URL of existing image
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (state?.car) {
            // If we navigated here with state
            setCarData({
                make: state.car.make,
                model: state.car.model,
                year: state.car.year,
                price: state.car.price,
            });
            setCurrentImage(state.car.imageUrl || state.car.image);
            setLoading(false);
        } else {
            // Fetch if not in state (fallback)
            const fetchCar = async () => {
                try {
                    const cars = await sellerService.getSellerCars(user.userId);
                    const foundCar = cars.find((c) => c.id === parseInt(carId));
                    if (foundCar) {
                        setCarData({
                            make: foundCar.make,
                            model: foundCar.model,
                            year: foundCar.year,
                            price: foundCar.price,
                        });
                        setCurrentImage(foundCar.imageUrl || foundCar.image);
                    } else {
                        alert("Car not found");
                        navigate("/seller");
                    }
                } catch (error) {
                    console.error("Error fetching car:", error);
                    alert("Error fetching car details");
                } finally {
                    setLoading(false);
                }
            };
            if (user?.userId) {
                fetchCar();
            }
        }
    }, [state, carId, user, navigate]);

    const handleChange = (e) => {
        setCarData({
            ...carData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("make", carData.make);
        formData.append("model", carData.model);
        formData.append("year", carData.year);
        formData.append("price", carData.price);

        // Only append image if a new one is selected
        if (image) {
            formData.append("image", image);
        }

        try {
            await sellerService.updateCar(carId, formData);
            alert("Car updated successfully");
            navigate("/seller");
        } catch (error) {
            console.error(error);
            alert("Failed to update car");
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-3">Edit Car</h2>

            <form className="card p-4 shadow" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Make</label>
                    <input
                        className="form-control"
                        placeholder="Enter car make"
                        name="make"
                        value={carData.make}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Model</label>
                    <input
                        className="form-control"
                        placeholder="Enter car model"
                        name="model"
                        value={carData.model}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Year</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Enter manufacturing year"
                        name="year"
                        value={carData.year}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Price (₹)</label>
                    <input
                        type="number"
                        className="form-control"
                        placeholder="Enter price"
                        name="price"
                        value={carData.price}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Car Image {currentImage && "(Current)"}</label>
                    {currentImage && (
                        <div className="mb-2">
                            <img src={currentImage} alt="Current" style={{ width: "100px", height: "auto" }} />
                        </div>
                    )}
                    <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                    <small className="text-muted">Leave empty to keep current image</small>
                </div>

                <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                        Update Car
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate("/seller")}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditCar;
