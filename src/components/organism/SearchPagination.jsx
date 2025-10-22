import { useState } from "react"
import SearchBar from "../molecules/SearchBar"
import Pagination from "../molecules/Pagination"

const SearchPagination = ({ fetchData, currentPage, totalPages, children }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (query) => {
    setQuery(query);
    fetchData(1, query);
  };

  const handleClearSearch = () => {
    setQuery("");
    fetchData(1, "");
  };

  return (
    <>
      <SearchBar
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
      />


      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={fetchData}
        query={query}
      />

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nomor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penulis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {children}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export default SearchPagination
