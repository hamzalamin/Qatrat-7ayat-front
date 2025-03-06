import { axiosClient } from "../config/axios";


class DonorService {
    getAllDonors(pageNumber, size) {
      return axiosClient.get("v1/donors", {
        params: {
          pageNumber: pageNumber,
          size: size,
        },
      });
    }

  createDonor(donorData) {
    return axiosClient.post("v1/donors", donorData);
  }
}

export default new DonorService();