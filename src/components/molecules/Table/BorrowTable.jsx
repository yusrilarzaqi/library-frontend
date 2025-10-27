import SortIcon from "../../atoms/SortIcon";
import formatDate from "../../atoms/formatDate";
import getDueDateBadge from "../../atoms/getDueDateBadge";
import StatusBadge from "../../atoms/StatusBadge";

const BorrowTable = ({ data, handleSort, filters, setShowImageModal, setSelectedImage }) => {
  return (
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort('book.judul')}
          >
            <div className="flex items-center space-x-1">
              <span>Buku</span>
              <SortIcon filter={filters} field="book.judul" />
            </div>
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Info Buku
          </th>
          <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort('user.username')}
          >
            <div className="flex items-center space-x-1">
              <span>Peminjam</span>
              <SortIcon filter={filters} field="user.username" />
            </div>
          </th>
          <th
            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            onClick={() => handleSort('borrowedAt')}
          >
            <div className="flex items-center space-x-1">
              <span>Tanggal Transaksi</span>
              <SortIcon filter={filters} field="borrowedAt" />
            </div>
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Due Date
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map((item) => (
          <tr key={item._id} className="hover:bg-gray-50 transition-colors">
            {/* Book Info */}
            <td className="px-6 py-4">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {item.book?.judul || 'N/A'}
                </div>
                <div className="text-sm text-gray-500">
                  oleh {item.book?.penulis || 'N/A'}
                </div>
              </div>
            </td>

            {/* Book Details */}
            <td className="px-6 py-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-900">
                  No: <span className="font-mono">{item.book?.nomor || 'N/A'}</span>
                </div>
                <div className="text-xs">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {item.book?.level || 'N/A'}
                  </span>
                </div>
              </div>
            </td>

            {/* User Info */}
            <td className="px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {/* Avatar */}
                  {item.user?.avatar ? (
                    <img
                      alt={item.user.username}
                      src={item.user.avatar}
                      className="w-10 h-10 rounded-full object-cover border cursor-pointer hover:opacity-80"
                      onClick={() => {
                        setShowImageModal(true)
                        setSelectedImage(item.user.avatar)
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {item.user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>

                  )}
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {item.user?.username || 'N/A'}
                  </div>
                  <div className="text-sm text-gray-500">
                    {item.user?.email || 'N/A'}
                  </div>
                </div>
              </div>
            </td>

            {/* Transaction Dates */}
            <td className="px-6 py-4">
              <div className="space-y-1">
                <div className="text-sm text-gray-900">
                  <span className="font-medium">Pinjam:</span> {formatDate(item.borrowedAt)}
                </div>
                {item.status === 'returned' && (
                  <div className="text-sm text-green-600">
                    <span className="font-medium">Kembali:</span> {formatDate(item.returnedAt || item.borrowedAt)}
                  </div>
                )}
              </div>
            </td>

            {/* Due Date */}
            <td className="px-6 py-4">
              {item.status === 'borrowed' && item.dueDate ? (
                <div className="space-y-2">
                  <div className="text-sm text-gray-900">
                    {formatDate(item.dueDate)}
                  </div>
                  {getDueDateBadge(item.dueDate, item.status)}
                </div>
              ) : (
                <span className="text-sm text-gray-400">-</span>
              )}
            </td>

            {/* Status */}
            <td className="px-6 py-4">
              {StatusBadge(item.status)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default BorrowTable;
