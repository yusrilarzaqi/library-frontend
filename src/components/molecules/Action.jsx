import { useState } from 'react';

const Action = ({ data, setIsEditing, handleReturn, onDelete }) => {
  const [loading, setLoading] = useState(false);

  const onReturn = async () => {
    setLoading(true);

    try {
      // await borrowService.returnItem(token, data._id);
      handleReturn(data._id);
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };


  return (
    <td className="px-6 py-4 whitespace-nowrap  text-sm font-medium">
      {data.status === 'borrowed' ? (
        <button
          onClick={() => onReturn(data._id)}
          type="button"
          disabled={loading}
          className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">Return</button>

      ) : (
        <button
          onClick={() => setIsEditing(true)}
          type="button"
          disabled={loading}
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Borrow</button>
      )}
      <button
        onClick={onDelete}
        type="button"
        disabled={loading}
        className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-delete-700 focus:outline-none dark:focus:ring-red-800">Delete</button>
    </td>
  );
};

export default Action;
