import { useEffect, useState } from "react";
import api from "../../api/app";
import { useAuth } from "../../utils/AuthContext";
import { toast } from "react-toastify";

const Sales = () => {
    const { user } = useAuth();
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSales = async () => {
        try {
            const res = await api.get(`/api/seller/cars/sales/${user.userId}`);
            setSales(res.data);
        } catch (err) {
            console.error("Failed to fetch sales", err);
            toast.error("Failed to load sales data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user && user.userId) {
            fetchSales();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="fw-bold">My Sales & Revenue</h2>
                <div className="badge bg-success p-2 fs-6">
                    Total Sold: {sales.length}
                </div>
            </div>

            {sales.length === 0 ? (
                <div className="card p-5 text-center shadow-sm border-0" style={{ borderRadius: "15px" }}>
                    <h4 className="text-muted">No sales yet</h4>
                    <p className="mb-0">Your sold cars will appear here once a buyer completes a purchase.</p>
                </div>
            ) : (
                <div className="card shadow-sm border-0" style={{ borderRadius: "15px" }}>
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead className="table-light">
                                <tr>
                                    <th className="px-4 py-3">Car Details</th>
                                    <th className="py-3">Price</th>
                                    <th className="py-3">Buyer Name</th>
                                    <th className="py-3">Contact</th>
                                    <th className="py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sales.map((sale) => (
                                    <tr key={sale.transactionId}>
                                        <td className="px-4 py-3">
                                            <div className="fw-bold">{sale.carMake} {sale.carModel}</div>
                                            <small className="text-muted">ID: #{sale.transactionId}</small>
                                        </td>
                                        <td className="py-3 fw-bold text-success">
                                            ₹{sale.carPrice.toLocaleString()}
                                        </td>
                                        <td className="py-3">{sale.buyerName}</td>
                                        <td className="py-3">
                                            <div><i className="bi bi-envelope me-1"></i> {sale.buyerEmail}</div>
                                            <div className="text-muted"><i className="bi bi-telephone me-1"></i> {sale.buyerPhone || "N/A"}</div>
                                        </td>
                                        <td className="py-3">
                                            {new Date(sale.purchasedAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sales;
