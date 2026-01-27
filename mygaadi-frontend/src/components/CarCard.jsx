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
    <div className="card card-premium h-100">
      {/* IMAGE */}
      <img
        src={car.image || "/images/default-car.jpg"}
        alt={car.name}
        className="card-img-top"
        style={{
          height: "220px",
          objectFit: "cover"
        }}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/images/default-car.jpg";
        }}
      />

      {/* BODY */}
      <div className="card-body d-flex flex-column">
        <h5 className="fw-bold mb-1">{car.name}</h5>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <span className="badge bg-light text-dark border">{car.year}</span>
          <h6 className="text-primary fw-bold mb-0">₹ {parseInt(car.price).toLocaleString()}</h6>
        </div>

        <div className="mt-auto d-grid gap-2">
          {/* VIEW */}
          {onView && (
            <button
              className="btn btn-outline-premium w-100"
              onClick={() => onView(car)}
            >
              View Details
            </button>
          )}

          {/* BUY */}
          {showBuy && onBuy && (
            <button
              className="btn btn-premium w-100"
              onClick={() => onBuy(car)}
            >
              Buy Now
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
