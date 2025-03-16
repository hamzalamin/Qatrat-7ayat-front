import { axiosClient } from '../config/axios';

const API_URL = 'v1/admin/roles'; 

class RoleService {

  getRoles(pageNumber, size) {
    return axiosClient.get(`${API_URL}?pageNumber=${pageNumber}&size=${size}`);
  }

  getArticleById(id) {
    return axiosClient.get(`${API_URL}/${id}`);
  }
  
  createRole(requestData) {
    return axiosClient.post(`${API_URL}`, requestData);
  }

  
  updateRole(requestData, id) {
    return axiosClient.put(`${API_URL}/${id}`, requestData);
  }

  deleteRole(id) {
    return axiosClient.delete(`${API_URL}/${id}`);
  }
}

export default new RoleService();