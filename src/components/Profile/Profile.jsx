import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import userService from '../../services/userService';
import Button from "../atoms/Button";
import UserUpdate from './UserUpdate';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [user, setUser] = useState(null)
  const [showLightbox, setShowLightbox] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const loadUser = async () => {
    try {
      const user = await userService.getProfile()
      setUser(user)
    } catch (error) {
      toast.error('Failed to load user')
    }
  }
  useEffect(() => {
    loadUser()
  }, [])

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

      if (avatar && typeof avatar === 'object') {
        formData.append('avatar', avatar);
      }

      await userService.updateUser(editForm._id, formData);
      setShowEditModal(false);
      setPreview(null);
      loadUser(); // Refresh data
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

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm mx-auto mt-10">
        {/* <div className="flex flex-col items-center"> */}
        <div className="flex flex-col items-center pb-10 pt-4">
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border cursor-pointer hover:opacity-80"
            onClick={() => setShowLightbox(true)}
          />
          <h2 className="mb-1 text-xl font-meduium">{user.username}</h2>
          <p className="text-sm text-gray-600">{user.email}</p>
          <div className="flex mt-4 md:mt-6">
            <Button onClick={() => setShowEditModal(true)}
              type="button"
              variant="primary"
              className="mt-4"
            >
              Update
            </Button>
          </div>
        </div>
      </div >

      {/* Lightbox Modal */}
      {showLightbox && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setShowLightbox(false)}
        >
          <img
            src={user.avatar}
            alt="Avatar besar"
            className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()} // supaya klik gambar tidak menutup modal
          />
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-5 right-5 text-white text-3xl font-bold"
          >
            &times;
          </button>
        </div>
      )}

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
    </>
  )
}

