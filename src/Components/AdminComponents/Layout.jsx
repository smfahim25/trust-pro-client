import React from "react";
import { Route, Routes, Navigate } from "react-router";
import Sidebar from "./Sidebar/Sidebar";
import AdminUsers from "./AdminUsers/AdminUsers";
import Wallets from "./Wallets/Wallets";
import Deposits from "./Deposits/Deposits";
import Withdraws from "./Withdraws/Withdraws";
import Trading from "./Trading/Trading";
import AddNewWallet from "./Wallets/AddNewWallet";
import EditWallet from "./Wallets/EditWallet";
import Settings from "./Settings/Settings";
import AllAdmins from "./AllAdmins/AllAdmins";
import Contact from "./Contact/Contact";
import SupportInbox from "./SupportInbox/SupportInbox";
import { useUser } from "../../context/UserContext";

const Layout = () => {
  const { adminUser } = useUser();

  const hasPermission = (permission) => {
    if (adminUser?.role === "superadmin") {
      return true;
    }
    return (
      adminUser?.role === "admin" &&
      adminUser?.permissions?.includes(permission)
    );
  };

  return (
    <div className="text-start">
      <div className="">
        <div className="flex h-[97vh]">
          <Sidebar />
          <div className="flex-1 bg-[#f8f8f8] pt-10 pl-4">
            <Routes>
              {/* Public or default route */}
              <Route path="/" element={<Trading />} />

              {/* Conditionally render routes based on permissions for 'admin' users */}
              {hasPermission("Users") && (
                <Route path="/users" element={<AdminUsers />} />
              )}
              {hasPermission("Admin Users") && (
                <Route path="/admin-users" element={<AllAdmins />} />
              )}
              {hasPermission("Wallets") && (
                <Route path="/wallets" element={<Wallets />} />
              )}
              {hasPermission("Wallets") && (
                <Route path="/new-wallet" element={<AddNewWallet />} />
              )}
              {hasPermission("Wallets") && (
                <Route path="/edit-wallet" element={<EditWallet />} />
              )}
              {hasPermission("Deposits") && (
                <Route path="/deposits" element={<Deposits />} />
              )}
              {hasPermission("Withdraws") && (
                <Route path="/withdraws" element={<Withdraws />} />
              )}
              {hasPermission("Dashboard") && (
                <Route path="/trading" element={<Trading />} />
              )}
              {hasPermission("Edit Feature") && (
                <Route path="/settings" element={<Settings />} />
              )}
              {hasPermission("Contact") && (
                <Route path="/contact" element={<Contact />} />
              )}
              {hasPermission("Inbox") && (
                <Route path="/live-support" element={<SupportInbox />} />
              )}

              {/* If the user navigates to an unknown route, redirect to default route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
