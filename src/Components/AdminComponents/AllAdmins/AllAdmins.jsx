import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../../api/getApiURL";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "../../../context/UserContext";
import Pagination from "../../Pagination/Pagination";
import BalanceModal from "../AdminUsers/BalanceModal";
import MoreActionModal from "../AdminUsers/MoreActionModal";
import CreateUserModal from "../AdminUsers/CreateUserModal";

const AllAdmins = () => {
  const { adminUser } = useUser();
  const [users, setUsers] = useState([]);
  const { setLoading } = useUser();
  const [error, setError] = useState(null);
  const [updateSuccess, setIsUpdateSuccess] = useState(false);
  const [refreshDeposit, setRefreshDeposit] = useState(false);

  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [isMore, setIsMore] = useState(false);
  const [isNewUserOpen, setIsNewUserOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/users`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
    if (updateSuccess || refreshDeposit) {
      fetchUserInfo();
    }
  }, [updateSuccess, refreshDeposit]);

  const handleRefUpdate = async (user) => {
    const updatedUser = {
      is_referral: user.is_referral === 1 ? 0 : 1,
    };

    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/${user.id}`,
        updatedUser
      );
      toast.success("User updated successfully");
      console.log("Data successfully submitted:", response);
      setIsUpdateSuccess(!updateSuccess); // Toggle to trigger re-fetch
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to update user.");
    }
  };

  const handleProfitUpdate = async (user) => {
    const updatedUser = {
      is_profit: user.is_profit === 1 ? 0 : 1,
    };

    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/${user.id}`,
        updatedUser
      );
      toast.success("User updated successfully");
      console.log("Data successfully submitted:", response);
      setIsUpdateSuccess(!updateSuccess);
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to update user.");
    }
  };
  const openBalanceModal = (user) => {
    setUserDetails(user);
    setIsBalanceModalOpen(true);
  };

  const closeBalanceModal = () => {
    setIsBalanceModalOpen(false);
    setUserDetails(null);
  };
  const openMore = (user) => {
    setUserDetails(user);
    setIsMore(true);
  };

  const closeMore = () => {
    setIsMore(false);
    setUserDetails(null);
  };

  const openNewUser = () => {
    setIsNewUserOpen(true);
  };

  const closeNewUser = () => {
    setIsNewUserOpen(false);
  };

  const handleUpdateSuccess = () => {
    setRefreshDeposit(!refreshDeposit);
  };

  const handleDelete = () => {
    console.log("deleting ");
  };

  const formatWalletAddress = (address) => {
    return address.match(/.{1,14}/g).map((segment, index) => (
      <span key={index} style={{ display: "block" }}>
        {segment}
      </span>
    ));
  };

  // filtering and pagination
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const tradesPerPage = 25;

  useEffect(() => {
    const filtered = users.filter((trade) =>
      trade.uuid.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
    setPage(1); // Reset to first page on search
  }, [searchTerm, users]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredUsers.length / tradesPerPage);

  // Get current page's data
  const indexOfLastTrade = page * tradesPerPage;
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstTrade, indexOfLastTrade);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const getFormattedDeliveryTime = (createdAt) => {
    const date = new Date(createdAt);

    // Convert date to local time string
    const localDateTime = date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    return localDateTime.replace(",", "");
  };

  return (
    <div className="h-[80vh] overflow-x-auto overflow-y-auto">
      <div className="flex justify-between">
        <input
          type="text"
          placeholder="Search by UUID"
          value={searchTerm}
          onChange={handleSearchChange}
          className="mb-4 p-2 border border-gray-300 rounded"
        />
        {adminUser?.role === "superadmin" && (
          <button
            onClick={openNewUser}
            className="bg-blue-500 hover:bg-blue-600 text-white px-2 rounded mr-4 mb-2"
          >
            Add User
          </button>
        )}
      </div>

      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            {/* <th className="py-2 px-4 border-b">#</th> */}
            <th className="py-2 px-4 border-b">UUID</th>
            <th className="py-2 px-4 border-b">Name</th>

            <th className="py-2 px-4 border-b">Email</th>
            {/* <th className="py-2 px-4 border-b">Mobile</th> */}

            <th className="py-2 px-4 border-b">Wallet</th>
            <th className="py-2 px-4 border-b">Mobile</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Registration</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {currentUsers?.map((user, index) => (
            <tr key={user.id}>
              {/* <td className="py-2 px-4 border-b">{index + 1}</td> */}
              <td className="py-2 px-4 border-b">{user.uuid}</td>
              <td className="py-2 px-4 border-b">{user?.name}</td>
              <td className="py-2 px-4 border-b">{user?.email}</td>

              <td className="py-2 px-4 border-b">
                {formatWalletAddress(user?.user_wallet)}
              </td>

              <td className="py-2 px-4 border-b">{user?.mobile}</td>
              <td className="py-2 px-4 border-b">{user?.role}</td>
              <td className="py-2 px-4 border-b">{user?.status}</td>
              <td className="py-2 px-4 border-b">
                {getFormattedDeliveryTime(user?.user_registered)}
              </td>

              <td className="py-2 px-4 border-b">
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => openBalanceModal(user)}
                    className="bg-gray-800 hover:bg-blue-600 text-xs text-white py-1 px-2 rounded"
                  >
                    Balance
                  </button>
                  {/* <button
                    onClick={() => handleRefUpdate(user)}
                    className={`text-xs text-white py-1 px-2 rounded ${
                      user.is_referral === 1 ? "bg-red-600 hover:bg-red-700" : "bg-gray-800 hover:bg-gray-600"
                    }`}
                  >
                    {user.is_referral === 1 ? "Disable Referral" : "Active Referral"}
                  </button> */}
                  <button
                    onClick={() => handleProfitUpdate(user)}
                    className={`text-xs text-white py-1 px-2 rounded ${
                      user.is_profit === 1
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-gray-800 hover:bg-gray-600"
                    }`}
                  >
                    {user.is_profit === 1 ? "Lose" : "Profit"}
                  </button>
                  {adminUser?.role === "superadmin" && (
                    <button
                      onClick={() => openMore(user)}
                      className={`text-xs text-white py-1 px-2 rounded bg-gray-800 hover:bg-gray-600
                    `}
                    >
                      More
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <BalanceModal
        isOpen={isBalanceModalOpen}
        onClose={closeBalanceModal}
        details={userDetails}
        // onUpdateSuccess={handleUpdateSuccess}
      />
      <MoreActionModal
        isOpen={isMore}
        onClose={closeMore}
        details={userDetails}
        role={adminUser?.role}
        onUpdateSuccess={handleUpdateSuccess}
      />

      <CreateUserModal
        isOpen={isNewUserOpen}
        onClose={closeNewUser}
        onUpdateSuccess={handleUpdateSuccess}
      />

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
};

export default AllAdmins;
