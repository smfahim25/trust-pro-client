import React, { useEffect, useState } from "react";
import imgWallet from "../../Assets/images/img_wallet.png";
import Header from "../Header/Header";
import { Link } from "react-router-dom";
import useWallets from "../../hooks/useWallets";
import { useUser } from "../../context/UserContext";
import useCryptoTradeConverter from "../../hooks/userCryptoTradeConverter";

function Account() {
  const { user } = useUser();
  const { wallets } = useWallets(user?.id);
  const [searchTerm, setSearchTerm] = useState("");
  const [coinValues, setCoinValues] = useState({});
  const { convertUSDTToCoin } = useCryptoTradeConverter();

  useEffect(() => {
    const fetchConvertedValues = async () => {
      if (wallets?.length > 0) {
        const newCoinValues = {};

        for (const wallet of wallets) {
          try {
            const convertedCoin = await convertUSDTToCoin(
              wallet?.coin_amount,
              wallet.coin_id
            );
            newCoinValues[wallet.coin_id] = convertedCoin;
          } catch (error) {
            console.error("Error converting coin:", error);
            newCoinValues[wallet.coin_id] = null; // Handle conversion error
          }
        }

        setCoinValues(newCoinValues);
      }
    };

    fetchConvertedValues();
  }, [wallets]);

  return (
    <div className="main">
      <div className="account">
        <Header pageTitle={""} />

        <div className="title_container">
          <div className="title_info">
            <div className="title fs-20 ff_NunitoBold">Send Crypto Now</div>
            <div className="subtitle fs-14 fc-5B616E ff_NunitoSemiBold">
              Choose a wallet to send crypto from
            </div>
          </div>
          <img src={imgWallet} alt="Wallet" className="title_img" />
        </div>

        <div className="wallet_select">
          <div className="title">
            <div className="select_line"></div>
            <div className="value fs-26 fc-5B616E ff_NunitoSemiBold">
              Select a wallet
            </div>

            <div className="ssb-search search-input">
              <div className="ssb-search__content ssb-search__content--square">
                <div className="ssb-cell ssb-cell--borderless ssb-field">
                  <div className="ssb-field__left-icon">
                    <i className="ssb-icon dashicons dashicons-search"></i>
                  </div>
                  <div className="ssb-cell__value ssb-cell__value--alone ssb-field__value">
                    <div className="ssb-field__body">
                      <input
                        type="search"
                        placeholder="Search"
                        className="ssb-field__control"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {wallets?.length > 0 && (
          <div className="wallet_list">
            {wallets?.map((wallet) => (
              <Link
                key={wallet.id}
                to="/funds"
                state={{ wallet, coinAmount: coinValues[wallet.coin_id] }}
                className="wallet_item"
              >
                <div className="item_info">
                  <img
                    className="icon"
                    src={`/assets/images/coins/${wallet.coin_symbol.toLowerCase()}-logo.png`}
                    alt={wallet.coin_symbol || ""}
                  />

                  <div className="info">
                    <div className="fs-32 fc-353F52 ff_NunitoBold">
                      {wallet.coin_symbol} Wallet
                    </div>
                    <div className="subtitle fs-26 fc-5B616E ff_NunitoSemiBold">
                      {wallet.coin_symbol} Coin
                    </div>
                  </div>
                </div>
                <div className="item_value">
                  <div className="value_us fs-32 fc-353F52 ff_InterSemiBold">
                    {coinValues[wallet.coin_id] !== undefined
                      ? coinValues[wallet.coin_id]
                      : "0.00"}{" "}
                    {wallet.coin_symbol}
                  </div>
                  <div className="value_num fs-26 fc-5B616E ff_InterMedium">
                    {parseFloat(wallet?.coin_amount).toFixed(2) || "0.00"} USDT
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Account;
