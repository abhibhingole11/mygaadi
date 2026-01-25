const CarCard = ({
  car,
  onView,
  onBuy,
  onWishlist,
  showBuy = true,
  showWishlist = true,
  isWishlisted = false
}) => {
 
  return (
    <div className="card h-100 shadow-sm border-0">
      {/* IMAGE */}
      <img
        src={car.image || "/images/default-car.jpg"}
        alt={car.name}
        className="card-img-top"
        style={{
          height: "190px",
          objectFit: "cover"
        }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/images/default-car.jpg";
        }}
      />

      {/* BODY */}
      <div className="card-body d-flex flex-column">
        <h5 className="fw-semibold">{car.name}</h5>
        <p className="text-muted mb-3">₹ {car.price}</p>

        <div className="mt-auto d-grid gap-2">
          {/* VIEW */}
          {onView && (
            <button
              className="btn btn-outline-dark btn-sm"
              onClick={() => onView(car)}
            >
              View Details
            </button>
          )}

          {/* BUY */}
          {showBuy && onBuy && (
            <button
              className="btn btn-dark btn-sm"
              onClick={() => onBuy(car)}
            >
              Buy Car
            </button>
          )}

          {/* WISHLIST */}
          {showWishlist && (
            isWishlisted ? (
              <button
                className="btn btn-secondary btn-sm"
                disabled
              >
                ❤️ Wishlisted
              </button>
            ) : (
              onWishlist && (
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => onWishlist(car)}
                >
                  ♡ Add to Wishlist
                </button>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CarCard;
