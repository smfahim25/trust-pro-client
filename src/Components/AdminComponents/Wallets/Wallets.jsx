import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../../api/getApiURL";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import DeleteModal from "../DeleteModal/DeleteModal";
import { useUser } from "../../../context/UserContext";

const Wallets = () => {
  const [wallets, setWallets] = useState([]);
  const { setLoading } = useUser();
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState(null);

  useEffect(() => {
    const fetchWalletInfo = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/wallets`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setWallets(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletInfo();
  }, [setLoading]);

  const handleDelete = async (walletID) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/wallets/${walletID}`
      );
      console.log("Delete response: ", response);
      setWallets((prevWallets) =>
        prevWallets.filter((wallet) => wallet.id !== walletID)
      );
      toast.success("Delete Successful");
    } catch (error) {
      console.error("There was an error deleting the wallet: ", error);
      toast.error("Delete Failed");
    }
  };

  const openModal = (walletID) => {
    setSelectedWalletId(walletID);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWalletId(null);
  };

  const confirmDelete = () => {
    if (selectedWalletId) {
      handleDelete(selectedWalletId);
    }
    closeModal();
  };
  const handleEdit = () => {
    console.log("deleting ");
  };

  return (
    <div className="h-[80vh] overflow-x-auto overflow-y-auto">
      <Link to="/cradmin/new-wallet">
        <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded mr-2 mb-2">
          Add New
        </button>
      </Link>
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">#</th>
            {/* <th className="py-2 px-4 border-b">Coin ID</th> */}
            <th className="py-2 px-4 border-b">Coin Symbol</th>

            <th className="py-2 px-4 border-b">Coin Name</th>
            <th className="py-2 px-4 border-b">Wallet Network</th>
            <th className="py-2 px-4 border-b">Wallet Address</th>
            <th className="py-2 px-4 border-b">Wallet QR</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {wallets?.map((wallet, index) => (
            <tr key={wallet.id}>
              <td className="py-2 px-4 border-b">{index + 1}</td>
              {/* <td className="py-2 px-4 border-b">{wallet.coin_id}</td> */}
              <td className="py-2 px-4 border-b">{wallet?.coin_symbol}</td>
              <td className="py-2 px-4 border-b">{wallet?.coin_name}</td>
              <td className="py-2 px-4 border-b">{wallet.wallet_network}</td>
              <td className="py-2 px-4 border-b">
                {wallet.wallet_address.slice(0, 10)}..
              </td>
              <td className="py-2 px-4 border-b">
                <div className="bg-white w-[40px] h-[40px]">
                  <img
                    src={`${API_BASE_URL}/${wallet?.wallet_qr}`}
                    className="w-full h-full object-cover"
                    alt="qr"
                  />
                </div>
              </td>
              <td className="py-2 px-4 border-b">{wallet.status}</td>
              <td className="py-2 px-4 border-b">
                <Link to={"/cradmin/edit-wallet"} state={{ wallet }}>
                  <button className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-2 rounded mr-2">
                    Edit
                  </button>
                </Link>

                <button
                  onClick={() => openModal(wallet.id)}
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
        title="Wallet"
        description="This action cannot be undone."
      />

      {/* <Pagination page={page} totalPages={totalPages} setPage={setPage} /> */}
    </div>
  );
};

export default Wallets;
