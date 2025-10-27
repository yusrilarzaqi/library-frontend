import { useEffect, useState } from "react";
import { useCallback } from "react";
import userService from "../../../services/userService";
import borrowService from "../../../services/borrowService";
import Select from "react-select";
import Button from "../../atoms/Button";
import { toast } from "react-toastify";

const BookBorrow = ({ role, onClose, data, fetchData }) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formBoorrowState, setFormBorrowState] = useState({
    userId: "",
    dueDate: ""
  });
  const [formErrors, setFormErrors] = useState({});

  const fetchAvailableUsers = useCallback(async () => {
    if (role === 'admin') {
      try {
        const response = await userService.getAllUsers();
        const result = response.data.map(({ username, _id }) => ({ label: username, value: _id }));
        setAvailableUsers(result);
      } catch (error) {
        console.error('Error fetching available users:', error);
      }
    }
  }, [role])

  useEffect(() => {
    fetchAvailableUsers();
  }, [fetchAvailableUsers]);

  const handleBorrowSubmit = async (e) => {
    e.preventDefault();
    if (!formBoorrowState.userId) {
      setFormErrors({ userId: 'Pilih peminjam terlebih dahulu' });
      return;
    }

    try {
      setLoading(true);
      await borrowService.borrowBook(data._id, formBoorrowState);
      const name = availableUsers.find(user => user.value === formBoorrowState.userId)
      fetchData();
      onClose();
      toast.success(`Buku ${data.judul} berhasil dipinjam oleh ${name.label}`);
    } catch (error) {
      console.error('Error borrowing book:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Pinjam Buku</h3>

          <div className="mb-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900">{data.judul}</h4>
            <p className="text-sm text-blue-700">No: {data.nomor} • {data.penulis}</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pilih Peminjam <span className="text-red-500">*</span>
              </label>
              <Select
                options={availableUsers}
                onChange={(e) => setFormBorrowState(prev => ({ ...prev, userId: e.value }))}
              />
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
                value={formBoorrowState.dueDate}
                onChange={(e) => setFormBorrowState(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            {loading ? (
              <Button
                variant="orange"
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
                  onClick={() => onClose()}
                  variant="secondary"
                >
                  Batal
                </Button>
                <Button
                  onClick={handleBorrowSubmit}
                  variant="orange"
                >
                  Pinjam Buku
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookBorrow;
