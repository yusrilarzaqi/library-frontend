import StatusBadge from "../../atoms/StatusBadge";
import formatDate from "../../atoms/formatDate";

const UserCard = ({ user, onEdit, onDelete, onDetails }) => {
  return (
    <div className={`bg-gray-50 rounded-lg shadow-sm border p-4 mb-4`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{user.username}</h3>
          <p className="text-gray-600 text-xs mt-1">{user.email}</p>
        </div>
        {StatusBadge(user.role, 'role')}
      </div>

      <div className="space-y-2 text-xs text-gray-600 mb-4">
        <div className="flex justify-between">
          <span>Bergabung:</span>
          <span className="font-medium">{formatDate(user.createdAt)}</span>
        </div>
      </div>

      <div className="flex justify-around space-x-2">
        <button
          onClick={() => onDetails(user._id)}
          className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
        >
          Detail
        </button>
        <button
          onClick={() => onEdit(user)}
          className="inline-flex items-center px-3 py-1 border border-green-300 rounded-md text-sm text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(user)}
          className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-sm text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
        >
          Hapus
        </button>
      </div>
    </div>

  )
}

export default UserCard;
