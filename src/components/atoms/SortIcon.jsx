const SortIcon = ({ field, filter }) => {
  if (filter.sortBy !== field) return <span>↕</span>;
  return filter.sortOrder === 'asc' ? <span>↑</span> : <span>↓</span>;
};

export default SortIcon
