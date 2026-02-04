import { useNavigate } from "react-router-dom";
import CarCard from "../../components/CarCard";

const Home = () => {
  const navigate = useNavigate();

  // 🔹 Static demo cars for visitors
  const cars = [
    {
      id: 1,
      name: "Mahindra Thar",
      price: "15,00,000",
      image: "",
    },
    {
      id: 2,
      name: "Maruti Swift",
      price: "7,50,000",
      image: "",
    },
    {
      id: 3,
      name: "Mahindra Scorpio N",
      price: "18,00,000",
      image: "",
    },
  ];

  // 🔐 Visitor action → Register
  const redirectToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="container my-5">
      <div className="text-center mb-5">
        <h1 className="fw-bold">Find Your Perfect Car</h1>
        <p className="text-muted">
          Browse cars. Sign up to buy or save your favorites.
        </p>
      </div>

      <div className="row">
        {cars.map((car) => (
          <div className="col-md-4 mb-4" key={car.id}>
            <CarCard
              car={car}
              onView={redirectToRegister}
              onBuy={redirectToRegister}
              onWishlist={redirectToRegister}
              
            />
            window.alert("need to register first");
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
