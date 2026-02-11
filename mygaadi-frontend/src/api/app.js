import axios from "axios";

const apiHost = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
console.log("Connecting to API at:", apiHost);

const api = axios.create({
  baseURL: apiHost,
});

// 🔐 Attach JWT to every request
api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("mygaadi_user");

    if (storedUser) {
      const user = JSON.parse(storedUser);

      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
