import axios from "axios";

const API_URL = "http://localhost:8081/api/v1/";

class DonorService {
  getAllDonors(pageNumber, size) {
    return axios.get(API_URL + "donors", {
      params: {
        pageNumber: pageNumber,
        size: size,
      },
    });
  }
}

export default new DonorService();