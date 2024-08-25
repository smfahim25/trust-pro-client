import { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../api/getApiURL";

const cache = {};

const useCurrencyConverter = (from_currency, to_currency, amount) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cacheKey = `${from_currency}_${to_currency}_${amount}`;
    if (cache[cacheKey]) {
      setData(cache[cacheKey]);
      setLoading(false);
    } else if (amount && from_currency && to_currency) {
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios.post(
            `${API_BASE_URL}/market/converter`,
            {
              from_currency,
              to_currency,
              amount,
            }
          );
          cache[cacheKey] = response.data;
          setData(response.data);
        } catch (error) {
          setError(error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [from_currency, to_currency, amount]);

  return { data, loading, error };
};

export default useCurrencyConverter;
