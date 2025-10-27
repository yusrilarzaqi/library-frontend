import { useState } from 'react'
import InputFile from '../../atoms/InputFile';
import Button from '../../atoms/Button';

const UserForm = ({ onClose, onSubmit, data, mode = 'create', loading }) => {
  const [form, setForm] = useState(data);
  const [formErrors, setFormErrors] = useState({});

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setForm(prev => ({ ...prev, avatar: selectedFile }));
  };

  const validateForm = () => {
    const errors = {};

    if (!form.username.trim()) {
      errors.username = 'Username wajib diisi';
    } else if (form.username.length < 3) {
      errors.username = 'Username minimal 3 karakter';
    }

    if (!form.email.trim()) {
      errors.email = 'Email wajib diisi';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errors.email = 'Format email tidak valid';
    }

    if (mode !== 'edit') {
      if (!form.password) {
        errors.password = 'Password wajib diisi';
      } else if (form.password.length < 6) {
        errors.password = 'Password minimal 6 karakter';
      } else if (form.password.length > 20) {
        errors.password = 'Password maksimal 20 karakter';
      }

      if (!form.confirmPassword) {
        errors.confirmPassword = 'Konfirmasi password wajib diisi';
      } else if (form.password !== form.confirmPassword) {
        errors.confirmPassword = 'Password tidak cocok';
      }

    }

    return errors;
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', form.username);
      formData.append('email', form.email);
      formData.append('password', form.password);
      formData.append('role', form.role);
      if (form.avatar) formData.append('avatar', form.avatar);
      setFormErrors({});
      onSubmit(formData)
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {mode === 'create' ? 'Tambah Pengguna Baru' : 'Edit Pengguna'}
          </h3>
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
                value={form.username}
                onChange={(e) => setForm(prev => ({ ...prev, username: e.target.value }))}
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
                value={form.email}
                onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value }))}
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
                value={form.password}
                onChange={(e) => setForm(prev => ({ ...prev, password: e.target.value }))}
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
                value={form.confirmPassword}
                onChange={(e) => setForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
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
              <InputFile
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                variant={mode === 'create' ? 'primary' : 'success'}
              />
              <p className="mt-1 text-xs text-gray-500">
                Format: JPG, PNG, WEBP. Maksimal 5MB.
              </p>
              {form.avatar && typeof form.avatar === 'object' && (
                <p className="text-sm text-green-600 mt-1">
                  Gambar baru siap diunggah
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm(prev => ({ ...prev, role: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            {loading ? (
              <Button
                variant={mode === "create" ? "primary" : "success"}
                disabled
              >
                <svg aria-hidden="true" role="status" className="inline w-4 h-4 me-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="#E5E7EB" />
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentColor" />
                </svg>
                Loading...
              </Button>
            ) : (
              <>
                <Button
                  onClick={onClose}
                  variant="secondary"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant={mode === "create" ? "primary" : "success"}
                >
                  {mode === "create" ? "Tambah" : "Simpan"}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserForm;
