import React, { useEffect, useState } from "react";
import imgNoData from "../../Assets/images/img_nodata.png";
import iconMenuArrow from "../../Assets/images/icon_menu_arrow.svg";
import iconClose from "../../Assets/images/icon_close.svg";
import Header from "../Header/Header";
import { useUser } from "../../context/UserContext";
import API_BASE_URL from "../../api/getApiURL";

const parseDuration = (duration) => {
  const durationMap = {
    S: 1000, // seconds
    H: 60 * 60 * 1000, // hours
    D: 24 * 60 * 60 * 1000, // days
    W: 7 * 24 * 60 * 60 * 1000, // weeks
    M: 30 * 24 * 60 * 60 * 1000, // months (approx)
    Y: 365 * 24 * 60 * 60 * 1000, // years (approx)
  };

  // Extract the number and the unit from the duration string
  const match = duration.match(/^(\d+)([SHDWMY])$/);
  if (match) {
    const [, number, unit] = match;
    return parseInt(number, 10) * (durationMap[unit] || 0);
  }

  // Default to 0 if the duration format is not recognized
  return 0;
};

const Countdown = ({
  createdTime,
  duration,
  setStatus,
  id,
  setRunningOrders,
  runningOrders,
}) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const deliveryTime = parseDuration(duration);
    const createdAt = new Date(createdTime);

    const updateTimer = () => {
      const endTime = new Date(createdAt.getTime() + deliveryTime);
      const now = new Date();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft("00:00:00");
        setStatus("finished");
        const filteredItems = runningOrders.filter((item) => item.id !== id);
        setRunningOrders(filteredItems);
        return;
      }

      const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(
        2,
        "0"
      );
      const minutes = String(
        Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      ).padStart(2, "0");
      const seconds = String(Math.floor((diff % (1000 * 60)) / 1000)).padStart(
        2,
        "0"
      );
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const months = Math.floor(days / 30);
      const years = Math.floor(days / 365);

      let timeString = "";

      if (years > 0) {
        const remainingMonths = Math.floor((days % 365) / 30);
        timeString = `${years}y ${remainingMonths}mo ${hours}h ${minutes}m ${seconds}s`;
      } else if (months > 0) {
        const remainingDays = days % 30;
        timeString = `${months}mo ${remainingDays}d ${hours}h ${minutes}m ${seconds}s`;
      } else if (days > 0) {
        timeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      } else if (hours > 0) {
        timeString = `${hours}h ${minutes}m ${seconds}s`;
      } else if (minutes > 0) {
        timeString = `${hours}h ${minutes}m ${seconds}s`;
      } else {
        timeString = `${hours}h ${minutes}m ${seconds}s`;
      }

      setTimeLeft(timeString);
    };

    // Initial call to set the countdown immediately
    updateTimer();

    // Set interval to update countdown every second
    const timerInterval = setInterval(updateTimer, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timerInterval);
  }, [createdTime, duration, setStatus, id, runningOrders, setRunningOrders]);

  return <div>{timeLeft}</div>;
};

