import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../../api/getApiURL";
import axios from "axios";
import { toast } from "react-toastify";
import { IoCloseCircleSharp } from "react-icons/io5";

const DepositModal = ({ isOpen, onClose, details, onUpdateSuccess, title }) => {
  const [amount, setAmount] = useState(details?.amount || "");
  const [status, setStatus] = useState(details?.status || "");
  const [transHash, setTransHash] = useState(details?.trans_hash || "");

  useEffect(() => {
    // When details change, update the state
    setAmount(details?.amount || "");
    setStatus(details?.status || "");
    setTransHash(details?.trans_hash || "");
  }, [details]);

  const handleChange = (e) => {
    if (e.target.name === "amount") {
      setAmount(e.target.value);
    } else if (e.target.name === "status") {
      setStatus(e.target.value);
    } else if (e.target.name === "transHash") {
      setTransHash(e.target.value);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedData = {
      amount,
      status,
      trans_hash: transHash,
    };

    const updatedDeposit = {
      amount,
      status,
    };

    console.log(updatedData);
    if (title === "Deposit") {
      try {
        const response = await axios.put(
          `${API_BASE_URL}/deposits/${details.id}`,
          updatedDeposit
        );
        toast.success("Deposit updated successfully");
        console.log("Data successfully submitted:", response);
        onClose();
        onUpdateSuccess();
      } catch (error) {
        console.error("Error submitting data:", error);
        toast.error("Failed to update deposit.");
      }
    } else {
      try {
        const response = await axios.put(
          `${API_BASE_URL}/withdraws/${details.id}`,
          updatedData
        );
        toast.success("Withdraw updated successfully");
        console.log("Data successfully submitted:", response);
        onClose();
        onUpdateSuccess();
      } catch (error) {
        console.error("Error submitting data:", error);
        toast.error("Failed to update Withdraw.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative flex flex-col max-w-lg gap-4 p-6 rounded-md shadow-md sm:py-8 sm:px-12 bg-white text-black">
        <button
          onClick={onClose}
          className="absolute top-2 right-2"
          style={{
            padding: "0",
            color: "black",
            backgroundColor: "transparent",
          }}
        >
          <IoCloseCircleSharp size={40} />
        </button>

        <h2 className="text-2xl font-semibold leading-tight tracking-wide text-center">
          Update {title}
        </h2>
        {title === "Withdraw" && (
          <div>
            <h2 className="text-left">
              Wallet:{" "}
              <span className="font-bold text-md">{details?.wallet_to}</span>
            </h2>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="amount"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              {title} Amount
            </label>
            <input
              id="amount"
              type="text"
              name="amount"
              value={amount}
              onChange={handleChange}
              placeholder="amount"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label
              htmlFor="status"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={status}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="" disabled hidden>
                Select Status
              </option>
              <option value="approved">Approve</option>
              <option value="pending">Pending</option>
              <option value="rejected">Reject</option>
            </select>
          </div>

          {title === "Withdraw" && (
            <div>
              <label
                htmlFor="transHash"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Transaction Hash
              </label>
              <input
                id="transHash"
                type="text"
                name="transHash"
                value={transHash}
                onChange={handleChange}
                placeholder="Transaction Hash"
                className="w-full p-2 border rounded"
              />
            </div>
          )}
        </div>
        <div className="mb-4"></div>

        <button
          onClick={handleUpdate}
          className="absolute bottom-2 right-2 bg-lime-500 hover:bg-lime-500 "
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default DepositModal;
