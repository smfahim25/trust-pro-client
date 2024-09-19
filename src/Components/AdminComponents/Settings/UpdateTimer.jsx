import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api/getApiURL";
import { toast } from "react-toastify";
import { useUser } from "../../../context/UserContext";

const UpdateTimer = ({
  isOpen,
  onClose,
  details,
  onUpdateSuccess,
  role,
}) => {
  const { adminUser } = useUser();
  const [formData, setFormData] = useState({
    timer: "",
    profit: "",
    mini_usdt: "",
  });

  const [responseMessage, setResponseMessage] = useState("");

  // Update formData whenever details prop changes
  useEffect(() => {
    if (details) {
      setFormData({
        timer: details.timer,
        profit: details.profit,
        mini_usdt: details.mini_usdt,
      });
    }
  }, [details]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${API_BASE_URL}/timerprofits/${details.id}`,
        formData
      );
      toast.success("User updated successfully!");
      onClose();
      onUpdateSuccess();
    } catch (error) {
      setResponseMessage("Failed to update user.");
      console.error("There was an error!", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative flex flex-col items-center max-w-lg gap-4 p-6 rounded-md shadow-md sm:py-8 sm:px-12 bg-white text-black">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-900 hover:bg-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="currentColor"
            className="flex-shrink-0 w-6 h-6"
          >
            <polygon points="427.314 107.313 404.686 84.687 256 233.373 107.314 84.687 84.686 107.313 233.373 256 84.686 404.687 107.314 427.313 256 278.627 404.686 427.313 427.314 404.687 278.627 256 427.314 107.313"></polygon>
          </svg>
        </button>

        <h2 className="text-2xl font-semibold leading-tight tracking-wide">
          Update Timer Profits
        </h2>

        <div className="max-w-md mx-auto mt-2 p-2 bg-white ">
          {/* <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2> */}
          
          <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-3 gap-4">
                <div className="mb-4 w-full">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="timer"
                  >
                    Delivery Time
                  </label>
                  <input
                    type="text"
                    id="timer"
                    name="timer"
                    value={formData.timer}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter time"
                    required
                  />
                </div>

                <div className="mb-4 w-full">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="profit"
                  >
                    Profit Level
                  </label>
                  <input
                    type="number"
                    id="profit"
                    name="profit"
                    value={formData.profit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter profit level"
                    required
                  />
                </div>

                <div className="mb-4 w-full">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="mini_usdt"
                  >
                    Minimum USDT
                  </label>
                  <input
                    type="number"
                    id="mini_usdt"
                    name="mini_usdt"
                    value={formData.mini_usdt}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Minimum USDT"
                    required
                  />
                </div>
              </div>
              <div className="mb-4 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Update
                </button>
              </div>
            </form>
        </div>

        <div className="mb-4"></div>
      </div>
    </div>
  );
};

export default UpdateTimer;
