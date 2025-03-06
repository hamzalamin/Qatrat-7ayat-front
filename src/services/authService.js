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
          window.dispatchEvent(new Event("authChange"));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
    window.dispatchEvent(new Event("authChange")); 
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
    return JSON.parse(localStorage.getItem('user'));
  }

  isAuthenticated() {
    const user = this.getCurrentUser();
    return !!user && !!user.token;
  }

  async getUserProfile() {
    const user = this.getCurrentUser();
    if (user && user.token) {
      const response = await axiosClient.get('v1/profile', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return response.data;
    }
    return null;
  }
}

export default new AuthService();