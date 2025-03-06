import { axiosClient } from '../config/axios';

const API_URL = 'v1/cities'; 

class CityService {
  getCities(pageNumber, size) {
    return axiosClient.get(`${API_URL}?pageNumber=${pageNumber}&size=${size}`);
  }
}

export default new CityService();