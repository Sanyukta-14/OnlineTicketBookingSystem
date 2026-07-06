import axiosInstance from "../api/axiosConfig";

export const login = async (email, password) => {
  const response = await axiosInstance.post("/api/users/login", {
    email,
    password,
  });

  return response.data;
};