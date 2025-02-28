import axios from 'axios';

const setupAuthInterceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle 401 Unauthorized responses
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('user');
        // Optionally redirect to login page
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

export default setupAuthInterceptor;