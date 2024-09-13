import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../api/getApiURL";
import DepositModal from "../Deposits/DepositModal";
import axios from "axios";
import { toast } from "react-toastify";
import DeleteModal from "../DeleteModal/DeleteModal";
import { useUser } from "../../../context/UserContext";
import Pagination from "../../Pagination/Pagination";
import { useSocketContext } from "../../../context/SocketContext";

const Withdraws = () => {
  const [withdraws, setWithdraws] = useState([]);
  const { setLoading } = useUser();
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepositId, setSelectedTradeId] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [depositDetail, setDepositDetail] = useState(null);
  const [refreshDeposit, setRefreshDeposit] = useState(false);
  const { socket } = useSocketContext();

  useEffect(() => {
    const fetchWithdrawInfo = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/withdraws`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setWithdraws(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWithdrawInfo();
    if (refreshDeposit) {
      fetchWithdrawInfo();
    }
  }, [refreshDeposit, setLoading]);

  const handleDelete = async (withdrawID) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/withdraws/${withdrawID}`
      );
      console.log("Delete response: ", response);
      setWithdraws((prevWithdraws) =>
        prevWithdraws.filter((deposit) => deposit.id !== withdrawID)
      );
      toast.success("Delete Successful");
    } catch (error) {
      console.error("There was an error deleting the withdraws: ", error);
      toast.error("Delete Failed");
    }
  };

  const openModal = (tradeId) => {
    setSelectedTradeId(tradeId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTradeId(null);
  };

  const confirmDelete = () => {
    if (selectedDepositId) {
      handleDelete(selectedDepositId);
    }
    closeModal();
  };
  const openDetailsModal = (trade) => {
    setDepositDetail(trade);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setDepositDetail(null);
  };

  const handleUpdateSuccess = () => {
    setRefreshDeposit(!refreshDeposit);
  };

  // filtering and pagination
  const [filteredWithdraws, setFilteredWithdraws] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const tradesPerPage = 25;

  useEffect(() => {
    const filtered = withdraws
      ?.reverse()
      .filter((trade) =>
        trade.user_uuid.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredWithdraws(filtered);
    setPage(1); // Reset to first page on search
  }, [searchTerm, withdraws]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredWithdraws.length / tradesPerPage);

  // Get current page's data
  const indexOfLastTrade = page * tradesPerPage;
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;
  const currentWithdraws = filteredWithdraws.slice(
    indexOfFirstTrade,
    indexOfLastTrade
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const formatWalletAddress = (address) => {
    const handleCopyAddress = () => {
      navigator.clipboard.writeText(address);
      toast.success("Address copied to clipboard!");
    };

    return (
      <span
        onClick={handleCopyAddress}
        style={{ display: "block", cursor: "pointer" }}
        className="text-blue-500"
      >
        {address?.match(/.{1,14}/g)?.map((segment, index) => (
          <span key={index} style={{ display: "block" }}>
            {segment}
          </span>
        ))}
      </span>
    );
  };

  const formatTrans = (address) => {
    return address?.match(/.{1,14}/g)?.map((segment, index) => (
      <span key={index} style={{ display: "block" }}>
        {segment}
      </span>
    ));
  };

  useEffect(() => {
    const handleUpdateWithdraw = (data) => {
      if (data) {
        setRefreshDeposit(!refreshDeposit);
      }
    };
    socket?.on("newWithdraw", handleUpdateWithdraw);
    return () => socket?.off("newWithdraw", handleUpdateWithdraw);
  }, [socket, setRefreshDeposit, refreshDeposit]);

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
      <input
        type="text"
        placeholder="Search by UUID"
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">#</th>
            <th className="py-2 px-4 border-b">UUID</th>
            <th className="py-2 px-4 border-b">Wallet</th>

            <th className="py-2 px-4 border-b">Amount</th>
            <th className="py-2 px-4 border-b">Wallet Address</th>
            <th className="py-2 px-4 border-b">Transaction Hash</th>
            <th className="py-2 px-4 border-b">Withdraw Date</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {currentWithdraws?.map((withdraw, index) => (
            <tr key={withdraw.id}>
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b">{withdraw?.user_uuid}</td>
              <td className="py-2 px-4 border-b">{withdraw?.coin_name}</td>
              <td className="py-2 px-4 border-b">{withdraw?.amount}</td>
              <td className="py-2 px-4 border-b">
                {formatWalletAddress(withdraw?.wallet_to)}
              </td>
              <td className="py-2 px-4 border-b">
                {formatTrans(withdraw?.trans_hash)}
              </td>
              <td className="py-2 px-4 border-b">
                {getFormattedDeliveryTime(withdraw?.created_at)}
              </td>
              <td className="py-2 px-4 border-b">{withdraw.status}</td>
              <td className="py-2 px-4 border-b">
                {withdraw.status === "pending" && (
                  <button
                    onClick={() => openDetailsModal(withdraw)}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => openModal(withdraw.id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <DeleteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        title="Withdraw"
        description="This action cannot be undone."
      />

      <DepositModal
        title="Withdraw"
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
        details={depositDetail}
        onUpdateSuccess={handleUpdateSuccess}
      />

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
};

export default Withdraws;
