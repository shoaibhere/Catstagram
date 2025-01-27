import axios from "axios";

const API_URL ="https://catstagram-production.up.railway.app/api/profile"

export const updateProfile = async (formData, id) => {
  try {
    const response = await axios.put(
      `${API_URL}/update-profile/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const getProfileById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/getProfile/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting profile by ID:", error);
    throw error;
  }
};

export const getUserStats = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/stats/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error getting user stats:", error);
    throw error;
  }
};

export const deleteAccount = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-account/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};