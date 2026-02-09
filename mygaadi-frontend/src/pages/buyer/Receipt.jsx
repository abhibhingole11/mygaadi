import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";
import api from "../../api/app";
import { toast } from "react-toastify";

const Receipt = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    const car = state?.car;

    if (!car) {
        return (
            <div className="container mt-5 text-center">
                <h3>No car selected for purchase.</h3>
                <button className="btn btn-premium mt-3" onClick={() => navigate("/")}>
                    Go Back Home
                </button>
            </div>
        );
    }

    // Tax Logic (Calculated locally as requested to avoid 403 errors)
    const basePrice = parseFloat(car.price);
    const gstRate = 0.18; // 18% GST
    const registrationRate = 0.02; // 2% Registration Fee
    const serviceFee = 5000; // Flat service fee

    const gst = basePrice * gstRate;
    const registration = basePrice * registrationRate;
    const totalAmount = basePrice + gst + registration + serviceFee;

    const handleConfirmPurchase = async () => {
        if (!user) {
            toast.info("Please login to proceed");
            navigate("/login");
            return;
        }

        try {
            // 1. Create order on backend with the totalAmount calculated above
            const orderRes = await api.post(`/api/buyer/buy/create-order/${car.carId}?amount=${totalAmount}`);
            const orderId = orderRes.data;

            // 2. Configure Razorpay options
            // Important: amount here must match the order amount in backend
            const paymentAmount = Math.round(totalAmount * 100);
            const cappedAmount = paymentAmount > 5000000 ? 5000000 : paymentAmount;

            const options = {
                key: "rzp_test_SC1xMbhAbQJNMK",
                amount: cappedAmount, // Capped at ₹50,000 for test mode compatibility
                currency: "INR",
                name: "MyGaadi",
                description: `Purchase ${car.make} ${car.model}`,
                order_id: orderId,
                handler: async (response) => {
                    try {
                        // 3. Verify payment on backend
                        const verifyRes = await api.post("/api/buyer/buy/verify", {
                            buyerId: user.userId,
                            carId: car.carId,
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        });

                        toast.success(verifyRes.data || "Car purchased successfully!");
                        navigate("/");
                    } catch (err) {
                        console.error(err);
                        toast.error("Payment verification failed");
                    }
                },
                prefill: {
                    name: user.firstName + " " + user.lastName,
                    email: user.email,
                },
                theme: {
                    color: "#3399cc",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on("payment.failed", (response) => {
                toast.error("Payment Failed: " + response.error.description);
            });
            rzp.open();

        } catch (err) {
            console.error(err);
            toast.error("Unable to initiate purchase");
        }
    };

    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-lg border-0" style={{ borderRadius: "20px", overflow: "hidden" }}>
                        <div className="bg-premium p-4 text-white text-center">
                            <h2 className="mb-0">Purchase Receipt</h2>
                            <p className="mb-0 opacity-75">Secure Your Dream Car</p>
                        </div>

                        <div className="card-body p-4">
                            <div className="car-info mb-4 text-center">
                                <img
                                    src={car.image || car.imageUrl || "/images/default-car.jpg"}
                                    alt={car.make}
                                    className="img-fluid rounded mb-3"
                                    style={{ maxHeight: "200px", objectFit: "cover", width: "100%" }}
                                />
                                <h4 className="fw-bold">{car.make} {car.model}</h4>
                                <span className="badge bg-light text-dark border">{car.year}</span>
                            </div>

                            <hr />

                            <div className="seller-details mb-4">
                                <h6 className="text-muted text-uppercase small fw-bold">Seller Information</h6>
                                <div className="d-flex justify-content-between">
                                    <span>Name:</span>
                                    <span className="fw-bold">{car.sellerName || "Verified Seller"}</span>
                                </div>
                            </div>

                            <div className="price-breakdown mb-4">
                                <h6 className="text-muted text-uppercase small fw-bold">Price Details</h6>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Base Price:</span>
                                    <span>₹ {basePrice.toLocaleString()}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>GST (18%):</span>
                                    <span>₹ {gst.toLocaleString()}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Registration (2%):</span>
                                    <span>₹ {registration.toLocaleString()}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Service Fee:</span>
                                    <span>₹ {serviceFee.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="total-section p-3 bg-light rounded d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0 fw-bold">Total Amount:</h5>
                                <h4 className="mb-0 text-primary fw-bold">₹ {totalAmount.toLocaleString()}</h4>
                            </div>

                            <div className="d-grid gap-2">
                                <button className="btn btn-premium btn-lg" onClick={handleConfirmPurchase}>
                                    Confirm & Buy Car 🚗
                                </button>
                                <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
                                    Cancel
                                </button>
                            </div>
                        </div>

                        <div className="card-footer bg-white text-center py-3 border-0">
                            <small className="text-muted">By clicking "Confirm & Buy Car", you agree to our Terms & Conditions.</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Receipt;
