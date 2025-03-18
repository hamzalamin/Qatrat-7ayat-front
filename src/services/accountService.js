import { axiosClient } from '../config/axios';

const API_URL = 'v1/admin/accounts'; 

class AccountService   {

  get(pageNumber, size) {
    return axiosClient.get(`${API_URL}?pageNumber=${pageNumber}&size=${size}`);
  }

  getById(id) {
    return axiosClient.get(`${API_URL}/${id}`);
  }
  
  create(requestData) {
    return axiosClient.post(`${API_URL}`, requestData);
  }

  toggleUserSuspension(id) {
    return axiosClient.patch(`${API_URL}/${id}`);
  }

  
  update(requestData, id) {
    return axiosClient.put(`${API_URL}/${id}`, requestData);
  }

  delete(id) {
    return axiosClient.delete(`${API_URL}/${id}`);
  }
}

export default new AccountService   ();