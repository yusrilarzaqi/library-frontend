import getDaysDifference from "./getDaysDifference";
import formatDate from "./formatDate";

const getDueDateBadge = (dueDate, status) => {
  if (status === 'returned') return null;

  const diffDays = getDaysDifference(dueDate);
  if (diffDays === null) return null;

  let color = 'bg-gray-100 text-gray-800';
  let text = `Due: ${formatDate(dueDate)}`;

  if (diffDays < 0) {
    color = 'bg-red-100 text-red-800';
    text = `Terlambat ${Math.abs(diffDays)} hari`;
  } else if (diffDays === 0) {
    color = 'bg-yellow-100 text-yellow-800';
    text = 'Due hari ini';
  } else if (diffDays <= 3) {
    color = 'bg-orange-100 text-orange-800';
    text = `Due ${diffDays} hari lagi`;
  }

  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
      {text}
    </span>
  );
};

export default getDueDateBadge
