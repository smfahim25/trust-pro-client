import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../../api/getApiURL";
import { toast } from "react-toastify";
import axios from "axios";
import DeleteModal from "../DeleteModal/DeleteModal";
import DetailsCard from "./DetailsCard";
import { useUser } from "../../../context/UserContext";
import getMetalCoinName from "../../utils/getMetalCoinName";
import Pagination from "../../Pagination/Pagination";
import { useSocketContext } from "../../../context/SocketContext";

const Trading = () => {
  const [trades, setTrades] = useState([]);
  const { setLoading } = useUser();
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [tradeDetail, setTradeDetail] = useState(null);
  const [selectedTradeId, setSelectedTradeId] = useState(null);

  const { socket } = useSocketContext();

  useEffect(() => {
    const fetchTradeOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/tradeorder`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTrades(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTradeOrders();
    if (isUpdated) {
      fetchTradeOrders();
    }
  }, [isUpdated, setLoading]);

  // filtering and pagination
  const [filteredTrades, setFilteredTrades] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const tradesPerPage = 20;

  useEffect(() => {
    const filtered = trades
      ?.reverse()
      .filter((trade) =>
        trade.user_uuid.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setFilteredTrades(filtered);
    setPage(1); // Reset to first page on search
  }, [searchTerm, trades]);

  // Calculate total pages
  const totalPages = Math.ceil(filteredTrades.length / tradesPerPage);

  // Get current page's data
  const indexOfLastTrade = page * tradesPerPage;
  const indexOfFirstTrade = indexOfLastTrade - tradesPerPage;
  const currentTrades = filteredTrades.slice(
    indexOfFirstTrade,
    indexOfLastTrade
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDelete = async (tradeId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/tradeorder/${tradeId}`
      );
      console.log("Delete response: ", response);
      setTrades((prevTrades) =>
        prevTrades.filter((trade) => trade.id !== tradeId)
      );
      toast.success("Delete Successful");
    } catch (error) {
      console.error("There was an error deleting the trade: ", error);
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

  const openDetailsModal = (trade) => {
    setTradeDetail(trade);
    setIsDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setTradeDetail(null);
  };

  const confirmDelete = () => {
    if (selectedTradeId) {
      handleDelete(selectedTradeId);
    }
    closeModal();
  };

  const handleProfitUpdate = async (trade) => {
    const updatedUser = {
      is_profit: trade.is_profit === 1 ? 0 : 1,
    };

    try {
      const response = await axios.put(
        `${API_BASE_URL}/tradeorder/${trade.id}`,
        updatedUser
      );
      toast.success("Trade updated successfully");
      console.log("Data successfully submitted:", response);
      setIsUpdated(!isUpdated);
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("Failed to update user.");
    }
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

  useEffect(() => {
    const handleUpdateTrading = (data) => {
      console.log("new trade added: ", data);
      if (data) {
        console.log("handleUpdateSuccess called");
        setIsUpdated(!isUpdated);
      }
    };
    socket?.on("newTradeOrder", handleUpdateTrading);
    return () => socket?.off("newTradeOrder", handleUpdateTrading);
  }, [socket, setIsUpdated, isUpdated]);

  useEffect(() => {
    const handleUpdateTrading = (data) => {
      console.log("trade status changed : ", data);
      if (data) {
        console.log("handleUpdateSuccess called");
        setIsUpdated(!isUpdated);
      }
    };
    socket?.on("updateTradeStatus", handleUpdateTrading);
    return () => socket?.off("updateTradeStatus", handleUpdateTrading);
  }, [socket, setIsUpdated, isUpdated]);

  return (
    <div className="h-[80vh] overflow-x-auto overflow-y-auto">
      <input
        type="text"
        placeholder="Search by UUID"
        value={searchTerm}
        onChange={handleSearchChange}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <table className="min-w-full border border-gray-300  ">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">#</th>
            <th className="py-2 px-4 border-b">UUID</th>
            <th className="py-2 px-4 border-b">Order Id</th>
            <th className="py-2 px-4 border-b">Trade Coin</th>
            <th className="py-2 px-4 border-b">Trade Position</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Trading Date</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {currentTrades?.map((trade, index) => (
            <tr key={trade.id}>
              <td className="py-2 px-4 border-b">{index + 1}</td>
              <td className="py-2 px-4 border-b">{trade?.user_uuid}</td>
              <td className="py-2 px-4 border-b">{trade?.order_id}</td>

              <td className="py-2 px-4 border-b">
                {getMetalCoinName(trade?.trade_coin_id)}
              </td>
              <td className={`py-2 px-4 border-b text-white font-semibold`}>
                <span
                  className={`${
                    trade?.order_position === "buy"
                      ? "bg-green-600"
                      : "bg-red-600"
                  } px-5 py-2`}
                >
                  {trade?.order_position}
                </span>
              </td>
              <td className="py-2 border-b text-white font-semibold">
                <span
                  className={`${
                    trade?.status === "running" ? "bg-green-600" : "bg-blue-600"
                  } px-5 py-2`}
                >
                  {trade?.status}
                </span>
              </td>
              <td className="py-2 px-4 border-b">
                {getFormattedDeliveryTime(trade?.created_at)}
              </td>

              <td className="py-2 px-4 border-b">
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => openDetailsModal(trade)}
                    className="text-xs bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded mr-2"
                  >
                    Details
                  </button>
                  {trade.status === "running" && (
                    <button
                      onClick={() => handleProfitUpdate(trade)}
                      className={`text-xs text-white mr-2 py-1 px-2 rounded ${
                        trade.is_profit === 1
                          ? "bg-red-600 hover:bg-red-700"
                          : "bg-green-600 hover:bg-green-500"
                      }`}
                    >
                      {trade.is_profit === 1 ? "Lose" : "Profit"}
                    </button>
                  )}

                  <button
                    onClick={() => openModal(trade.id)}
                    className="text-xs bg-red-500 hover:bg-red-600 text-white py-1 px-2 mr-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <DeleteModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        title="Trade"
        description="This action cannot be undone."
      />
      <DetailsCard
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
        details={tradeDetail}
      />

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
};

export default Trading;
