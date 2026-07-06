import axiosInstance from "../api/axiosConfig";

/* ==========================
   GET ALL BOOKINGS (ADMIN)
========================== */
export const getAllBookings = async () => {
  const response = await axiosInstance.get("/api/bookings");
  return response.data;
};

/* ==========================
   GET BOOKINGS BY USER
========================== */
export const getBookingsByUser = async (userId) => {
  const response = await axiosInstance.get(
    `/api/bookings/user/${userId}`
  );
  return response.data;
};

/* ==========================
   CREATE BOOKING
========================== */
export const createBooking = async (bookingData) => {
  const response = await axiosInstance.post(
    "/api/bookings",
    bookingData
  );
  return response.data;
};

/* ==========================
   UPDATE BOOKING
========================== */
export const updateBooking = async (id, bookingData) => {
  const response = await axiosInstance.put(
    `/api/bookings/${id}`,
    bookingData
  );
  return response.data;
};

/* ==========================
   CANCEL BOOKING
========================== */
export const cancelBooking = async (id) => {
  const response = await axiosInstance.put(
    `/api/bookings/${id}/cancel`
  );
  return response.data;
};

/* ==========================
   DELETE BOOKING
========================== */
export const deleteBooking = async (id) => {
  const response = await axiosInstance.delete(
    `/api/bookings/${id}`
  );
  return response.data;
};