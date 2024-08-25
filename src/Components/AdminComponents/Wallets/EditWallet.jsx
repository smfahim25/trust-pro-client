import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE_URL from "../../../api/getApiURL";

const EditWallet = () => {
  const location = useLocation();
  const existingWallet = location.state.wallet;
  const coinAPI = "https://api.coinlore.net/api/tickers/?limit=50";
  const navigate = useNavigate();
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coinsData, setCoinsData] = useState([]);
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [formData, setFormData] = useState({
    coin_id: existingWallet.coin_id,
    coin_name: existingWallet.coin_name,
    coin_logo: existingWallet.coin_logo,
    wallet_network: existingWallet.wallet_network,
    coin_symbol: existingWallet.coin_symbol,
    wallet_address: existingWallet.wallet_address,
    wallet_qr: existingWallet.wallet_qr,
    status: existingWallet.status,
  });

  useEffect(() => {
    const fetchCoinsData = async () => {
      setLoading(true);
      try {
        const response = await fetch(coinAPI);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCoinsData(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinsData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setQrCode(file);
    setFormData((prevFormData) => ({
      ...prevFormData,
      documents: file,
    }));
  };

  const handleCoinChange = (e) => {
    const { value } = e.target;
    const selectedCoinData = coinsData.find((coin) => coin.id === value);
    setSelectedCoin(selectedCoinData);
    setFormData((prevFormData) => ({
      ...prevFormData,
      coin_id: selectedCoinData.id,
      coin_name: selectedCoinData?.name || "",
      coin_logo: "",
      wallet_network: selectedCoinData.nameid,
      coin_symbol: selectedCoinData.symbol,
      wallet_address: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send a POST request to your API with formData
      const response = await axios.put(
        `${API_BASE_URL}/wallets/${existingWallet.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Wallet updated successfully");
      console.log("Data successfully submitted:", response);
      navigate("/cradmin/wallets");
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("failed !", error);
    }
  };

  return (
    <div class="card bg-white">
      <div class="card-body">
        <h2 className="mx-5 py-3 text-lg font-semibold">Edit wallet</h2>
        <div className="container mx-auto p-4">
          <form
            onSubmit={handleSubmit}
            className=" grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-5"
          >
            <div className="mb-4">
              <label
                htmlFor="selectedCoin"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Coin List
              </label>
              <select
                id="selectedCoin"
                name="selectedCoin"
                value={formData?.coin_name}
                onChange={handleCoinChange}
                required
                disabled
                className="w-full p-2 border rounded bg-gray-100"
              >
                <option value="" disabled hidden selected>
                  Select Coin
                </option>
                {coinsData?.map((coin) => (
                  <option key={coin.id} value={coin.id}>
                    {coin?.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label
                htmlFor="coin_name"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Coin Name
              </label>
              <input
                id="coin_name"
                type="text"
                name="coin_name"
                required
                value={formData.coin_name}
                onChange={handleChange}
                placeholder="Coin Name"
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="coin_logo"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Coin Logo
              </label>
              <input
                type="file"
                name="coin_logo"
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="wallet_network"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Coin Network
              </label>
              <input
                type="text"
                name="wallet_network"
                value={formData.wallet_network}
                onChange={handleChange}
                required
                placeholder="Wallet Network"
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="wallet_address"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Wallet Address
              </label>
              <input
                type="text"
                name="wallet_address"
                required
                value={formData.wallet_address}
                onChange={handleChange}
                placeholder="Wallet address"
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="coin_symbol"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Coin Symbol
              </label>
              <input
                type="text"
                name="coin_symbol"
                required
                value={formData.coin_symbol}
                onChange={handleChange}
                placeholder="Coin Symbol"
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="wallet_qr"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Waller QR
              </label>
              <input
                type="file"
                name="documents"
                required
                onChange={handleFileChange}
                accept="image/*"
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="status"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData?.status}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-100"
              >
                <option value="" disabled hidden selected>
                  Select Status
                </option>

                <option value="active">Active</option>
                <option value="inactive">In Active</option>
              </select>
            </div>
            <div></div>
            <div className="flex justify-end items-center mt-5">
              <button
                type="submit"
                className="mb-2 bg-blue-500 hover:bg-blue-600 text-white py-2 px-10 rounded"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditWallet;
