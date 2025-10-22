import PaginationButton from "../atoms/PaginationButton";

const Pagination = ({ currentPage, totalPages, onPageChange, query }) => {

  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const delta = 2
    const pages = []
    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      pages.push(i);
    } return pages
  }

  const handlePrevClick = () => {
    onPageChange(currentPage - 1, query);
  };

  const handleNextClick = () => {
    onPageChange(currentPage + 1, query);
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <div className="flex items-center space-x-2">
        <PaginationButton
          label="Prev"
          disabled={currentPage === 1}
          onClick={handlePrevClick}
        />
        {query}
        {getPageNumbers().map((num) => (
          <PaginationButton label={num} key={num} active={num === currentPage} onClick={() => onPageChange(num, query)} />
        ))}
        <PaginationButton
          label="Next"
          disabled={currentPage === totalPages}
          onClick={handleNextClick}
        />
      </div>
    </div>
  );
};

export default Pagination;

