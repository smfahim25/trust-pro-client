import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../api/getApiURL";

export const useFetchUserBalance = (userId, coinId) => {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBalance = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/userbalance/${userId}/balance/${coinId}`
      );
      setBalance(response.data.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId && coinId) {
      fetchBalance();
    }
  }, [userId, coinId]);

  return { balance, loading, error, refetch: fetchBalance };
};
