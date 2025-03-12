import { axiosClient } from "../config/axios";

const API_URL = 'auth/';

class AuthService {
  async login(email, password) {
    const response = await axiosClient.post(API_URL + 'signin', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
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
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  async getUserProfile() {
    const token = localStorage.getItem('token');
    if (token) {
      const response = await axiosClient.get('v1/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    }
    return null;
  }
}

export default new AuthService();