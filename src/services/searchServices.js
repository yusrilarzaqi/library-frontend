import axios from "./axiosInstance";

const searchData = async (query, page = 1, limit = 10) => {
  try {
    const response = await axios.get("/book/search", {
      params: { q: query, page, limit },
    });
    return {
      results: response.data.data,
      pagination: response.data.pagination,
    };
  } catch (error) {
    console.error("Search failed:", error);
    throw error;
  }
};

export default { searchData };
