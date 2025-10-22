const PaginationButton = ({ label, active, onClick, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1 rounded-lg text-sm font-medium border 
        ${active ? "bg-blue-600 text-white" : "bg-white text-gray-700"} 
        ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-50"}
      `}
    >
      {label}
    </button>
  );
};

export default PaginationButton;

