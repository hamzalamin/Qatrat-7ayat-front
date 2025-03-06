import { axiosClient } from "../config/axios";


class RequestService {
    getAllRequests(pageNumber, size) {
      return axiosClient.get("v1/blood-requests", {
        params: {
          pageNumber: pageNumber,
          size: size,
        },
      });
    }

  createRequest(requestData) {
    return axiosClient.post("v1/blood-requests", requestData);
  }
}

export default new RequestService();