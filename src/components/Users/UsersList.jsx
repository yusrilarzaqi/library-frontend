import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';

const PreviewAvatar = ({ avatar, setShowPreviewModal }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onClick={() => setShowPreviewModal(false)}
    >
      <img
        src={avatar}
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

const UsersTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    role: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [addForm, setAddForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [formErrors, setFormErrors] = useState({});
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);


  useEffect(() => {
    fetchData();
  }, [filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers(filters);

      setData(response.data);
      setStats(response.stats);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async (userId) => {
    try {
      const response = await userService.getUserById(userId);
      setSelectedUser(response.data);
      setShowUserModal(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleSearch = (e) => {
    setFilters(prev => ({
      ...prev,
      search: e.target.value,
      page: 1
    }));
  };

  const handleRoleFilter = (role) => {
    setFilters(prev => ({
      ...prev,
      role,
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
      role: 'all',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  const handleEdit = (user) => {
    setEditForm({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      avatar: user.avatar
    });
    setShowEditModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file || null);
    if (file) {
      setPreview(URL.createObjectURL(file));
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size terlalu besar. Maksimal 5MB.');
        e.target.value = '';
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Hanya file gambar yang diizinkan.');
        e.target.value = '';
        return;
      }
    }
  }

  const handleUpdate = async () => {
    try {
      const formData = new FormData();
      formData.append('username', editForm.username);
      formData.append('email', editForm.email);
      formData.append('role', editForm.role);

      if (avatar && typeof avatar === 'object') {
        formData.append('avatar', avatar);
      }

      await userService.updateUser(editForm._id, formData);
      setShowEditModal(false);
      setPreview(null);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error updating user:', error);
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
    }
  };

  const handleAdd = () => {
    setAddForm({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user'
    });
    setFormErrors({});
    setShowAddModal(true);
  };

  const validateAddForm = () => {
    const errors = {};

    if (!addForm.username.trim()) {
      errors.username = 'Username wajib diisi';
    } else if (addForm.username.length < 3) {
      errors.username = 'Username minimal 3 karakter';
    }

    if (!addForm.email.trim()) {
      errors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(addForm.email)) {
      errors.email = 'Format email tidak valid';
    }

    if (!addForm.password) {
      errors.password = 'Password wajib diisi';
    } else if (addForm.password.length < 6) {
      errors.password = 'Password minimal 6 karakter';
    }

    if (!addForm.confirmPassword) {
      errors.confirmPassword = 'Konfirmasi password wajib diisi';
    } else if (addForm.password !== addForm.confirmPassword) {
      errors.confirmPassword = 'Password tidak cocok';
    }

    return errors;
  };

  const handleCreate = async () => {
    const errors = validateAddForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', addForm.username);
      formData.append('email', addForm.email);
      formData.append('password', addForm.password);
      formData.append('role', addForm.role);
      if (avatar) formData.append('avatar', avatar);
      await userService.createUser(formData)

      setShowAddModal(false);
      setFormErrors({});
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error creating user:', error);
      const errorMessage = error.response?.data?.message || error.message;

      if (errorMessage.includes('already exists')) {
        setFormErrors({
          general: 'Username atau email sudah digunakan'
        });
      } else {
        setFormErrors({
          general: 'Error membuat user: ' + errorMessage
        });
      }
    }
  };


  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await userService.deleteUser(userToDelete._id);
      setShowDeleteModal(false);
      setUserToDelete(null);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user: ' + (error.response?.data?.message || error.message));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: {
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        label: 'Admin',
        icon: '👑'
      },
      user: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        label: 'User',
        icon: '👤'
      }
    };

    const config = roleConfig[role];
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color} flex items-center space-x-1`}>
        <span>{config.icon}</span>
        <span>{config.label}</span>
      </span>
    );
  };

  const SortIcon = ({ field }) => {
    if (filters.sortBy !== field) return <span>↕</span>;
    return filters.sortOrder === 'asc' ? <span>↑</span> : <span>↓</span>;
  };

  const roleFilters = [
    { value: 'all', label: 'Semua', count: stats.total, color: 'bg-gray-500' },
    { value: 'admin', label: 'Admin', count: stats.admin, color: 'bg-purple-500' },
    { value: 'user', label: 'User', count: stats.user, color: 'bg-blue-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manajemen Pengguna</h1>
              <p className="text-gray-600 mt-2">
                Kelola data pengguna dan akses sistem perpustakaan
              </p>
            </div>
            <button
              onClick={handleAdd}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Tambah User
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {roleFilters.map((filter) => (
            <div
              key={filter.value}
              className={`bg-white rounded-lg p-4 shadow-sm border cursor-pointer transition-all ${filters.role === filter.value ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
                }`}
              onClick={() => handleRoleFilter(filter.value)}
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
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari Pengguna
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari username atau email..."
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

            <div className="flex space-x-3">
              {(filters.role !== 'all' || filters.search) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Hapus Filter
                </button>
              )}
            </div>
          </div>

          {/* Active Filters */}
          <div className="flex flex-wrap items-center gap-2 mt-4">
            {(filters.role !== 'all' || filters.search) && (
              <>
                <span className="text-sm text-gray-600">Filter aktif:</span>
                {filters.role !== 'all' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Role: {roleFilters.find(f => f.value === filters.role)?.label}
                    <button
                      onClick={() => handleRoleFilter('all')}
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
                  Data Pengguna
                </h2>
                <p className="text-sm text-gray-600">
                  Menampilkan {pagination.totalItems} pengguna
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
                            className="w-10 h-10 rounded-full object-cover border cursor-pointer hover:opacity-80"
                            onClick={() => (setShowPreviewModal(true), setSelectedImage(user.avatar))}
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
                      {getRoleBadge(user.role)}
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
                          onClick={() => fetchUserDetails(user._id)}
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Tidak ada data pengguna</h3>
              <p className="mt-2 text-sm text-gray-500">
                {filters.role !== 'all' || filters.search
                  ? 'Coba ubah filter pencarian Anda'
                  : 'Belum ada pengguna terdaftar'
                }
              </p>
              {(filters.role !== 'all' || filters.search) && (
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
                  dari <span className="font-medium">{pagination.totalItems}</span> pengguna
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

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Tambah Pengguna Baru</h3>

              {formErrors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {formErrors.general}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addForm.username}
                    onChange={(e) => setAddForm(prev => ({ ...prev, username: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.username ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Masukkan username"
                  />
                  {formErrors.username && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.username}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={addForm.email}
                    onChange={(e) => setAddForm(prev => ({ ...prev, email: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.email ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Masukkan email"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={addForm.password}
                    onChange={(e) => setAddForm(prev => ({ ...prev, password: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.password ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Masukkan password"
                  />
                  {formErrors.password && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konfirmasi Password <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    value={addForm.confirmPassword}
                    onChange={(e) => setAddForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                      }`}
                    placeholder="Konfirmasi password"
                  />
                  {formErrors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.confirmPassword}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Format: JPG, PNG, WEBP. Maksimal 5MB.
                  </p>
                  {avatar && typeof avatar === 'object' && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                      <div className="w-32 h-40 bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(avatar)}
                          alt="Preview cover"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={addForm.role}
                    onChange={(e) => setAddForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => (setShowAddModal(false), setPreview(null))}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleCreate}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                >
                  Tambah User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Detail Pengguna</h3>
                <button
                  onClick={() => setShowUserModal(false)}
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
                      <p className="font-medium">{selectedUser.user.username}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Email:</label>
                      <p className="font-medium">{selectedUser.user.email}</p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Role:</label>
                      <div className="mt-1">{getRoleBadge(selectedUser.user.role)}</div>
                    </div>
                    <div>
                      <label className="text-sm text-gray-600">Bergabung:</label>
                      <p className="font-medium">{formatDate(selectedUser.user.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Statistik Peminjaman</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Total Dipinjam:</span>
                      <span className="font-medium">{selectedUser.stats.totalBorrowed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Sedang Dipinjam:</span>
                      <span className="font-medium text-orange-600">{selectedUser.stats.currentlyBorrowed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Telah Dikembalikan:</span>
                      <span className="font-medium text-green-600">{selectedUser.stats.totalReturned}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Currently Borrowed Books */}
              {selectedUser.borrowedBooks.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Buku Sedang Dipinjam</h4>
                  <div className="space-y-2">
                    {selectedUser.borrowedBooks.map((book) => (
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
              {selectedUser.borrowingHistory.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Riwayat Terbaru</h4>
                  <div className="space-y-2">
                    {selectedUser.borrowingHistory.map((history) => (
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
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Edit Pengguna</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar
                  </label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  {preview && (
                    <button
                      type="button"
                      onClick={() => setShowPreviewModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors mt-4"
                    >
                      Preview
                    </button>
                  )}
                </div>


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm(prev => ({ ...prev, role: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => (setShowEditModal(false), setPreview(null))}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && <PreviewAvatar avatar={selectedImage} setShowPreviewModal={setShowPreviewModal} />}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-center mb-2">Hapus Pengguna</h3>
              <p className="text-gray-600 text-center mb-4">
                Apakah Anda yakin ingin menghapus pengguna <strong>{userToDelete.username}</strong>?
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
      )}
    </div>
  );
};

export default UsersTable;
