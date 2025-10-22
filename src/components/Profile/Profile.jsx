import { useCallback } from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import userService from '../../services/userService';
import Button from "../atoms/Button";

export default function Profile() {
  const [showEditModal, setShowEditModal] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [user, setUser] = useState(null)
  const [showLightbox, setShowLightbox] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const user = await userService.getProfile()
      setUser(user)
    } catch (error) {
      toast.error('Failed to load user')
    } finally {
      setLoading(false);
    }
  }, [user])

  useEffect(() => {
    loadUser()
  }, [loadUser])

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('username', editForm.username);
      formData.append('email', editForm.email);

      if (avatar && typeof avatar === 'object') {
        formData.append('avatar', avatar);
      }

      await userService.updateUser(user._id, formData);

      setShowEditModal(false);
      setPreview(null);
      loadUser(); // Refresh data
    } catch (error) {
      console.error('Error updating user:', error);
      const errorMessage = error.response?.data?.message || error.message;
      if (errorMessage.includes('already exists')) {
        setFormErrors({
          general: 'user sudah digunakan'
        });
      } else {
        setFormErrors({
          general: 'Error membuat user: ' + errorMessage
        });
      }
    } finally {
      setLoading(false);
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
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full object-cover border cursor-pointer hover:opacity-80"
              onClick={() => setShowLightbox(true)}
            />
          ) : (
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.username?.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
          <h2 className="mb-1 text-xl font-meduium">{user.username}</h2>
          <p className="text-sm text-gray-600">{user.email}</p>
          <div className="flex mt-4 md:mt-6">
            <Button onClick={() => handleEdit(user)}
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
            <form className="p-6" onSubmit={handleUpdate} encType="multipart/form-data">
              <h3 className="text-lg font-semibold mb-4">Edit Pengguna</h3>

              {formErrors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {formErrors.general}
                </div>
              )}

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
                        setPreview(null)
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
      )}
    </>
  )
}

