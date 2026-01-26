import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
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
