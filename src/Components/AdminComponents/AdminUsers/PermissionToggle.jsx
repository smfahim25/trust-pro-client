import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api/getApiURL";

const PermissionToggle = ({ userId, permissionId, permissionName }) => {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const fetchPermissionStatus = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/permissions/user/${userId}`
        );
        const userPermissions = response.data.permissions;
        console.log("User permissions: ", userPermissions);

        // Check if the user has this specific permission
        const permissionExists = userPermissions.some(
          (permission) => permission.permissionId === permissionId
        );
        setHasPermission(permissionExists);
      } catch (error) {
        console.error("Error fetching permissions:", error);
      }
    };

    fetchPermissionStatus();
  }, [userId, permissionId]);

  // Function to handle toggling the permission
  const handleToggle = async () => {
    try {
      await axios.post(`${API_BASE_URL}/permissions/toggle`, {
        userId,
        permissionId,
      });
      setHasPermission(!hasPermission);
    } catch (error) {
      console.error("Error toggling permission:", error);
    }
  };

  return (
    <div className="flex justify-between gap-10 min-w-[400px] items-center space-x-2">
      <label className="text-gray-70 text-lg">{permissionName}</label>
      <button
        onClick={handleToggle}
        className={`transition duration-300 ease-in-out ${
          hasPermission ? "bg-green-500" : "bg-red-500"
        } w-14 h-8 rounded-full relative`}
      >
        <span
          className={`w-6 h-6 bg-white absolute top-1 transition duration-300 ease-in-out ${
            hasPermission ? "left-7" : "left-1"
          } rounded-full`}
        />
      </button>
    </div>
  );
};

export default PermissionToggle;
