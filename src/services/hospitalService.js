import axios from 'axios';
import { axiosClient } from '../config/axios';

class HospitalService {
  getHospitals(pageNumber, size) {
    return axiosClient.get(`v1/hospitals?pageNumber=${pageNumber}&size=${size}`);
  }
}

export default new HospitalService();