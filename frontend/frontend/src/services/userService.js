import axiosInstance from "../api/axiosConfig";

export const getAllUsers = async () => {
  const response = await axiosInstance.get("/api/users");
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axiosInstance.post("/api/users", userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await axiosInstance.put(`/api/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axiosInstance.delete(`/api/users/${id}`);
  return response.data;
};