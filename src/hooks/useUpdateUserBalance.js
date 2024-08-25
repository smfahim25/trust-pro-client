import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/getApiURL';

export const useUpdateUserBalance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateUserBalance = async (userId, coinId, coinAmount) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.put(`${API_BASE_URL}/userbalance/${userId}/balance/${coinId}`, { coinAmount });
      setSuccess(true);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { updateUserBalance, loading, error, success };
};
