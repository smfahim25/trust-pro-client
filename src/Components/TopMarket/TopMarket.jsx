import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../api/getApiURL";
import numberFormat from "../utils/numberFormat";
import { Link } from "react-router-dom";
import Chart from "../Chart/chart";
import { useUser } from "../../context/UserContext";

// Import dynamic images
const forexImages = require.context(
  "../../Assets/images/coins",
  false,
  /\.(png|jpe?g|svg)$/
);

// Helper function to get image paths
const getImagePath = (symbol) => {
  try {
    return forexImages(`./${symbol.toLowerCase()}-logo.png`);
  } catch (error) {
    console.error("Image not found:", symbol);
    return "/assets/images/default-forex-logo.png"; // Default image if not found
  }
};

// TopMarket Component
const TopMarket = () => {
  const [forexMarkets, setForexMarkets] = useState([]);
  const [wallet, setWallet] = useState(null);
  const { setLoading } = useUser();

  useEffect(() => {
    // Fetch Forex market data
    setLoading(true);
    const fetchForexMarkets = async () => {
      const response = await fetch(`${API_BASE_URL}/market/forex`);
      const data = await response.json();
      if (data) {
        setForexMarkets(data);
        setLoading(false);
      }
    };

    // Fetch Wallet data (simulating WordPress get_posts)
    const fetchWallet = async () => {
      const walletData = {
        id: 1,
        coin_symbol: "ETH",
        status: "active",
      };
      setWallet(walletData);
    };

    fetchForexMarkets();
    fetchWallet();
  }, [setLoading]);

  return (
    <div className="market_pro_list">
      {forexMarkets.map((fx, index) => {
        const meta = fx.response[0].meta;
        const symbol = meta.symbol.replace("=X", "");
        const imagePath = getImagePath(symbol);
        const marketPrice = meta.regularMarketPrice;
        const previousClose = meta.previousClose;
        const priceChange = marketPrice - previousClose;
        const one = meta.regularMarketDayHigh;
        const four = meta.regularMarketDayLow;
        const seven = meta.regularMarketPrice;

        return (
          <Link
            key={index}
            className="pro_item"
            to={`/business?coin=${symbol}&type=forex`}
          >
            <div className="pro_base">
              <img
                src={imagePath}
                className="pro_base_icon"
                alt={`${symbol} Logo`}
              />
              <div>
                <div className="pro_title ff_NunitoBold fc-353F52">
                  {symbol.replace(meta.currency, ` / ${meta.currency}`)}
                </div>
                <div className="pro_subtitle fc-5F6775">
                  {wallet ? `${wallet.coin_symbol} Wallet` : ""}
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
                  <Chart one={one} seven={seven} four={four} />
                </div>
              </div>
            </div>
            <div className="pro_detail">
              <div className="pro_price fs-15 fc-353F52">US$ {marketPrice}</div>
              <div className="pro_change">
                <span
                  className="change_value fc-8CC351 m-r-10"
                  style={{
                    color:
                      priceChange < 0
                        ? "rgb(207, 32, 47)"
                        : "rgb(19, 178, 111)",
                  }}
                >
                  {numberFormat(priceChange, 5)}
                </span>
                <span className="period">24 Hrs</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default TopMarket;
