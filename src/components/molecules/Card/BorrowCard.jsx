import StatusBadge from "../../atoms/StatusBadge";
import formatDate from "../../atoms/formatDate";
import getDueDateBadge from "../../atoms/getDueDateBadge";


const BorrowCard = ({ item, expandedCard, toggleCardExpand, setShowImageModal, setSelectedImage }) => {

  const handleCardClick = (e) => {
    // Jika yang diklik adalah tombol atau elemen yang seharusnya tidak trigger toggle, return
    if (e.target.closest('button') || e.target.closest('img')) {
      return;
    }
    // Jika bukan tombol, toggle expand
    toggleCardExpand(item._id);
  };

  const handleDetailClick = (e) => {
    e.stopPropagation();
    toggleCardExpand(item._id);
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    setShowImageModal(true);
    setSelectedImage(item.user.avatar);
  };

  return (
    <div
      className={`rounded-lg shadow-sm border p-4 mb-4 transition-all duration-300 ${expandedCard === item._id ? 'bg-blue-50 border-blue-200' : 'bg-white'} cursor-pointer`}
      onClick={handleCardClick} // Handler untuk seluruh card
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">
            {item.book?.judul || 'N/A'}
          </h3>
          <p className="text-gray-600 text-xs mt-1">Oleh {item.book?.penulis || 'N/A'}</p>
        </div>
        {StatusBadge(item.status)}
      </div>

      {/* Basic Info */}
      <div className="space-y-2 text-xs text-gray-600 mb-3">
        <div className="flex justify-between">
          <span>Tanggal Pinjam:</span>
          <span className="font-medium">{formatDate(item.borrowedAt)}</span>
        </div>
        {item.status === 'returned' && (
          <div className="flex justify-between">
            <span>Tanggal Kembali:</span>
            <span className="font-medium text-green-600">{formatDate(item.returnedAt || item.borrowedAt)}</span>
          </div>
        )}
      </div>

      {/* Book Details */}
      <div className="space-y-2 text-xs text-gray-600 mb-3">
        <div className="flex justify-between">
          <span>Nomor Buku:</span>
          <span className="font-mono">{item.book?.nomor || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span>Level:</span>
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
            {item.book?.level || 'N/A'}
          </span>
        </div>
      </div>

      {/* Due Date Info - Only for borrowed status */}
      {item.status === 'borrowed' && item.dueDate && (
        <div className="mb-3">
          {getDueDateBadge(item.dueDate, item.status)}
        </div>
      )}

      {/* Expandable Details */}
      {expandedCard === item._id && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 animate-fadeIn">
          {/* User Info */}
          <div className="flex items-center space-x-3">
            {item.user?.avatar ? (
              <img
                alt={item.user.username}
                src={item.user.avatar}
                className="w-8 h-8 rounded-full object-cover border cursor-pointer hover:opacity-80"
                onClick={handleImageClick}
              />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {item.user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <div className="text-sm font-medium text-gray-900">
                {item.user?.username || 'N/A'}
              </div>
              <div className="text-xs text-gray-500">
                {item.user?.email || 'N/A'}
              </div>
            </div>
          </div>

          {/* Additional Book Info */}
          <div className="text-xs text-gray-600">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="font-medium">Penerbit:</span>
                <p>{item.book?.penerbit || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium">Tahun:</span>
                <p>{item.book?.tahun || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Transaction ID */}
          <div className="text-xs text-gray-500">
            <span className="font-medium">ID Transaksi:</span>
            <p className="font-mono">{item._id}</p>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handleDetailClick}
          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors"
        >
          <span>{expandedCard === item._id ? 'Sembunyikan' : 'Lihat'} Detail</span>
          <svg
            className={`w-4 h-4 transition-transform ${expandedCard === item._id ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default BorrowCard;
