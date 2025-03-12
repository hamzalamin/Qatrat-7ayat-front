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

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      
      switch (status) {
        case 401:
          localStorage.removeItem("user");
          window.location.href = "/unauthorized";
          break;
        
        case 403:
          window.location.href = "/forbidden";
          break;
        
        case 404:
          window.location.href = "/*"; 
          break;
          
        case 500:
          console.error("Server error:", error.response.data);
          break;
          
        default:
          console.error("Server error:", error.response.data);
          break;
      }
    } else if (error.request) {
      console.error("Network error:", error.request);
    } else {
      console.error("Error:", error.message);
    }
    
    return Promise.reject(error);
  }
);