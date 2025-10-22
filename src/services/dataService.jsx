import axios from './axiosInstance'

const getAllBooks = async (params) => {
  const response = await axios.get("/book", {
    params,
  });
  return response.data;
}

const getBookById = async (id) => {
  const response = await axios.get(`/book/${id}`);
  return response.data;
}

const createBook = async (data) => {
  const response = await axios.post('/book', data, { headers: { "Content-Type": "multipart/form-data" } });
  return response.data;
};

const updateBook = async (id, data) => {
  const response = await axios.put(`/book/${id}`, data, { headers: { "Content-Type": "multipart/form-data" } });
  return response.data;
};

const deleteBook = async (id) => {
  const response = await axios.delete(`/book/${id}`);
  return response.data;
};


const dataService = {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};

export default dataService;
