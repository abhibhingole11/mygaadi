import { useNavigate } from "react-router-dom";

const CarCard = ({ car, onBuy, onWishlist }) => {
  const navigate = useNavigate();

  return (
    <div className="card h-100 shadow-sm">
      {car.image && (
        <img
          src={car.image}
          className="card-img-top"
          alt={`${car.make} ${car.model}`}
          style={{ height: "160px", objectFit: "cover" }}
        />
      )}

      <div className="card-body">
        <h5 className="card-title">
          {car.make} {car.model}
        </h5>

        <p className="card-text mb-1">
          <strong>Year:</strong> {car.year}
        </p>
        <p className="card-text mb-2">
          <strong>Price:</strong> ₹{car.price}
        </p>

        <div className="d-grid gap-2">
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() =>
              navigate(`/car/${car.carId}`, { state: { car } })
            }
          >
            View Details
          </button>

          {onBuy && (
            <button
              className="btn btn-success btn-sm"
              onClick={() => onBuy(car.carId)}
            >
              Buy Now
            </button>
          )}

          {onWishlist && (
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => onWishlist(car.carId)}
            >
              ❤️ Add to Wishlist
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarCard;
