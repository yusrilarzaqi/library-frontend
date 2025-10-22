import { useState, useEffect } from 'react';
import { XIcon, CheckIcon } from '@heroicons/react/outline';
import Input from '../atoms/Input';
import InputFile from '../atoms/InputFile';
import Label from '../atoms/Label';
import Button from '../atoms/Button';

const DataUpdate = ({ onCancel, initialData, onUpdate }) => {
  const [formData, setFormData] = useState(initialData);
  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isPreview, setIsPreview] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCover(file || null);
    if (file) setPreview(URL.createObjectURL(file));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const form = new FormData();

      form.append("nomor", formData.nomor);
      form.append("level", formData.level);
      form.append("judul", formData.judul);
      form.append("penulis", formData.penulis);
      form.append("kodeJudul", formData.kodeJudul);
      form.append("kodePenulis", formData.kodePenulis);

      if (cover) form.append("coverImage", cover);

      onUpdate(initialData._id, form);
      onCancel();
    } catch (error) {
      console.error('Failed to borrow data:', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor</label>
            <input
              type="text"
              name="nomor"
              defaultValue={initialData.nomor}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <input
              type="text"
              name="level"
              defaultValue={initialData.level}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Penulis</label>
            <input
              type="text"
              name="penulis"
              defaultValue={initialData.penulis}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kode Judul</label>
            <input
              type="text"
              name="kodeJudul"
              defaultValue={initialData.kodeJudul}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kode Penulis</label>
            <input
              type="text"
              name="kodePenulis"
              defaultValue={initialData.kodePenulis}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <Label htmlFor="coverImage">Cover Buku</Label>
            <InputFile
              id="coverImage"
              accept="image/*"
              name="coverImage"
              onChange={handleFileChange}
            />
            {isPreview ? (
              <div
                className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                onClick={() => setIsPreview(false)}
              >
                <img
                  src={preview || `http://localhost:3000/uploads/${initialData.coverImage}`}
                  alt="Avatar besar"
                  className="max-w-[90%] max-h-[90%] rounded-lg shadow-lg"
                  onClick={(e) => e.stopPropagation()} // supaya klik gambar tidak menutup modal
                />
                <button
                  type="button"
                  onClick={() => setIsPreview(false)}
                  className="absolute top-5 right-5 text-white text-3xl font-bold"
                >
                  &times;
                </button>
              </div>
            ) : (
              <Button type="button" onClick={() => setIsPreview(true)} className="mt-2">Preview</Button>
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
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataUpdate;
