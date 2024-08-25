import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import API_BASE_URL from "../api/getApiURL";

const useFetchLatestDeposit = (userId, coinId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLatestDeposit = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/deposits/latest/${userId}/coin/${coinId}`
      );
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId, coinId]);

  useEffect(() => {
    if (userId && coinId) {
      fetchLatestDeposit();
    }
  }, [userId, coinId, fetchLatestDeposit]);

  // Returning fetchLatestDeposit as refetch function
  return { data, loading, error, refetch: fetchLatestDeposit };
};

export default useFetchLatestDeposit;
