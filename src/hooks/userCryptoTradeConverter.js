import { useState, useEffect } from "react";
import numberFormat from "../Components/utils/numberFormat";
import { useUser } from "../context/UserContext";

const useCryptoTradeConverter = () => {
  const [usdt, setUsdt] = useState(1);
  const {setLoading} = useUser();
  const [error, setError] = useState(null);
  // Function to fetch coin data 
  const fetchCoinData = async (coin_id) => {
    const apiUrl = `https://api.coinlore.net/api/ticker/?id=${coin_id}`;
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data && data.length > 0) {
        // setCoinData((prevData) => ({
        //   ...prevData,
        //   [coin_id]: data[0],
        // }));
        return data[0];
      }
    } catch (err) {
      setError(err.message);
    }
    return null;
  };

  // Function to get the USDT market price
  const getUSDTMarket = async () => {
    const usdtData = await fetchCoinData(518);
    if (usdtData) {
      setUsdt(usdtData.price_usd);
    }
    return usdtData ? usdtData.price_usd : 1;
  };

  // Function to convert a balance in another coin to USDT
  const convertCoinToUSDT = async (balance, coin_id) => {
    await getUSDTMarket();
    const coin = await fetchCoinData(coin_id);
    if (coin && usdt) {
      return numberFormat((balance * coin.price_usd) / usdt);
    }
    return numberFormat(0.0, 2);
  };

  // Function to convert a USDT amount to another coin
  const convertUSDTToCoin = async (amount, coin_id) => {
    await getUSDTMarket();
    const coin = await fetchCoinData(coin_id);
    const defaultCoinData = numberFormat(0.0, 7);
    if (coin && usdt) {
      const convertedCoin = (amount * usdt) / coin.price_usd;
      const formmatedCoin = numberFormat(convertedCoin, 7);
      return formmatedCoin;
    }
    return defaultCoinData;
  };

  // Initial fetching of USDT market data
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      await getUSDTMarket();
      setLoading(false);
    };
    fetchInitialData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    usdt,
    error,
    convertCoinToUSDT,
    convertUSDTToCoin,
  };
};

export default useCryptoTradeConverter;
