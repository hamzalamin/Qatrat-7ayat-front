import { axiosClient } from "../config/axios";

class ProfileService {
  async getProfile() {
    const response = await axiosClient.get("v1/profile");
    return response.data;
  }

  async updateProfile(profileId, profileData) {
    const response = await axiosClient.put(`v1/profile/${profileId}`, profileData);
    return response.data;
  }

  async deleteProfile(profileId) {
    const response = await axiosClient.delete(`v1/profile/${profileId}`);
    return response.data;
  }

  async changePassword(profileId, oldPassword, newPassword) {
    const response = await axiosClient.put(`v1/profile/change-password/${profileId}`, {
      oldPassword,
      newPassword,
    });
    return response.data;
  }
}

export default new ProfileService();