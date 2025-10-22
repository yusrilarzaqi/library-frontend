const Table = ({ children }) => {
  return (
    <div classname="bg-white shadow-md rounded-lg overflow-hidden">
      <div classname="overflow-x-auto">
        <table classname="min-w-full divide-y divide-gray-200">
          <thead classname="bg-gray-50">
            <tr>
              <th classname="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">nomor</th>
              <th classname="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">judul</th>
              <th classname="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">penulis</th>
              <th classname="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">level</th>
              <th classname="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">actions</th>
            </tr>
          </thead>
          <tbody classname="bg-white divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((item) => (
                <dataitem user={user} key={item._id} data={item} onborrow={handleborrow} onreturn={handlereturn} ondelete={handledelete} onselected={handleselect} onupdate={handleupdatedata} />
              ))
            ) : (
              <tr>
                <td colspan="4" classname="px-6 py-4 text-center text-gray-500">
                  no data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

  );
};

export default Table;
