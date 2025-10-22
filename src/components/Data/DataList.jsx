import React, { useState, useEffect } from 'react';
import dataService from '../../services/dataService';
import userService from '../../services/userService';
import borrowService from '../../services/borrowService';
import {
  useAuth
} from '../../context/AuthContext';
import { useCallback } from 'react';

const PreviewImage = ({ image, setShowPreviewModal }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={() => setShowPreviewModal(false)}
    >
      <img
        src={image}
        alt="Avatar besar"
        className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()} // supaya klik gambar tidak menutup modal
      />
      <button
        type="button"
        onClick={() => setShowPreviewModal(false)}
        className="absolute top-5 right-5 text-white text-3xl font-bold"
      >
        &times;
      </button>
    </div>
  );
};


const DataList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({});
  const [levels, setLevels] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: 'all',
    level: 'all',
    search: '',
    sortBy: 'nomor',
    sortOrder: 'asc'
  });

  const [selectedBook, setSelectedBook] = useState(null);
  const [showBookModal, setShowBookModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  const [bookToBorrow, setBookToBorrow] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [addForm, setAddForm] = useState({
    nomor: '',
    judul: '',
    level: '',
    penulis: '',
    kodeJudul: '',
    kodePenulis: '',
  });
  const [borrowForm, setBorrowForm] = useState({
    userId: '',
    dueDate: ''
  });
  const [availableUsers, setAvailableUsers] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await dataService.getAllBooks(filters);

      setData(response.data);
      setStats(response.stats);
      setLevels(response.levels);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchAvailableUsers = useCallback(async () => {
    if (user.role === 'admin') {
      try {
        const response = await userService.getAllUsers();
        setAvailableUsers(response.data);
      } catch (error) {
        console.error('Error fetching available users:', error);
      }
    }
  }, [user.role]);


  useEffect(() => {
    fetchData();
    fetchAvailableUsers();
  }, [fetchData, fetchAvailableUsers]);


  const fetchBookDetails = async (bookId) => {
    try {
      const response = await dataService.getBookById(bookId);
      setSelectedBook(response.data);
      setShowBookModal(true);
    } catch (error) {
      console.error('Error fetching book details:', error);
    }
  };

  const handleSearch = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value,
      page: 1
    }));
  };

  const handleStatusFilter = (status) => {
    setFilters(prev => ({
      ...prev,
      status,
      page: 1
    }));
  };

  const handleLevelFilter = (level) => {
    setFilters(prev => ({
      ...prev,
      level,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleSort = (field) => {
    setFilters(prev => ({
      ...prev,
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'desc' ? 'asc' : 'desc',
      page: 1
    }));
  };

  const clearFilters = () => {
    setFilters({
      page: 1,
      limit: 10,
      status: 'all',
      level: 'all',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCoverImage(file || null);
    if (file) setPreview(URL.createObjectURL(file));
  }

  const handleEdit = (book) => {
    setEditForm({
      _id: book._id,
      nomor: book.nomor,
      judul: book.judul,
      level: book.level,
      penulis: book.penulis,
      kodeJudul: book.kodeJudul,
      kodePenulis: book.kodePenulis,
    });
    setShowEditModal(true);
    setFormErrors({});
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('nomor', editForm.nomor);
      formData.append('judul', editForm.judul);
      formData.append('level', editForm.level);
      formData.append('penulis', editForm.penulis);
      formData.append('kodeJudul', editForm.kodeJudul);
      formData.append('kodePenulis', editForm.kodePenulis);
      if (coverImage && typeof coverImage === 'object') {
        formData.append('coverImage', coverImage);
      }
      await dataService.updateBook(editForm._id, formData);
      setShowEditModal(false);
      setPreview(null);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating book:', error);
      alert('Error updating book: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };


  const handleAdd = () => {
    setAddForm({
      nomor: '',
      judul: '',
      level: '',
      penulis: '',
      kodeJudul: '',
      kodePenulis: '',
    });
    setFormErrors({});
    setShowAddModal(true);
  };

  const validateAddForm = () => {
    const errors = {};

    if (!addForm.nomor.trim()) {
      errors.nomor = 'Nomor buku wajib diisi';
    }

    if (!addForm.judul.trim()) {
      errors.judul = 'Judul buku wajib diisi';
    }

    if (!addForm.level.trim()) {
      errors.level = 'Level buku wajib diisi';
    }

    if (!addForm.penulis.trim()) {
      errors.penulis = 'Penulis buku wajib diisi';
    }

    if (!addForm.kodeJudul.trim()) {
      errors.kodeJudul = 'Kode judul wajib diisi';
    }

    if (!addForm.kodePenulis.trim()) {
      errors.kodePenulis = 'Kode penulis wajib diisi';
    }

    return errors;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const errors = validateAddForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('nomor', addForm.nomor);
      formData.append('judul', addForm.judul);
      formData.append('level', addForm.level);
      formData.append('penulis', addForm.penulis);
      formData.append('kodeJudul', addForm.kodeJudul);
      formData.append('kodePenulis', addForm.kodePenulis);
      if (coverImage) formData.append('coverImage', coverImage);
      await dataService.createBook(formData);
      setShowAddModal(false);
      setFormErrors({});
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error creating book:', error);
      const errorMessage = error.response?.data?.message || error.message;

      if (errorMessage.includes('already exists')) {
        setFormErrors({
          general: 'Nomor buku sudah digunakan'
        });
      } else {
        setFormErrors({
          general: 'Error membuat buku: ' + errorMessage
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = (book) => {
    if (book.status === 'available') {
      setBookToBorrow(book);
      setBorrowForm({
        userId: '',
        dueDate: ''
      });
      setFormErrors({});
      setShowBorrowModal(true);
    }
  };

  const handleBorrowSubmit = async () => {
    if (!borrowForm.userId) {
      setFormErrors({ userId: 'Pilih peminjam terlebih dahulu' });
      return;
    }

    try {
      await borrowService.borrowBook(bookToBorrow._id, borrowForm);
      setShowBorrowModal(false);
      setBookToBorrow(null);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error borrowing book:', error);
      alert('Error borrowing book: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleReturn = async (book) => {
    if (book.status === 'borrowed') {
      try {
        await borrowService.returnBook(book._id);
        fetchData(); // Refresh data
      } catch (error) {
        console.error('Error returning book:', error);
        alert('Error returning book: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleDeleteClick = (book) => {
    setBookToDelete(book);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await dataService.deleteBook(bookToDelete._id);
      setShowDeleteModal(false);
      setBookToDelete(null);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Error deleting book: ' + (error.response?.data?.message || error.message));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      available: {
        color: 'bg-green-100 text-green-800 border-green-200',
        label: 'Tersedia',
        icon: '✅'
      },
      borrowed: {
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        label: 'Dipinjam',
        icon: '📚'
      }
    };

    const config = statusConfig[status];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color} flex items-center space-x-1`}>
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </span>
    );
  };

  const getLevelBadge = (level) => {
    const levelColors = {
      'A1': 'bg-blue-100 text-blue-800',
      'A2': 'bg-green-100 text-green-800',
      'B1': 'bg-yellow-100 text-yellow-800',
      'B2': 'bg-orange-100 text-orange-800',
      'C1': 'bg-red-100 text-red-800',
      'C2': 'bg-purple-100 text-purple-800'
    };

    const color = levelColors[level] || 'bg-gray-100 text-gray-800';

    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${color}`}>
        {level}
      </span>
    );
  };

  const SortIcon = ({ field }) => {
    if (filters.sortBy !== field) return <span>↕</span>;
    return filters.sortOrder === 'asc' ? <span>↑</span> : <span>↓</span>;
  };

  const statusFilters = [
    { value: 'all', label: 'Semua', count: stats.total, color: 'bg-gray-500' },
    { value: 'available', label: 'Tersedia', count: stats.available, color: 'bg-green-500' },
    { value: 'borrowed', label: 'Dipinjam', count: stats.borrowed, color: 'bg-orange-500' }
  ];

  const levelFilters = [
    { value: 'all', label: 'Semua Level', count: stats.total, color: 'bg-gray-500' },
    ...levels.map(level => ({
      value: level,
      label: level,
      count: data.filter(book => book.level === level).length,
      color: 'bg-blue-500'
    }))
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              {user.role === 'admin' ? (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">Manajemen Buku</h1>
                  <p className="text-gray-600 mt-2">
                    Kelola koleksi buku perpustakaan
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-900">Daftar Buku</h1>
                  <p className="text-gray-600 mt-2">
                    Koleksi buku perpustakaan
                  </p>
                </>
              )}
            </div>
            {user.role === 'admin' && (
              <button
                onClick={handleAdd}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Tambah Buku
              </button>
            )}
          </div>
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
                Cari Buku
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari judul, penulis, atau nomor buku..."
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

            {/* Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                value={filters.level}
                onChange={(e) => handleLevelFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {levelFilters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              {(filters.status !== 'all' || filters.level !== 'all' || filters.search) && (
                <button
                  onClick={clearFilters}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Hapus Filter
                </button>
              )}
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {(filters.status !== 'all' || filters.level !== 'all' || filters.search) && (
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
                {filters.level !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Level: {filters.level}
                    <button
                      onClick={() => handleLevelFilter('all')}
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
                  Data Buku
                </h2>
                <p className="text-sm text-gray-600">
                  Menampilkan {pagination.totalItems} buku
                </p>
              </div>
              <div className="text-sm text-gray-600">
                Halaman {pagination.currentPage} dari {pagination.totalPages}
              </div>
            </div>
          </div>

          {/* Tabel Content */}
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
                  <tr
                    key={book._id}
                    className={`transition-colors ${book.status === 'borrowed'
                      ? 'bg-orange-50 hover:bg-orange-100'
                      : 'hover:bg-gray-50'
                      }`}
                  >
                    {/* Book Info */}
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
                      {getLevelBadge(book.level)}
                    </td>

                    {/* Author */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{book.penulis}</div>
                      <div className="text-sm text-gray-500">Kode: {book.kodePenulis}</div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {getStatusBadge(book.status)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
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
                        {user.role === 'admin' && (
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
                              onClick={() => handleDeleteClick(book)}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Tidak ada data buku</h3>
              <p className="mt-2 text-sm text-gray-500">
                {filters.status !== 'all' || filters.level !== 'all' || filters.search
                  ? 'Coba ubah filter pencarian Anda'
                  : 'Belum ada buku dalam koleksi'
                }
              </p>
              <div className="mt-4 flex justify-center space-x-3">
                {(filters.status !== 'all' || filters.level !== 'all' || filters.search) && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Hapus Filter
                  </button>
                )}
              </div>
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
                  dari <span className="font-medium">{pagination.totalItems}</span> buku
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handlePageChange(filters.page - 1)}
                    disabled={filters.page === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Sebelumnya
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
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => {
          setShowAddModal(false)
          setPreview(false)
        }}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <form className="p-6" onSubmit={handleCreate} encType="multipart/form-data">
              <h3 className="text-lg font-semibold mb-4">Tambah Buku Baru</h3>

              {formErrors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {formErrors.general}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nomor Buku <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.nomor}
                    onChange={(e) => setAddForm(prev => ({ ...prev, nomor: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.nomor ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Masukkan nomor buku"
                  />
                  {formErrors.nomor && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.nomor}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.level}
                    onChange={(e) => setAddForm(prev => ({ ...prev, level: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.level ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Contoh: A1, B2, C1"
                  />
                  {formErrors.level && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.level}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Judul Buku <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.judul}
                    onChange={(e) => setAddForm(prev => ({ ...prev, judul: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.judul ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Masukkan judul buku"
                  />
                  {formErrors.judul && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.judul}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Penulis <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.penulis}
                    onChange={(e) => setAddForm(prev => ({ ...prev, penulis: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.penulis ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Masukkan nama penulis"
                  />
                  {formErrors.penulis && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.penulis}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Judul <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.kodeJudul}
                    onChange={(e) => setAddForm(prev => ({ ...prev, kodeJudul: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.kodeJudul ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Masukkan kode judul"
                  />
                  {formErrors.kodeJudul && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.kodeJudul}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kode Penulis <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.kodePenulis}
                    onChange={(e) => setAddForm(prev => ({ ...prev, kodePenulis: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.kodePenulis ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Masukkan kode penulis"
                  />
                  {formErrors.kodePenulis && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.kodePenulis}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cover Image
                  </label>
                  <input
                    id="coverImage"
                    name="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {preview && (
                    <p className="text-sm text-green-600 mt-1">
                      Gambar baru siap diunggah
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                {loading ? (
                  <button disabled type="button" class="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                    </svg>
                    Loading...
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setShowAddModal(false)
                        setPreview(null)
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      Tambah Buku
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )
      }

      {/* Borrow Book Modal */}
      {
        showBorrowModal && bookToBorrow && user.role === 'admin' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Pinjam Buku</h3>

                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900">{bookToBorrow.judul}</h4>
                  <p className="text-sm text-blue-700">No: {bookToBorrow.nomor} • {bookToBorrow.penulis}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pilih Peminjam <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={borrowForm.userId}
                      onChange={(e) => setBorrowForm(prev => ({ ...prev, userId: e.target.value }))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.userId ? 'border-red-300' : 'border-gray-300'
                        }`}
                    >
                      <option value="">Pilih peminjam</option>
                      {availableUsers.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.username} ({user.email})
                        </option>
                      ))}
                    </select>
                    {formErrors.userId && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.userId}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Jatuh Tempo (Opsional)
                    </label>
                    <input
                      type="date"
                      value={borrowForm.dueDate}
                      onChange={(e) => setBorrowForm(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowBorrowModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleBorrowSubmit}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                  >
                    Pinjam Buku
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Book Detail Modal */}
      {
        showBookModal && selectedBook && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setShowBookModal(false)}>
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Detail Buku</h3>
                  <button
                    onClick={() => setShowBookModal(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Cover Image Section */}
                  <div className="lg:col-span-1">
                    {selectedBook.book.coverImage ? (
                      <img
                        src={selectedBook.book.coverImage}
                        alt={`Cover ${selectedBook.book.judul}`}
                        className="w-full h-full object-cover rounded-lg shadow-md cursor-pointer hover:opacity-80"
                        onClick={() => {
                          setShowPreviewModal(true)
                          setSelectedImage(selectedBook.book.coverImage)
                        }}
                        onError={(e) => {
                          e.target.src = 'https://placehold.co/300x400?text=Cover+Tidak+Tersedia';
                        }}
                      />
                    ) : (
                      <div className="text-center text-gray-500">
                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm">Cover tidak tersedia</p>
                      </div>
                    )}
                  </div>

                  {/* Book Information Section */}
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Basic Information */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Informasi Buku</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">Judul Buku</label>
                              <p className="text-lg font-semibold text-gray-900">{selectedBook.book.judul}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">Penulis</label>
                              <p className="text-gray-900">{selectedBook.book.penulis}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">Level</label>
                              <div className="mt-1">{getLevelBadge(selectedBook.book.level)}</div>
                            </div>
                          </div>
                        </div>

                        {/* Status Information */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Status</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">Status Buku</label>
                              <div className="mt-1">{getStatusBadge(selectedBook.book.status)}</div>
                            </div>
                            {selectedBook.book.status === 'borrowed' && selectedBook.book.borrowedBy && (
                              <>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Dipinjam Oleh</label>
                                <div className="flex items-center space-x-3 mt-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
                                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                    {selectedBook.book.borrowedBy.username?.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-medium text-orange-800">{selectedBook.book.borrowedBy.username}</p>
                                    <p className="text-sm text-orange-600">{selectedBook.book.borrowedBy.email}</p>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Technical Information */}
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b">Informasi Teknis</h4>
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">Nomor Buku</label>
                              <p className="font-mono text-gray-900 bg-gray-100 px-3 py-2 rounded-lg">{selectedBook.book.nomor}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">Kode Judul</label>
                              <p className="text-gray-900">{selectedBook.book.kodeJudul}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">Kode Penulis</label>
                              <p className="text-gray-900">{selectedBook.book.kodePenulis}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">Tanggal Dibuat</label>
                              <p className="text-gray-900">{formatDate(selectedBook.book.createdAt)}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-600 mb-1">Terakhir Diupdate</label>
                              <p className="text-gray-900">{formatDate(selectedBook.book.updatedAt)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Borrowing History */}
                {selectedBook.borrowingHistory?.length > 0 && (
                  <div className="mt-8">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Riwayat Peminjaman</h4>
                    <div className="bg-gray-50 rounded-lg border">
                      {selectedBook.borrowingHistory.slice(0, 5).map((history, index) => (
                        <div key={history._id} className={`p-4 ${index !== selectedBook.borrowingHistory.length - 1 ? 'border-b' : ''}`}>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${history.status === 'borrowed' ? 'bg-orange-500' : 'bg-green-500'
                                }`}>
                                {history.user.username?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{history.user.username}</p>
                                <p className="text-sm text-gray-600">{history.user.email}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${history.status === 'borrowed'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-green-100 text-green-800'
                                }`}>
                                {history.status === 'borrowed' ? 'Dipinjam' : 'Dikembalikan'}
                              </span>
                              <p className="text-sm text-gray-600 mt-1">
                                {formatDate(history.borrowedAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {selectedBook.borrowingHistory.length > 5 && (
                        <div className="p-4 text-center border-t">
                          <p className="text-sm text-gray-600">
                            Menampilkan 5 dari {selectedBook.borrowingHistory.length} riwayat
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      {/* Edit Book Modal */}
      {
        showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => {
            setShowEditModal(false)
            setPreview(false)
          }}>
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <form className="p-6" onSubmit={handleUpdate} encType="multipart/form-data">
                <h3 className="text-lg font-semibold mb-4">Edit Buku</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nomor Buku
                    </label>
                    <input
                      type="text"
                      value={editForm.nomor}
                      onChange={(e) => setEditForm(prev => ({ ...prev, nomor: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Level
                    </label>
                    <input
                      type="text"
                      value={editForm.level}
                      onChange={(e) => setEditForm(prev => ({ ...prev, level: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Judul Buku
                    </label>
                    <input
                      type="text"
                      value={editForm.judul}
                      onChange={(e) => setEditForm(prev => ({ ...prev, judul: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Penulis
                    </label>
                    <input
                      type="text"
                      value={editForm.penulis}
                      onChange={(e) => setEditForm(prev => ({ ...prev, penulis: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kode Judul
                    </label>
                    <input
                      type="text"
                      value={editForm.kodeJudul}
                      onChange={(e) => setEditForm(prev => ({ ...prev, kodeJudul: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kode Penulis
                    </label>
                    <input
                      type="text"
                      value={editForm.kodePenulis}
                      onChange={(e) => setEditForm(prev => ({ ...prev, kodePenulis: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cover Image
                    </label>
                    <input
                      name="coverImage"
                      type="file"
                      onChange={handleFileChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {preview && (
                      <p className="text-sm text-green-600 mt-1">
                        Gambar baru siap diunggah
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  {loading ? (
                    <button disabled type="button" class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                      <svg aria-hidden="true" role="status" class="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                      </svg>
                      Loading...
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setShowEditModal(false)
                          setPreview(false)
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Simpan Perubahan
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>
          </div>
        )
      }

      {showPreviewModal && <PreviewImage image={selectedImage} setShowPreviewModal={setShowPreviewModal} />}


      {/* Delete Confirmation Modal */}
      {
        showDeleteModal && bookToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>

                <h3 className="text-lg font-semibold text-center mb-2">Hapus Buku</h3>
                <p className="text-gray-600 text-center mb-4">
                  Apakah Anda yakin ingin menghapus buku <strong>"{bookToDelete.judul}"</strong>?
                  Tindakan ini tidak dapat dibatalkan.
                </p>

                <div className="flex justify-center space-x-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Ya, Hapus
                  </button>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default DataList;
