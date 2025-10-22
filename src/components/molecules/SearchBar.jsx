import { useState } from "react";
import InputSearch from "../atoms/InputSearch"
import Button from "../atoms/Button";
import { SearchIcon } from "@heroicons/react/outline";

const SearchBar = ({ onSearch, onClearSearch, placeholder }) => {
  const [query, setQuery] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  }
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto mb-6">
      <div className="relative flex items-center">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" />
        </div>
        <InputSearch name="query" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={placeholder} />
        <Button
          type="submit"
          className="mx-2"
        >
          Search
        </Button>
        <Button
          onClick={onClearSearch}
          variant="secondary"
        >
          Clear
        </Button>
      </div>
    </form>
  )
}

export default SearchBar
