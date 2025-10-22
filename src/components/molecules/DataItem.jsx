import { useState } from 'react';
// import { PencilIcon, TrashIcon, CheckIcon, XIcon } from '@heroicons/react/outline';
import DataForm from './DataForm';
import { useAuth } from '../../context/AuthContext';
import Action from './Action';

const DataItem = ({ user, data, onBorrow, onReturn, onDelete }) => {
  const { user: { role, token } } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const handleDelete = () => {
    try {
      onDelete(data._id);
    } catch (error) {
      console.error('Failed to delete data:', error);
    }
  };

  const handleReturn = (bookId) => {
    try {
      onReturn(bookId);
    } catch (error) {
      console.error('Failed to Return data:', error);
    }
  };

  const handleBorrow = (date, userId, bookId) => {
    try {
      onBorrow(date, userId, bookId);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to borrow data:', error);
    }
  };

  return (
    <>
      {isEditing && role === 'admin' ? (
        <tr className="bg-gray-50">
          <td colSpan="5" className="px-6 py-4">
            <DataForm
              onBorrow={handleBorrow}
              token={token}
              initialData={data}
              onCancel={() => setIsEditing(false)}
            />
          </td>
        </tr>
      ) : (
        <tr>
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            {data._id}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {data.username}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {data.email}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {data.role}
          </td>
          {role === 'admin' ? <Action setIsEditing={setIsEditing} onDelete={handleDelete} data={data} /> : ""}
        </tr>
      )}
    </>
  );
};

export default DataItem;


