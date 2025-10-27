import StatusBadge from "../../atoms/StatusBadge";
import formatDate from "../../atoms/formatDate";

const UserModal = ({ data, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Detail Pengguna</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* User Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Informasi Pengguna</h4>
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-gray-600">Username:</label>
                  <p className="font-medium">{data.user.username}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Email:</label>
                  <p className="font-medium">{data.user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Role:</label>
                  <div className="mt-1">{StatusBadge(data.user.role, 'role')}</div>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Bergabung:</label>
                  <p className="font-medium">{formatDate(data.user.createdAt)}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Statistik Peminjaman</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Dipinjam:</span>
                  <span className="font-medium">{data.stats.totalBorrowed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Sedang Dipinjam:</span>
                  <span className="font-medium text-orange-600">{data.stats.currentlyBorrowed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Telah Dikembalikan:</span>
                  <span className="font-medium text-green-600">{data.stats.totalReturned}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Currently Borrowed Books */}
          {data.borrowedBooks.length > 0 && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Buku Sedang Dipinjam</h4>
              <div className="space-y-2">
                {data.borrowedBooks.map((book) => (
                  <div key={book._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{book.book.judul}</p>
                      <p className="text-sm text-gray-600">{book.book.penulis} • {book.book.level}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      No: {book.book.nomor}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent History */}
          {data.borrowingHistory.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Riwayat Terbaru</h4>
              <div className="space-y-2">
                {data.borrowingHistory.map((history) => (
                  <div key={history._id} className="flex justify-between items-center p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{history.book.judul}</p>
                      <p className="text-sm text-gray-600">
                        {history.status === 'borrowed' ? 'Dipinjam' : 'Dikembalikan'} • {formatDate(history.borrowedAt)}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${history.status === 'borrowed'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-green-100 text-green-800'
                      }`}>
                      {history.status === 'borrowed' ? 'Dipinjam' : 'Dikembalikan'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>

  )
}

export default UserModal;
