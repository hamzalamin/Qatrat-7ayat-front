import axios from 'axios';

const API_URL = 'http://localhost:8081/api/v1/hospitals'; 

class HospitalService {
  getHospitals(pageNumber, size) {
    return axios.get(`${API_URL}?pageNumber=${pageNumber}&size=${size}`);
  }
}

export default new HospitalService();