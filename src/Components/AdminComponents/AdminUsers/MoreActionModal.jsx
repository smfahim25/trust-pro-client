import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api/getApiURL";
import { toast } from "react-toastify";
import { useUser } from "../../../context/UserContext";

const MoreActionModal = ({
  isOpen,
  onClose,
  details,
  onUpdateSuccess,
  role,
}) => {
  const { adminUser } = useUser();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    role: "user",
    status: "",
    note: "",
    employee: "",
    trade_limit: "",
  });

  const [responseMessage, setResponseMessage] = useState("");

  // Update formData whenever details prop changes
  useEffect(() => {
    if (details) {
      setFormData({
        name: details.name,
        email: details.email,
        mobile: details.mobile,
        status: details.status,
        password: "",
        role: details.role || "user",
        note: details.note || "",
        employee: details.employee || "",
        trade_limit: details.trade_limit,
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
        `${API_BASE_URL}/users/${details.id}`,
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
          Update User
        </h2>

        <div className="max-w-md mx-auto mt-2 p-2 bg-white ">
          {/* <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2> */}
          <form onSubmit={handleSubmit}>
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 ">
                <div className="mb-4">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="name"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter name"
                    required
                  />
                </div>
                {role === "superadmin" && (
                  <>
                    <div className="mb-4">
                      <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="email"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="mobile"
                      >
                        Mobile
                      </label>
                      <input
                        type="text"
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your mobile number"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="password"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter new password"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="role"
                      >
                        Role
                      </label>
                      <select
                        id="role"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Superadmin</option>
                      </select>
                    </div>
                  </>
                )}

                {adminUser.role === "superadmin" && (
                  <div className="mb-4">
                    <label
                      className="block text-gray-700 font-bold mb-2"
                      htmlFor="status"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="inactive">InActive</option>
                    </select>
                  </div>
                )}
                <div className="mb-4">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="note"
                  >
                    Note
                  </label>
                  <input
                    type="text"
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="write note for this user"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="employee"
                  >
                    Employee
                  </label>
                  <input
                    type="text"
                    id="employee"
                    name="employee"
                    value={formData.employee}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="assign employee"
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 font-bold mb-2"
                    htmlFor="trade_limit"
                  >
                    Trade limit
                  </label>
                  <input
                    type="text"
                    id="trade_limit"
                    name="trade_limit"
                    value={formData.trade_limit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Trade Limit"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Update
              </button>
            </div>

            {responseMessage && (
              <p className="mt-4 text-center text-green-500">
                {responseMessage}
              </p>
            )}
          </form>
        </div>

        <div className="mb-4"></div>
      </div>
    </div>
  );
};

export default MoreActionModal;
