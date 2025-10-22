import { useState } from 'react';
import { XIcon, CheckIcon } from '@heroicons/react/outline';
import Input from '../atoms/Input';
import Label from '../atoms/Label';
import InputFile from '../atoms/InputFile';

const DataForm = ({ onCancel, onSubmit }) => {
  const [form, setForm] = useState({
    nomor: '',
    judul: '',
    level: '',
    penulis: '',
    kodeJudul: '',
    kodePenulis: '',
    coverImage: null
  })

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="nomor">Nomor</Label>
            <Input
              id="nomor"
              type="text"
              name="nomor"
              value={form.nomor}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="judul">Judul</Label>
            <Input
              id="judul"
              type="text"
              name="judul"
              value={form.judul}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="level">Level</Label>
            <Input
              id="level"
              type="text"
              name="level"
              value={form.level}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="penulis">Penulis</Label>
            <Input
              id="Penulis"
              type="text"
              name="penulis"
              value={form.penulis}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="kodeJudul">KodeJudul</Label>
            <Input
              id="kodeJudul"
              type="text"
              name="kodeJudul"
              value={form.kodeJudul}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="kodePenulis">Kode Penulis</Label>
            <Input
              id="kodePenulis"
              type="text"
              name="kodePenulis"
              value={form.kodePenulis}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="coverImage">Cover Buku</Label>
            <InputFile
              id="coverImage"
              type="file"
              accept="image/*"
              name="coverImage"
              onChange={handleChange}
            />
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

export default DataForm;

