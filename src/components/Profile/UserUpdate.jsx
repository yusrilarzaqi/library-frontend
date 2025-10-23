import { XIcon, CheckIcon } from '@heroicons/react/outline';
import Label from '../atoms/Label';
import Input from '../atoms/Input';
import { toast } from 'react-toastify';
import InputFile from '../atoms/InputFile';
import { useState } from 'react';

const UserForm = ({ onUpdate, onCancel, initialData = {} }) => {
  const [formData, setFormData] = useState({
    username: initialData.username,
    email: initialData.email,
    password: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file || null);
    if (file) setPreview(URL.createObjectURL(file));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const form = new FormData();

      form.append("username", formData.username);
      form.append("email", formData.email);

      if (formData.password) form.append("password", formData.password);
      if (avatar) form.append("avatar", avatar);

      onUpdate(form);
      onCancel();
    } catch (error) {
      console.error('Failed to borrow data:', error);
      toast.error('Failed to update user')
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              name="username"
              type="text"
              defaultValue={initialData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={initialData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="avatar">Avatar</Label>
            <InputFile
              id="avatar"
              name="avatar"
              type="file"
              accept="image/*"
              variant="primary"
              onChange={handleFileChange}
            />
            {preview && (
              <p className="text-sm text-green-600 mt-1">
                Gambar baru siap diunggah
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <XIcon className="-ml-1 mr-2 h-5 w-5" />
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <CheckIcon className="-ml-1 mr-2 h-5 w-5" />
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;

