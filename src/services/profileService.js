import { axiosClient } from "../config/axios";

class ProfileService {
  getProfile() {
    return axiosClient.get("v1/profile");
  }

  updateProfile(profileId, profileData) {
    return axiosClient.put(`v1/profile/${profileId}`, profileData);
  }

  deleteProfile(profileId) {
    return axiosClient.delete(`v1/profile/${profileId}`);
  }

  changePassword(profileId, oldPassword, newPassword) {
    return axiosClient.put(`v1/profile/change-password/${profileId}`, {
      oldPassword,
      newPassword
    });
  }
}

export default new ProfileService();