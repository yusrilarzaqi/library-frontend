import StatusBadge from "../../atoms/StatusBadge"
import formatDate from "../../atoms/formatDate"

const UserTable = ({ data, SortIcon, handleSort, handleDetails, handleEdit, handleDeleteClick, setShowPreviewModal, setSelectedImage }) => {
  return (
    <table className="w-full">
      <thead className="bg-gray-50 ">
        <tr className="items-center">
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            User
          </th>
          <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort('email')}
          >
            <div className="flex items-center space-x-1">
              <span>Email</span>
              <SortIcon field="email" />
            </div>
          </th>
          <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort('role')}
          >
            <div className="flex items-center space-x-1">
              <span>Role</span>
              <SortIcon field="role" />
            </div>
          </th>
          <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort('createdAt')}
          >
            <div className="flex items-center space-x-1">
              <span>Bergabung</span>
              <SortIcon field="createdAt" />
            </div>
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Aksi
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((user) => (
          <tr key={user._id} className="hover:bg-gray-50 transition-colors">
            {/* User Info */}
            <td className="px-6 py-4">
              <div className="flex items-center space-x-3">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.username}
                    className="w-10 h-10 rounded-full object-cover border cursor-pointer hover:opacity-80"
                    onClick={() => {
                      setShowPreviewModal(true)
                      setSelectedImage(user.avatar)
                    }}
                  />
                ) : (
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.username?.charAt(0).toUpperCase()}
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {user.username}
                  </div>
                  <div className="text-sm text-gray-500">
                    ID: {user._id.slice(-8)}
                  </div>
                </div>
              </div>
            </td>

            {/* Email */}
            <td className="px-6 py-4">
              <div className="text-sm text-gray-900">{user.email}</div>
            </td>

            {/* Role */}
            <td className="px-6 py-4">
              {StatusBadge(user.role, 'role')}
            </td>

            {/* Join Date */}
            <td className="px-6 py-4">
              <div className="text-sm text-gray-900">
                {formatDate(user.createdAt)}
              </div>
            </td>

            {/* Actions */}
            <td className="px-6 py-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDetails(user._id)}
                  className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Detail
                </button>
                <button
                  onClick={() => handleEdit(user)}
                  className="inline-flex items-center px-3 py-1 border border-green-300 rounded-md text-sm text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteClick(user)}
                  className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-sm text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Hapus
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default UserTable;
