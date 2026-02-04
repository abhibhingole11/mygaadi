import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/app";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("mygaadi_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // clear old user
      localStorage.removeItem("mygaadi_user");
      setUser(null);

      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      setUser(response.data);
      localStorage.setItem("mygaadi_user", JSON.stringify(response.data));
      return response.data;

    } catch (error) {
      // 🔥 IMPORTANT: rethrow axios error
      throw error;
    }
  };



  // 🚪 Logout
  const logout = () => {

    localStorage.removeItem("mygaadi_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
