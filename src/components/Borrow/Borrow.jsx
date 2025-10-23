import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import borrowService from '../../services/borrowService';
import { toast } from 'react-toastify';
import SortIcon from '../atoms/SortIcon'
import BorrowCard from '../molecules/BorrowCard'
import formatDate from '../atoms/formatDate'
import getDueDateBadge from '../atoms/getDueDateBadge';
import getStatusBadge from '../atoms/getStatusBadge'

const PreviewAvatar = ({ avatar, setShowImageModal }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={() => setShowImageModal(false)}
    >
      <img
        src={avatar}
        alt="Avatar besar"
        className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()} // supaya klik gambar tidak menutup modal
      />
      <button
        type="button"
        onClick={() => setShowImageModal(false)}
        className="absolute top-5 right-5 text-white text-3xl font-bold"
      >
        &times;
      </button>
    </div>
  );
};


const Borrow = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({})
  const [stats, setStats] = useState({})
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: '',
    sortBy: 'borrowedAt',
    sortOrder: 'desc',
    datefrom: '',
    dateTo: '',
  })

  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [expandedCard, setExpandedCard] = useState(null);

  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      if (user.role !== 'admin') {
        const response = await borrowService.getBorrowedUser(user._id)
        setData(response.data);
        setStats(response.stats)
        setPagination(response.pagination);
        return
      }
      const response = await borrowService.getTransactions(filters)

      setData(response.data);
      setStats(response.stats)
      setPagination(response.pagination);
    } catch (error) {
      toast.error(`Failed to fetch data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [filters, user]);

  useEffect(() => {
    fetchData();

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };

  }, [fetchData])


  const handleSearch = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }));
  };

  const handleStatusFilter = (status) => {
    setFilters(prev => ({ ...prev, status, page: 1 }));
  }

  const handleDateFilter = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value, page: 1 }));
  }

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleSort = (field) => {
    setFilters(prev => ({ ...prev, sortBy: field, sortOrder: prev.sortOrder === field && prev.sortOrder === 'desc' ? 'asc' : 'desc', page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      status: 'all',
      search: '',
      sortBy: 'borrowedAt',
      sortOrder: 'desc',
      dateFrom: '',
      dateTo: ''
    })
  }

  const statusFilters = [
    { value: 'all', label: 'Semua', count: stats.total, color: 'bg-gray-500' },
    { value: 'borrowed', label: 'Dipinjam', count: stats.borrowed, color: 'bg-orange-500' },
    { value: 'returned', label: 'Dikembalikan', count: stats.returned, color: 'bg-green-500' }
  ];

  const toggleCardExpand = (cardId) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  }

  if (loading && data.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const DesktopTableView = () => (
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
                  {item.user.avatar ? (
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
              {getStatusBadge(item.status)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:mt-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Data Transaksi Peminjaman</h1>
          <p className="text-gray-600 mt-2">
            Kelola semua data peminjaman dan pengembalian buku dalam satu tempat
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {statusFilters.map((filter) => (
            <div
              key={filter.value}
              className={`bg-white rounded-lg p-4 shadow-sm border cursor-pointer transition-all ${filters.status === filter.value ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                }`}
              onClick={() => handleStatusFilter(filter.value)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{filter.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{filter.count || 0}</p>
                </div>
                <div className={`w-3 h-3 rounded-full ${filter.color}`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari Buku atau Peminjam
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari judul, penulis, nomor buku, atau username..."
                  value={filters.search}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Date From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dari Tanggal
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleDateFilter('dateFrom', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Date To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sampai Tanggal
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleDateFilter('dateTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {(filters.status !== 'all' || filters.search || filters.dateFrom || filters.dateTo) && (
              <>
                <span className="text-sm text-gray-600">Filter aktif:</span>
                {filters.status !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Status: {statusFilters.find(f => f.value === filters.status)?.label}
                    <button
                      onClick={() => handleStatusFilter('all')}
                      className="ml-2 hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.search && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Pencarian: "{filters.search}"
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                      className="ml-2 hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {(filters.dateFrom || filters.dateTo) && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Periode: {filters.dateFrom || '...'} - {filters.dateTo || '...'}
                    <button
                      onClick={() => setFilters(prev => ({ ...prev, dateFrom: '', dateTo: '' }))}
                      className="ml-2 hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Hapus Semua Filter
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-lg shadow-sm border">
          {/* Header Tabel */}
          <div className="p-6 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Data Transaksi
                </h2>
                <p className="text-sm text-gray-600">
                  Menampilkan {pagination.totalItems} transaksi
                </p>
              </div>
              <div className="text-sm text-gray-600">
                Halaman {pagination.currentPage} dari {pagination.totalPages}
              </div>
            </div>
          </div>

          {/* Tabel Content */}
          <div className="overflow-x-auto">
            {isMobile ? (
              <div className="p-4">
                {data.map((item) => (
                  <BorrowCard key={item._id} item={item} setShowImageModal={setShowImageModal} setSelectedImage={setSelectedImage} expandedCard={expandedCard} toggleCardExpand={toggleCardExpand} />
                ))}
              </div>
            ) : (<DesktopTableView />)}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Empty State */}
          {data.length === 0 && !loading && (
            <div className="text-center py-12">
              <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Tidak ada data transaksi</h3>
              <p className="mt-2 text-sm text-gray-500">
                {filters.status !== 'all' || filters.search || filters.dateFrom || filters.dateTo
                  ? 'Coba ubah filter pencarian Anda'
                  : 'Belum ada data peminjaman atau pengembalian'
                }
              </p>
              {(filters.status !== 'all' || filters.search || filters.dateFrom || filters.dateTo) && (
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Hapus Filter
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t bg-gray-50">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Menampilkan <span className="font-medium">{(filters.page - 1) * filters.limit + 1}</span> -{' '}
                  <span className="font-medium">
                    {Math.min(filters.page * filters.limit, pagination.totalItems)}
                  </span>{' '}
                  dari <span className="font-medium">{pagination.totalItems}</span> transaksi
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {!isMobile ? 'Sebelumnya' : '«'}
                  </button>
                  <div className="flex space-x-1">
                    {[...Array(pagination.totalPages)].map((_, index) => {
                      const pageNumber = index + 1;
                      // Show limited pages with ellipsis
                      if (
                        pageNumber === 1 ||
                        pageNumber === pagination.totalPages ||
                        (pageNumber >= filters.page - 1 && pageNumber <= filters.page + 1)
                      ) {
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-3 py-2 border text-sm font-medium rounded-lg transition-colors ${filters.page === pageNumber
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                              }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      } else if (pageNumber === filters.page - 2 || pageNumber === filters.page + 2) {
                        return <span key={pageNumber} className="px-2 py-2 text-gray-500">...</span>;
                      }
                      return null;
                    })}
                  </div>
                  <button
                    onClick={() => handlePageChange(filters.page + 1)}
                    disabled={filters.page === pagination.totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {!isMobile ? 'Selanjutnya' : '»'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showImageModal && <PreviewAvatar avatar={selectedImage} setShowImageModal={setShowImageModal} />}
    </div>
  );
}

export default Borrow
