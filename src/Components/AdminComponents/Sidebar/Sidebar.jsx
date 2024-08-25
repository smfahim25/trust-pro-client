import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../../context/UserContext";
import { FaSignOutAlt, FaUser, FaUsers, FaWallet } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { IoChatbox, IoSettingsSharp } from "react-icons/io5";
import { PiHandDepositFill, PiHandWithdrawFill } from "react-icons/pi";

const Sidebar = () => {
  const { adminUser, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate("/admin-login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sidebarOptions = [
    {
      to: "/cradmin",
      label: "Dashboard",
      iconPath: <MdDashboard size={20} />,
      roles: ["admin", "superadmin"],
    },
    {
      to: "/cradmin/settings",
      label: "Edit Feature",
      iconPath: <IoSettingsSharp size={20} />,
      roles: ["admin", "superadmin"],
    },
    {
      to: "/cradmin/contact",
      label: "Contact",
      iconPath: <IoChatbox size={20} />,
      roles: ["superadmin"],
    },
    {
      to: "/cradmin/wallets",
      label: "Wallets",
      iconPath: <FaWallet size={20} />,
      roles: ["superadmin"],
    },
    {
      to: "/cradmin/users",
      label: "Users",
      iconPath: <FaUsers size={20} />,
      roles: ["admin", "superadmin"],
    },
    {
      to: "/cradmin/admin-users",
      label: "Admin Users",
      iconPath: <FaUser size={20} />,
      roles: ["superadmin"],
    },
    {
      to: "/cradmin/deposits",
      label: "Deposits",
      iconPath: <PiHandDepositFill size={20} />,
      roles: ["admin", "superadmin"],
    },
    {
      to: "/cradmin/withdraws",
      label: "Withdraws",
      iconPath: <PiHandWithdrawFill size={20} />,
      roles: ["admin", "superadmin"],
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
              option.roles.includes(adminUser?.role) && (
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
