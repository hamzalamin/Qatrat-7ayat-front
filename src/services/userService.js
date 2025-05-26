import { axiosClient } from '../config/axios';

const API_URL = 'v1/users'; 

class UserService   {

  getAll() {
    return axiosClient.get(`${API_URL}`);
  }

}

export default new UserService   ();