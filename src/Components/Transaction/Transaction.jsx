import React, { useState } from "react";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import TransactionHistory from "./TransactionHistory";
import Header from "../Header/Header";

const Transaction = () => {
  const [activeTab, setActiveTab] = useState("deposit");
  const [showHistory, setShowHistory] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);

  const handleSwitchTab = (tab) => {
    setActiveTab(tab);
  };

  const openTransactionHistory = (details) => {
    setTransactionDetails(details);
    setShowHistory(true);
  };

  const closeTransactionHistory = () => {
    setShowHistory(false);
    setTransactionDetails(null);
  };

  return (
    <div
      className="profit"
      style={{ backgroundColor: "white", height: "100vh" }}
    >
      <Header pageTitle="Transaction" />

      <div className="switch_container">
        <div className="switch_content">
          <div
            className={`switch_item ${activeTab === "deposit" ? "active" : ""}`}
            onClick={() => handleSwitchTab("deposit")}
          >
            Deposit
          </div>
          <div
            className={`switch_item ${
              activeTab === "withdraw" ? "active" : ""
            }`}
            onClick={() => handleSwitchTab("withdraw")}
          >
            Withdraw
          </div>
        </div>
      </div>

      {activeTab === "deposit" ? (
        <Deposit openTransactionHistory={openTransactionHistory} />
      ) : (
        <Withdraw openTransactionHistory={openTransactionHistory} />
      )}

      {showHistory && (
        <TransactionHistory
          details={transactionDetails}
          onClose={closeTransactionHistory}
        />
      )}
    </div>
  );
};

export default Transaction;
