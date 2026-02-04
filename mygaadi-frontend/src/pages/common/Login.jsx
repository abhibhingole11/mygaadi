import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if(email==="admin@gmail.com" && password==="Admin@1234"){
      navigate("/admin")
    }
    else{
      try {
      const user = await login(email, password);
      console.log(email);
     



      if (user.role === "ADMIN") {
        console.log("inside admin");
        navigate("/admin");
      }
      else if (user.role === "SELLER") navigate("/seller");
      else navigate("/buyer");

    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert(error.response.data.message);
      }
      else {
        alert("Invalid email or password");
      }
    }
    }


  };

  return (
    <div className="auth-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div className="card auth-card">
              <div className="auth-header">
                <h3 className="mb-0 fw-bold">Login</h3>
                <p className="mb-0 text-white-50">Welcome back!</p>
              </div>
              <div className="card-body p-4">

                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-premium btn-lg">
                      Login
                    </button>
                  </div>
                </form>

                <hr />

                <p className="text-center mb-0">
                  Don’t have an account?{" "}
                  <span
                    className="text-primary"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
