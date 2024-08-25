import React, { useState, useEffect } from "react";
import Chart from "../Chart/chart";
import { Link } from "react-router-dom";
import API_BASE_URL from "../../api/getApiURL";
import getMetalCoinName from "../utils/getMetalCoinName";
import numberFormat from "../utils/numberFormat";
import { useUser } from "../../context/UserContext";

const MetalMarket = () => {
  const [marketData, setMarketData] = useState([]);
  const { setLoading } = useUser();
  useEffect(() => {
    setLoading(true);
    async function fetchMarketData() {
      try {
        const response = await fetch(`${API_BASE_URL}/market/metal`);
        const data = await response.json();
        setMarketData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching market data:", error);
        setLoading(false);
      }
    }

    fetchMarketData();
  }, [setLoading]);

  const activeWallet = {
    id: 1,
    coin_symbol: "ETH",
    coin_name: "Etherum",
    balance: 0.05,
    usd_balance: 1467.5, // This can be calculated based on the current price of the coin
    coin_logo: {
      url: "/assets/images/btc_logo.png",
      alt: "Bitcoin Logo",
    },
    status: "active", // Wallet status
    last_transaction_date: "2024-07-15", // Last transaction date
    transactions: [
      {
        id: 101,
        date: "2024-07-10",
        type: "Deposit",
        amount: 0.01,
        usd_value: 294.5,
      },
      {
        id: 102,
        date: "2024-07-08",
        type: "Withdrawal",
        amount: 0.005,
        usd_value: 147.25,
      },
    ],
  };

  return (
    <>
      <div className="market_pro_list">
        {marketData.map((coin) => (
          <Link
            key={coin.symbol}
            className="pro_item"
            to={`/business?coin=${coin?.symbol
              .split("=")[0]
              .trim()}&type=metal`}
          >
            <div className="pro_base">
              <img
                src={`/assets/images/coins/${coin?.symbol
                  .split("=")[0]
                  .trim()
                  .toLowerCase()}-logo.png`}
                className="pro_base_icon"
                alt={`${coin.symbol} Logo`}
              />
              <div>
                <div className="pro_title ff_NunitoBold fc-353F52">
                  {getMetalCoinName(coin?.symbol.split("=")[0].trim())}
                </div>
                <div className="pro_subtitle fc-5F6775">
                  {activeWallet ? activeWallet.coin_symbol : ""} Wallet
                </div>
              </div>
            </div>
            <div className="pro_line">
              <div
                className="lineBoard"
                style={{
                  userSelect: "none",
                  WebkitTapHighlightColor: "rgba(0, 0, 0, 0)",
                  position: "relative",
                }}
              >
                <div className="chart-wrapper">
                  <Chart one={1.3} seven={1.4} four={1.5} />
                </div>
              </div>
            </div>
            <div className="pro_detail">
              <div className="pro_price fs-15 fc-353F52">
                {/* US$ {numberFormat(coin?.regularMarketPrice)} */}
                US$ {numberFormat(coin?.response[0].meta.regularMarketPrice, 3)}
              </div>
              <div className="pro_change">
                <span
                  className="change_value fc-8CC351 m-r-10"
                  style={{
                    color:
                      coin?.response[0].meta.regularMarketPrice -
                        coin?.response[0].meta.previousClose <
                      0
                        ? "rgb(207, 32, 47)"
                        : "rgb(19, 178, 111)",
                  }}
                >
                  {numberFormat(
                    coin?.response[0].meta.regularMarketPrice -
                      coin?.response[0].meta.previousClose,
                    5
                  )}
                </span>
                <span className="period">24 Hrs</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default MetalMarket;
