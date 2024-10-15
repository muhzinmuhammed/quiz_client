import { useState } from "react";
import { useAdminDashboardQuery } from "../../../features/api/userAuth/userAuth";

const Home = () => {
  // Pagination and search states
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  
  // Fetch data based on current page and search input
  const { data: usersData, isLoading: isUsersLoading } = useAdminDashboardQuery({
    page,
    search,
  });

  const users = usersData?.data;
  const totalPages = usersData?.totalPages;

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to page 1 when search changes
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
        <div className="w-full max-w-4xl p-6 bg-white rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Users List</h2>

          {/* Search Input */}
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name"
            className="mb-4 p-2 w-full border rounded"
          />

          {/* Table */}
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Earnings</th>
                <th className="py-3 px-6 text-center">Rewards</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {
                users?.map((user) => (
                  <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left">{user.name}</td>
                    <td className="py-3 px-6 text-left">{user.earnings}</td>
                    <td className="py-3 px-6 text-center">{user.rewards == null ? 'No' : user.rewards}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>

          {/* Pagination Controls */}
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className={`px-4 py-2 bg-blue-500 text-white rounded mr-2 ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Previous
            </button>
            <span className="mx-2">{`Page ${page} of ${totalPages}`}</span>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className={`px-4 py-2 bg-blue-500 text-white rounded ml-2 ${page === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;