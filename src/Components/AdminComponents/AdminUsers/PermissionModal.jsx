import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api/getApiURL";
import PermissionToggle from "./PermissionToggle";
import { useUser } from "../../../context/UserContext";

const PermissionModal = ({ isOpen, onClose, onUpdateSuccess, details }) => {
  const { setLoading: setLoader } = useUser();
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchPermissions = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/permissions`);
        setPermissions(response.data);
      } catch (error) {
        console.error("Error fetching user permissions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, [details]);

  useEffect(() => {
    setLoader(loading);
  }, [loading, setLoader]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative flex flex-col items-center max-w-lg gap-4 p-6 rounded-md shadow-md sm:py-8 sm:px-12 bg-white text-black">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-gray-900 hover:bg-gray-700 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            fill="currentColor"
            className="flex-shrink-0 w-6 h-6 mt-2"
          >
            <polygon points="427.314 107.313 404.686 84.687 256 233.373 107.314 84.687 84.686 107.313 233.373 256 84.686 404.687 107.314 427.313 256 278.627 404.686 427.313 427.314 404.687 278.627 256 427.314 107.313"></polygon>
          </svg>
        </button>

        <h2 className="text-2xl font-semibold leading-tight tracking-wide">
          Admin Permissions
        </h2>

        <div className="max-w-md mx-auto mt-2 p-6 bg-white ">
          <div className="space-y-4 overflow-y-auto">
            {permissions?.map((permission) => (
              <PermissionToggle
                key={permission.id}
                userId={details.id}
                permissionName={permission.label}
                permissionId={permission.id}
              />
            ))}
          </div>
        </div>
        <div className="mb-4"></div>
      </div>
    </div>
  );
};

export default PermissionModal;
