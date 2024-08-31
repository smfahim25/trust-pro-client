import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import API_BASE_URL from "../api/getApiURL";

const useGetAllConversation = (userId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllConversation = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/conversation/user/${userId}`
      );
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchAllConversation();
    }
  }, [userId, fetchAllConversation]);

  // Returning fetchLatestDeposit as refetch function
  return { data, loading, error, refetch: fetchAllConversation };
};

export default useGetAllConversation;
