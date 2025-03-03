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

  createDonor(donorData) {
    return axios.post(API_URL + "donors", donorData);
  }
}

export default new DonorService();