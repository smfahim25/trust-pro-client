import API_BASE_URL from "../../api/getApiURL";

const fetchForexMarketData = async (coin) => {
    const apiUrl = `${API_BASE_URL}/market/forex/${coin}`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching Forex data:', error);
    }
    return [];
  };
  
  const fetchMetalMarketData = async (coin) => {
    const apiUrl = `${API_BASE_URL}/market/metal/${coin}`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('Error fetching Metal market data:', error);
    }
    return [];
  };
  
  const fetchCryptoMarketData = async (coinId) => {
    const apiUrl = `https://api.coinlore.net/api/ticker/?id=${coinId}`;
  
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (error) {
      console.error('Error fetching Crypto data:', error);
    }
    return [];
  };
  
  const fetchMarketData = async (coin, type) => {
    switch (type) {
      case 'forex':
        return await fetchForexMarketData(coin);
      case 'metal':
        return await fetchMetalMarketData(coin);
      case 'crypto':
        return await fetchCryptoMarketData(coin);
      default:
        console.error('Invalid market type');
        return [];
    }
  };

export default fetchMarketData;  