import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { FaSignOutAlt, FaUser, FaUsers, FaWallet } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { IoChatbox, IoSettingsSharp } from "react-icons/io5";
import { PiHandDepositFill, PiHandWithdrawFill } from "react-icons/pi";
import { useSocketContext } from "../../../context/SocketContext";
import axios from "axios";
import { API_BASE_URL } from "../../../api/getApiURL";

const Sidebar = () => {
  const { adminUser, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadConv, setUnreadConv] = useState(0); // Initialize as 0
  const { socket } = useSocketContext();

  // Fetch unread conversations count from API
  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/conversation/`);
      setUnreadConv(response.data.unreadConversationsCount);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  useEffect(() => {
    fetchConversations();
    const handleNewMessage = (newMessage) => {
      setUnreadConv(newMessage?.unreadConversationsCount || 0); // Update unread count
      console.log("New conversation received: ", newMessage);
    };

    socket?.on("getUnreadMessage", handleNewMessage);

    return () => socket?.off("getUnreadMessage", handleNewMessage);
  }, [socket]);

  // Sign out handler
  const handleSignOut = () => {
    logout();
    navigate("/admin-login");
  };

  // Toggle sidebar (mobile)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to check if the admin has a specific permission, but only for 'admin' users
  const hasPermission = (permission) => {
    if (adminUser?.role === "superadmin") {
      return true; // Superadmin has access to all options
    }
    return (
      adminUser?.role === "admin" &&
      adminUser?.permissions?.includes(permission)
    );
  };

  const sidebarOptions = [
    {
      to: "/cradmin",
      label: "Dashboard",
      iconPath: <MdDashboard size={20} />,
      permission: "Dashboard", // Permission required
    },
    {
      to: "/cradmin/settings",
      label: "Edit Feature",
      iconPath: <IoSettingsSharp size={20} />,
      permission: "Edit Feature", // Permission required
    },
    {
      to: "/cradmin/contact",
      label: "Contact",
      iconPath: <IoChatbox size={20} />,
      permission: "Contact", // Permission required
    },
    {
      to: "/cradmin/live-support",
      label: "Inbox",
      iconPath: <IoChatbox size={20} />,
      permission: "Inbox", // Permission required
    },
    {
      to: "/cradmin/wallets",
      label: "Wallets",
      iconPath: <FaWallet size={20} />,
      permission: "Wallets", // Permission required
    },
    {
      to: "/cradmin/users",
      label: "Users",
      iconPath: <FaUsers size={20} />,
      permission: "Users", // Permission required
    },
    {
      to: "/cradmin/admin-users",
      label: "Admin Users",
      iconPath: <FaUser size={20} />,
      permission: "Admin Users", // Permission required
    },
    {
      to: "/cradmin/deposits",
      label: "Deposits",
      iconPath: <PiHandDepositFill size={20} />,
      permission: "Deposits", // Permission required
    },
    {
      to: "/cradmin/withdraws",
      label: "Withdraws",
      iconPath: <PiHandWithdrawFill size={20} />,
      permission: "Withdraws", // Permission required
    },
  ];

  return (
    <div className="relative">
      {/* Hamburger Icon for Mobile */}
      <button
        className="md:hidden p-2 bg-white hover:bg-white text-gray-900 focus:outline-none"
        onClick={toggleSidebar}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Sidebar Menu */}
      <nav
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } md:block bg-white shadow-lg h-full p-6`}
      >
        <div className="flex items-center space-x-4 mb-5">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3607/3607444.png"
            alt=""
            className="w-6 h-6 rounded-full bg-gray-500"
          />
          <div>
            <h2 className="text-lg font-semibold">{adminUser?.name}</h2>
            <span className="flex items-center space-x-1">
              <span className="text-xs hover:underline text-gray-400">
                {adminUser?.email}
              </span>
            </span>
          </div>
        </div>
        <hr />
        <ul className="space-y-6 mt-5">
          {sidebarOptions.map(
            (option) =>
              hasPermission(option.permission) && (
                <li
                  key={option.to}
                  className={`flex items-center space-x-4 ${
                    location.pathname === option.to
                      ? "text-blue-500"
                      : "text-gray-900"
                  }`}
                >
                  <Link
                    to={option.to}
                    className="flex items-center space-x-4"
                    onClick={() => {
                      if (isSidebarOpen) {
                        setIsSidebarOpen(false);
                      }
                    }}
                  >
                    {option.iconPath}
                    <span className="text-[16px]">{option.label}</span>
                    {unreadConv > 0 && option.label === "Inbox" && (
                      <span className="inline-flex items-center justify-center w-4 h-4 ms-2 text-xs font-semibold text-blue-800 bg-blue-200 rounded-full">
                        {unreadConv}
                      </span>
                    )}
                  </Link>
                </li>
              )
          )}
          <li>
            <button
              className="flex items-center text-gray-900 bg-white p-0 space-x-4 hover:bg-white"
              onClick={handleSignOut}
            >
              <FaSignOutAlt size={20} />
              <span>Sign Out</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
