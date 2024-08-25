import React, { useState, useEffect } from "react";
import Chart from "../Chart/chart";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
// import imgPath from '../../Assets/images/coins';

function CryptoMarket() {
  const [marketData, setMarketData] = useState([]);
  const { setLoading } = useUser();
  const cryptoURL =
    "https://api.coinlore.net/api/ticker/?id=90,2679,2,257,80,1,89,2713,2321,58,48543,118,2710,54683,44883,33422,2751,45219,48563,47305,111341,33718,48569,121619,32607,93845,135601,46183,121593,2741,46018,12377,42441,33830,70497,121613,46561,36447,33644,32360,33536,34406,46981";
  // const cryptoURL = "https://api.coinlore.net/api/tickers/";
  //   const [activeWallet, setActiveWallet] = useState(null);
  useEffect(() => {
    setLoading(true);
    async function fetchMarketData() {
      try {
        const response = await fetch(cryptoURL);
        const data = await response.json();
        setMarketData(data);
        // setMarketData(data.data); // for all coin
        setLoading(false);
      } catch (error) {
        console.error("Error fetching market data:", error);
        setLoading(false);
      }
    }

    fetchMarketData();
  }, [setLoading]);

  return (
    <>
      <div className="market_pro_list">
        {marketData.map((coin) => (
          <Link
            key={coin.id}
            className="pro_item"
            to={`/business?coin=${coin.id}&type=crypto`}
          >
            <div className="pro_base">
              <img
                src={`/assets/images/coins/${coin.symbol.toLowerCase()}-logo.png`}
                className="pro_base_icon"
                alt={`${coin.symbol} Logo`}
              />
              <div>
                <div className="pro_title ff_NunitoBold fc-353F52">
                  {coin.symbol} Coin
                </div>
                <div className="pro_subtitle fc-5F6775">
                  {coin.symbol} Wallet
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
                  <Chart
                    one={coin?.percent_change_1h}
                    seven={coin?.percent_change_7d}
                    four={coin?.percent_change_24h}
                  />
                </div>
              </div>
            </div>
            <div className="pro_detail">
              <div className="pro_price fs-15 fc-353F52">
                US$ {parseFloat(coin.price_usd).toFixed(3)}
              </div>
              <div className="pro_change">
                <span
                  className="change_value fc-8CC351 m-r-10"
                  style={{
                    color:
                      coin.percent_change_24h < 0
                        ? "rgb(207, 32, 47)"
                        : "rgb(19, 178, 111)",
                  }}
                >
                  {coin.percent_change_24h}%{" "}
                </span>
                <span className="period">24 Hrs</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default CryptoMarket;
