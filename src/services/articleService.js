import { axiosClient } from "../config/axios";

const API_URL = "v1";

class ArticleService {
  get(pageNumber, size) {
    return axiosClient.get(`${API_URL}/articles?pageNumber=${pageNumber}&size=${size}`);
  }

  getMyArticles(pageNumber, size) {
    return axiosClient.get(`${API_URL}/my-articles?pageNumber=${pageNumber}&size=${size}`);
  }

  getArticleById(id) {
    return axiosClient.get(`${API_URL}/articles/${id}`);
  }

  create(requestData) {
    return axiosClient.post(`${API_URL}/articles`, requestData);
  }

  update(requestData, id) {
    return axiosClient.put(`${API_URL}/articles/${id}`, requestData);
  }

  updateStatus(id) {
    return axiosClient.put(`${API_URL}/articles/status/${id}`);
  }

  delete(id) {
    return axiosClient.delete(`${API_URL}/articles/${id}`);
  }
}

export default new ArticleService();
