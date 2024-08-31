import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import API_BASE_URL from "../api/getApiURL";

const useGetAllMessages = (convId,userId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllMessages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${API_BASE_URL}/messages/${convId}/user/${userId}`
      );
      setData(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId,convId]);

  useEffect(() => {
    if (userId) {
      fetchAllMessages();
    }
  }, [userId, fetchAllMessages]);

  // Returning fetchLatestDeposit as refetch function
  return { data, loading, error, refetch: fetchAllMessages };
};

export default useGetAllMessages;
