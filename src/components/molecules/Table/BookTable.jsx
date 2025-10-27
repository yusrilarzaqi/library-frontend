import StatusBadge from "../../atoms/StatusBadge";

const BookTable = ({ data, role, filters, fetchBookDetails, handleBorrow, handleSort, handleReturn, handleEdit, handleDelete }) => {
  const SortIcon = ({ field }) => {
    if (filters.sortBy !== field) return <span>↕</span>;
    return filters.sortOrder === 'asc' ? <span>↑</span> : <span>↓</span>;
  };
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Buku
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('nomor')}
            >
              <div className="flex items-center space-x-1">
                <span>Nomor</span>
                <SortIcon field="nomor" />
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('level')}
            >
              <div className="flex items-center space-x-1">
                <span>Level</span>
                <SortIcon field="level" />
              </div>
            </th>
            <th
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('penulis')}
            >
              <div className="flex items-center space-x-1">
                <span>Penulis</span>
                <SortIcon field="penulis" />
              </div>
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((book) => (
            <tr key={book._id}
              className={`hover:bg-gray-50 transition-colors ${book.status === 'borrowed'
                ? 'bg-orange-50 hover:bg-orange-100'
                : 'hover:bg-gray-50'}`}
            >
              {/* book info */}
              <td className="px-6 py-4">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {book.judul}
                  </div>
                  <div className="text-sm text-gray-500">
                    Kode: {book.kodeJudul}
                  </div>
                  {book.status === 'borrowed' && book.borrowedBy && (
                    <div className="text-xs text-orange-600 mt-1">
                      Dipinjam oleh: {book.borrowedBy.username}
                    </div>
                  )}
                </div>
              </td>

              {/* Book Number */}
              <td className="px-6 py-4">
                <div className="text-sm font-mono text-gray-900">{book.nomor}</div>
              </td>

              {/* Level */}
              <td className="px-6 py-4">
                {StatusBadge(book.level, 'level')}
              </td>

              {/* Author */}
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{book.penulis}</div>
                <div className="text-sm text-gray-500">Kode: {book.kodePenulis}</div>
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                {StatusBadge(book.status)}
              </td>

              {/* Actions */}
              <td className="px-4 py-4">
                <div className="flex space-x-2">
                  <button
                    onClick={() => fetchBookDetails(book._id)}
                    className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-sm text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Detail
                  </button>
                  {role === 'admin' && (
                    <>
                      <button
                        onClick={() => handleEdit(book)}
                        className="inline-flex items-center px-3 py-1 border border-green-300 rounded-md text-sm text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      {book.status === 'available' ? (
                        <button
                          onClick={() => handleBorrow(book)}
                          className="inline-flex items-center px-3 py-1 border border-orange-300 rounded-md text-sm text-orange-700 bg-orange-50 hover:bg-orange-100 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                          </svg>
                          Pinjam
                        </button>
                      ) : (
                        <button
                          onClick={() => handleReturn(book)}
                          className="inline-flex items-center px-3 py-1 border border-purple-300 rounded-md text-sm text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Kembali
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(book)}
                        className="inline-flex items-center px-3 py-1 border border-red-300 rounded-md text-sm text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Hapus
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  )
}

export default BookTable;
