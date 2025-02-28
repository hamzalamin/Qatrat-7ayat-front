import axios from 'axios';

const API_URL = 'http://localhost:8081/api/auth/';

class AuthService {
  login(email, password) {
    return axios
      .post(API_URL + 'signin', {
        email,
        password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
  }

  register(userData) {
    return axios.post(API_URL + 'signup', {
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
}

export default new AuthService();