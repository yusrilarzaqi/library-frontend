import { useState } from 'react';
import Button from '../../atoms/Button';
import InputFile from '../../atoms/InputFile';

const BookForm = ({ formData, loading, onSubmit, onCancel, mode = 'create' }) => {
  const [formErrors, setFormErrors] = useState({});
  const [formDataState, setFormDataState] = useState(formData);
  const [preview, setPreview] = useState(null);

  const validateForm = () => {
    const errors = {};

    if (!formDataState.nomor.trim()) {
      errors.nomor = 'Nomor buku wajib diisi';
    }

    if (!formDataState.judul.trim()) {
      errors.judul = 'Judul buku wajib diisi';
    }

    if (!formDataState.level.trim()) {
      errors.level = 'Level buku wajib diisi';
    }

    if (!formDataState.penulis.trim()) {
      errors.penulis = 'Penulis buku wajib diisi';
    }

    if (!formDataState.kodeJudul.trim()) {
      errors.kodeJudul = 'Kode judul wajib diisi';
    }

    if (!formDataState.kodePenulis.trim()) {
      errors.kodePenulis = 'Kode penulis wajib diisi';
    }

    return errors;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPreview(URL.createObjectURL(file));
    setFormDataState({ ...formDataState, coverImage: file });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    onSubmit(formDataState);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onCancel}>
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <form className="p-6" onSubmit={handleSubmit} encType="multipart/form-data">
          <h3 className="text-lg font-semibold mb-4">{mode === 'create' ? 'Tambah Buku Baru' : 'Edit Buku'}</h3>

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
                value={formDataState.nomor}
                onChange={(e) => setFormDataState({ ...formDataState, nomor: e.target.value })}
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
                value={formDataState.level}
                onChange={(e) => setFormDataState({ ...formDataState, level: e.target.value })}
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
                value={formDataState.judul}
                onChange={(e) => setFormDataState({ ...formDataState, judul: e.target.value })}
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
                value={formDataState.penulis}
                onChange={(e) => setFormDataState(({ ...formDataState, penulis: e.target.value }))}
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
                value={formDataState.kodeJudul}
                onChange={(e) => setFormDataState(({ ...formDataState, kodeJudul: e.target.value }))}
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
                value={formDataState.kodePenulis}
                onChange={(e) => setFormDataState(({ ...formDataState, kodePenulis: e.target.value }))}
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
              <InputFile
                id="coverImage"
                name="coverImage"
                type="file"
                accept="image/*"
                variant={mode === "create" ? "primary" : "success"}
                onChange={handleFileChange}
              />
              <p className="mt-1 text-xs text-gray-500">
                Format: JPG, PNG, WEBP. Maksimal 5MB.
              </p>
              {preview && (
                <p className="text-sm text-green-600 mt-1">
                  Gambar baru siap diunggah
                </p>
              )}
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
                    onClick={() => {
                      onCancel();
                      setPreview(null)
                    }}
                    variant="secondary"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    variant={mode === "create" ? "primary" : "success"}
                  >
                    {mode === "create" ? "Tambah Buku" : "Simpan Perubahan"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </form>
      </div >
    </div >
  );
};

export default BookForm;
