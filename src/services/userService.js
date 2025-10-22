// import axios from "axios";
import axios from "./axiosInstance";

const getAllUsers = async (params) => {
  const response = await axios.get("/user", {
    params,
  });
  return response.data;
};

const getUserById = async (id) => {
  const response = await axios.get(`/user/${id}`);
  return response.data;
};

const updateUser = async (id, data) => {
  const response = await axios.put(`/user/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const getProfile = async () => {
  const user_id = JSON.parse(localStorage.getItem("user"))._id;
  const response = await axios.get("/user/profile", user_id);
  return response.data.data;
};

const createUser = async (data) => {
  const response = await axios.post("/auth/register", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const deleteUser = async (id) => {
  const response = await axios.delete(`/user/${id}`);
  return response.data;
};

const userService = {
  getAllUsers,
  getUserById,
  getProfile,
  updateUser,
  createUser,
  deleteUser,
};

export default userService;