const ProfitStatistics = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [runningOrders, setRunningOrders] = useState([]);
  const [status, setStatus] = useState("running");
  const { setLoading, user } = useUser();

  const switchTab = (tab) => {
    setActiveTab(tab);
    if (tab === "finished") {
      setStatus("finished");
    } else {
      setStatus("running");
    }
  };

  const openPopup = (order) => {
    setSelectedOrder(order);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const getFormattedDeliveryTime = (createdAt) => {
    const date = new Date(createdAt);

    // Convert date to local time string
    const localDateTime = date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    return localDateTime.replace(",", "");
  };

  useEffect(() => {
    setLoading(true);
    if (user?.id) {
      async function fetchMarketData() {
        try {
          const response = await fetch(
            `${API_BASE_URL}/tradeorder/user/${user?.id}?status=${status}`
          );
          const data = await response.json();
          if (response.status !== 404) {
            if (status === "finished") {
              setOrders(data);
            } else {
              setRunningOrders(data);
            }
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching market data:", error);
          setLoading(false);
        }
      }
      fetchMarketData();
    }
  }, [setLoading, user, status]);

  const extractUnit = (deliveryTime) => {
    const match = deliveryTime.match(/[SHDWMY]/);
    return match ? match[0] : null;
  };

  const calculateDeliveryPrice = (
    isProfit,
    orderPosition,
    deliveryTime,
    purchasePrice
  ) => {
    const unit = extractUnit(deliveryTime);
    let deliveryPrice = parseFloat(purchasePrice);

    if (isProfit) {
      if (orderPosition === "buy") {
        if (deliveryPrice > 50) {
          if (unit === "S") {
            deliveryPrice += 90;
          } else if (unit === "H") {
            deliveryPrice += 350;
          } else if (unit === "D") {
            deliveryPrice += 550;
          } else if (unit === "W") {
            deliveryPrice += 850;
          } else if (unit === "M") {
            deliveryPrice += 1850;
          } else if (unit === "Y") {
            deliveryPrice += 5850;
          }
        } else {
          if (unit === "S") {
            deliveryPrice += 2;
          } else if (unit === "H") {
            deliveryPrice += 5;
          } else if (unit === "D") {
            deliveryPrice += 8;
          } else if (unit === "W") {
            deliveryPrice += 12;
          } else if (unit === "M") {
            deliveryPrice += 20;
          } else if (unit === "Y") {
            deliveryPrice += 25;
          }
        }
      } else {
        if (deliveryPrice > 50) {
          if (unit === "S") {
            deliveryPrice -= 30;
          } else if (unit === "H") {
            deliveryPrice -= 150;
          } else if (unit === "D") {
            deliveryPrice -= 350;
          } else if (unit === "W") {
            deliveryPrice -= 550;
          } else if (unit === "M") {
            deliveryPrice -= 850;
          } else if (unit === "Y") {
            deliveryPrice -= 5850;
          }
        } else {
          deliveryPrice -= 0.05;
        }
      }
    } else {
      if (deliveryPrice > 50) {
        if (unit === "S") {
          deliveryPrice -= 30;
        } else if (unit === "H") {
          deliveryPrice -= 150;
        } else if (unit === "D") {
          deliveryPrice -= 350;
        } else if (unit === "W") {
          deliveryPrice -= 550;
        } else if (unit === "M") {
          deliveryPrice -= 850;
        } else if (unit === "Y") {
          deliveryPrice -= 5850;
        }
      } else {
        deliveryPrice -= 0.05;
      }
    }

    return deliveryPrice;
  };
  return (
    <div
      className="profit"
      style={{ backgroundColor: "white", height: "100vh" }}
    >
      <Header pageTitle="Profit Statistics" />

      <div className="switch_container">
        <div className="switch_content">
          <div
            className={`switch_item ${activeTab === "active" ? "active" : ""}`}
            onClick={() => switchTab("active")}
          >
            Active Order
          </div>
          <div
            className={`switch_item ${
              activeTab === "finished" ? "active" : ""
            }`}
            onClick={() => switchTab("finished")}
          >
            Finished Order
          </div>
        </div>
      </div>

      <div id="profit-active_order">
        <div className="main_container">
          <div className="main_content">
            <div>
              {activeTab === "active" ? (
                runningOrders?.length === 0 ? (
                  <div
                    className="no_data_content ff_NunitoSemiBold"
                    style={{ minHeight: "calc(-260px + 100vh)" }}
                  >
                    <img
                      src={imgNoData}
                      alt="No Data"
                      className="img_no_data"
                    />
                    <div>No Data</div>
                  </div>
                ) : (
                  <div className="profit-history">
                    {runningOrders?.map((order) => {
                      return (
                        <div className="profit-content" key={order.id}>
                          <div className="profit-details">
                            <div className="profit-coin-details flex">
                              {order?.order_type === "metal" ||
                              order?.order_type === "forex" ? (
                                <img
                                  className="coin-symbol"
                                  src={`./assets/images/coins/${order?.trade_coin_id?.toLowerCase()}-logo.png`}
                                  alt={order.coin_name}
                                />
                              ) : (
                                <img
                                  className="coin-symbol"
                                  src={`./assets/images/coins/${order?.trade_coin_symbol?.toLowerCase()}-logo.png`}
                                  alt={order.coin_name}
                                />
                              )}
                              <span className="coin-name ff_NunitoSemiBold">
                                {order?.trade_coin_symbol}/{order?.coin_symbol}
                              </span>
                              <span className="profit-date ff_NunitoRegular">
                                {getFormattedDeliveryTime(order.created_at)}
                              </span>
                            </div>
                            <div className="profit-details-amount">
                              <div className="flex gap-5">
                                <span className="text-[15px]">Running</span>
                                <span className="text-[15px]">
                                  <Countdown
                                    createdTime={getFormattedDeliveryTime(
                                      order.created_at
                                    )}
                                    duration={order.delivery_time}
                                    setStatus={setStatus}
                                    setRunningOrders={setRunningOrders}
                                    id={order?.id}
                                    runningOrders={runningOrders}
                                  />
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : orders?.length === 0 ? (
                <div
                  className="no_data_content ff_NunitoSemiBold"
                  style={{ minHeight: "calc(-260px + 100vh)" }}
                >
                  <img src={imgNoData} alt="No Data" className="img_no_data" />
                  <div>No Data</div>
                </div>
              ) : (
                <div className="profit-history">
                  {orders?.map((order) => {
                    return (
                      <div
                        className="profit-content profit-content-pop"
                        key={order.id}
                        onClick={() => openPopup(order)}
                      >
                        <div className="profit-details">
                          <div className="profit-coin-details">
                            {order?.order_type === "metal" ||
                            order?.order_type === "forex" ? (
                              <img
                                className="coin-symbol"
                                src={`./assets/images/coins/${order?.trade_coin_id?.toLowerCase()}-logo.png`}
                                alt={order.coin_name}
                              />
                            ) : (
                              <img
                                className="coin-symbol"
                                src={`./assets/images/coins/${order?.trade_coin_symbol?.toLowerCase()}-logo.png`}
                                alt={order.coin_name}
                              />
                            )}
                            <span className="coin-name ff_NunitoSemiBold">
                              {order?.trade_coin_symbol}/{order?.coin_symbol}
                            </span>
                            <span className="profit-date ff_NunitoRegular">
                              {getFormattedDeliveryTime(order?.created_at)}
                            </span>
                          </div>
                          <div className="profit-details-amount">
                            <span className="profit-text">
                              {order?.is_profit ? "Profit" : "Loss"}
                            </span>
                            <span
                              className="profit-amount"
                              style={{
                                color: order?.is_profit ? "green" : "red",
                              }}
                            >
                              US$ {order?.profit_amount}
                            </span>
                          </div>
                        </div>
                        <div className="profit-icon">
                          <img src={iconMenuArrow} alt="Details" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPopup && selectedOrder && (
        <div className="popup_container">
          <div className="ssb-overlay" style={{ zIndex: 2016 }}></div>
          <div
            className="ssb-popup ssb-popup--round ssb-popup--bottom"
            style={{ width: "100%", height: "100%", zIndex: 2017 }}
          >
            <div id="profit-history" className="profit-history-wrapper">
              <div className="history">
                <div className="title fs-18 fc-353F52">
                  <span>History</span>
                  <img
                    src={iconClose}
                    alt="Close"
                    className="icon_close"
                    onClick={closePopup}
                  />
                </div>
                <div className="history_info">
                  <div className="history-coin-details">
                    <img
                      src={`/assets/images/coins/${selectedOrder?.trade_coin_symbol?.toLowerCase()}-logo.png`}
                      alt={selectedOrder.coin_name}
                      className="coin_logo"
                      id="coin_logo"
                    />
                    <span className="ff_NunitoSemiBold" id="trade_symbol">
                      {selectedOrder?.trade_coin_symbol}/
                      {selectedOrder?.coin_symbol}
                    </span>
                    <span className="ff_NunitoRegular" id="trade_entry">
                      {getFormattedDeliveryTime(selectedOrder.created_at)}
                    </span>
                  </div>
                  <div className="history-content">
                    <div className="history-label">Purchase Amount</div>
                    <div className="history-value" id="amount">
                      {selectedOrder.amount}
                    </div>
                  </div>
                  <div className="history-content">
                    <div className="history-label">Direction</div>
                    <div className="history-value" id="direction">
                      {selectedOrder.order_position}
                    </div>
                  </div>
                  <div className="history-content">
                    <div className="history-label">Purchase price</div>
                    <div className="history-value" id="purchase_price">
                      {selectedOrder.purchase_price}
                    </div>
                  </div>
                  <div className="history-content">
                    <div className="history-label">Contract</div>
                    <div className="history-value" id="contract">
                      {selectedOrder.delivery_time}
                    </div>
                  </div>
                  <div
                    className={`history-content p-2 rounded-md ${
                      selectedOrder.is_profit ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    <div className="history-label" id="profit_status">
                      {selectedOrder.is_profit ? "Profit" : "Loss"}
                    </div>
                    <div className="history-value" id="profit_amount">
                      {selectedOrder.profit_amount}
                    </div>
                  </div>
                  <div className="history-content">
                    <div className="history-label">Delivery Price</div>
                    <div className="history-value" id="delivery_price">
                      {calculateDeliveryPrice(
                        selectedOrder?.is_profit,
                        selectedOrder.order_position,
                        selectedOrder.delivery_time,
                        selectedOrder.purchase_price
                      )}
                    </div>
                  </div>
                  <div className="history-content">
                    <div className="history-label">Delivery time</div>
                    <div className="history-value" id="delivery_time">
                      {getFormattedDeliveryTime(selectedOrder.created_at)}
                    </div>
                  </div>
                  <div className="history-content">
                    <div className="history-label">Status</div>
                    <div className="history-value" id="status">
                      Finished
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const getMetalCoinSymbol = (coinId) => {
  // Replace with actual function to get metal coin symbol
  return coinId; // Placeholder
};

export default ProfitStatistics;
