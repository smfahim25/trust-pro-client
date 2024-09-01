import React from "react";
import { Route, Routes } from "react-router";
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

const Layout = () => {
  return (
    <div className="text-start">
      <div className="">
        <div className="flex h-[97vh]">
          <Sidebar />
          <div className="flex-1 bg-[#f8f8f8] pt-10 pl-4">
            <Routes>
              <Route path="/" element={<Trading />}></Route>
              <Route path="/users" element={<AdminUsers />}></Route>
              <Route path="/admin-users" element={<AllAdmins />}></Route>
              <Route path="/wallets" element={<Wallets />}></Route>
              <Route path="/new-wallet" element={<AddNewWallet />}></Route>
              <Route path="/edit-wallet" element={<EditWallet />}></Route>
              <Route path="/deposits" element={<Deposits />}></Route>
              <Route path="/withdraws" element={<Withdraws />}></Route>
              <Route path="/trading" element={<Trading />}></Route>
              <Route path="/settings" element={<Settings />}></Route>
              <Route path="/contact" element={<Contact />}></Route>
              <Route path="/live-support" element={<SupportInbox />}></Route>
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
