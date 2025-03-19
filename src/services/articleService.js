import { axiosClient } from "../config/axios";

const API_URL = "v1/articles";

class ArticleService {
  get(pageNumber, size) {
    return axiosClient.get(`${API_URL}?pageNumber=${pageNumber}&size=${size}`);
  }

  getArticleById(id) {
    return axiosClient.get(`${API_URL}/${id}`);
  }

  create(requestData) {
    return axiosClient.post(`${API_URL}`, requestData);
  }

  update(requestData, id) {
    return axiosClient.put(`${API_URL}/${id}`, requestData);
  }

  updateStatus(id) {
    return axiosClient.put(`${API_URL}/status/${id}`);
  }

  delete(id) {
    return axiosClient.delete(`${API_URL}/${id}`);
  }
}

export default new ArticleService();
