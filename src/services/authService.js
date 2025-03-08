import { axiosClient } from "../config/axios";

const API_URL = 'auth/';

class AuthService {
  login(email, password) {
    return axiosClient
      .post(API_URL + 'signin', {
        email,
        password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('user', JSON.stringify(response.data));
          window.dispatchEvent(new Event('authChange'));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token'); // Clear token
    window.dispatchEvent(new Event('authChange'));
  }

  register(userData) {
    return axiosClient.post(API_URL + 'signup', {
      firstName: userData.firstName,
      lastName: userData.lastName,
      psudoName: userData.pseudoName,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      bloodType: userData.bloodType,
      gender: userData.gender,
      cityId: userData.city,
      isFirstTimeDonor: userData.isFirstTimeDonor,
      hasChronicDiseases: userData.hasChronicDiseases
    });
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null; // Handle null case
  }

  isAuthenticated() {
    return !!localStorage.getItem('token'); // Check for token directly
  }

  async getUserProfile() {
    const token = localStorage.getItem('token');
    if (token) {
      const response = await axiosClient.get('v1/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    }
    return null;
  }

  clearAuth() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.dispatchEvent(new Event('authChange'));
  }
}

export default new AuthService();