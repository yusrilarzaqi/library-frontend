const StatusBadge = (status, type = 'status') => {
  const statusConfig = {
    status: {
      borrowed: {
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        label: 'Dipinjam',
        icon: '📚'
      },
      returned: {
        color: 'bg-green-100 text-green-800 border-green-200',
        label: 'Dikembalikan',
        icon: '🔄'
      },
      available: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'Tersedia',
        icon: '📚'
      }
    },
    role: {
      admin: { color: 'bg-purple-100 text-purple-800', label: 'Admin', icon: '👑' },
      user: { color: 'bg-blue-100 text-blue-800', label: 'User', icon: '👤' }
    },
    level: {
      A1: { color: 'bg-blue-100 text-blue-800', icon: '', label: status },
      A2: { color: 'bg-green-100 text-green-800', icon: '', label: status },
      B1: { color: 'bg-yellow-100 text-yellow-800', icon: '', label: status },
      B2: { color: 'bg-orange-100 text-orange-800', icon: '', label: status },
      C1: { color: 'bg-red-100 text-red-800', icon: '', label: status },
      C2: { color: 'bg-purple-100 text-purple-800', icon: '', label: status }
    }
  };


  const config = statusConfig[type]?.[status] || { color: 'bg-gray-100 text-gray-800', label: status, icon: '' };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color} flex items-center space-x-1`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
}

export default StatusBadge
