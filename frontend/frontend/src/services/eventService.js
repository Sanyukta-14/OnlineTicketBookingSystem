import axiosInstance from "../api/axiosConfig";

export const getAllEvents = async () => {
  const response = await axiosInstance.get("/api/events");
  return response.data;
};

export const createEvent = async (eventData) => {
  const response = await axiosInstance.post("/api/events", eventData);
  return response.data;
};

export const deleteEvent = async (id) => {
  const response = await axiosInstance.delete(`/api/events/${id}`);
  return response.data;
};

export const updateEvent = async (id, eventData) => {
  const response = await axiosInstance.put(`/api/events/${id}`, eventData);
  return response.data;
};