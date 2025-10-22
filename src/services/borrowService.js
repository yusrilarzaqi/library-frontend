import axios from "./axiosInstance";

const getStats = async (range) => {
  const response = await axios.get("/borrow/stats", { params: { range } });
  return response.data;
};

const getRange = async () => {
  const response = await axios.get("/borrow/getRange");
  return response.data;
};

const getTransactions = async (params) => {
  const response = await axios.get("/borrow/transactions", { params });
  return response.data;
};

const getReturnedBooks = async (params) => {
  const response = await axios.get("/borrow/returned", { params });
  return response.data;
};

const getBorrwedData = async () => {
  const response = await axios.get("/borrow");
  return response.data;
};

const getBorrowedUser = async (id) => {
  const response = await axios.get(`/borrow/${id}`);
  return response.data;
};

const borrowBook = async (id, params) => {
  return axios.post(`/borrow/${id}/borrow`, params);
};

const returnBook = async (id) => {
  return axios.post(`/borrow/${id}/return`, {});
};

const borrowService = {
  getStats,
  getRange,
  getTransactions,
  getReturnedBooks,
  getBorrwedData,
  getBorrowedUser,
  borrowBook,
  returnBook,
};

export default borrowService;
