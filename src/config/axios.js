import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "http://localhost:8081/api/",
});

axiosClient.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
