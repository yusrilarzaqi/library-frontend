const getStatusBadge = (status) => {
  const statusConfig = {
    borrowed: {
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      label: 'Dipinjam',
      icon: '📚'
    },
    returned: {
      color: 'bg-green-100 text-green-800 border-green-200',
      label: 'Dikembalikan',
      icon: '🔄'
    }
  };

  const config = statusConfig[status];
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color} flex items-center space-x-1`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}

export default getStatusBadge
