import { axiosClient } from '../config/axios';

const API_URL = 'v1/articles'; 

class ArticleService {
  get(pageNumber, size) {
    return axiosClient.get(`${API_URL}?pageNumber=${pageNumber}&size=${size}`);
  }

  getArticleById(id) {
    return axiosClient.get(`${API_URL}/${id}`);
  }
  

}

export default new ArticleService();