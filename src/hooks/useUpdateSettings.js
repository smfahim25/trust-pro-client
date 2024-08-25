import { useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../api/getApiURL';

export const useUpdateSettings = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const updateSettings = async (updatedData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.put(`${API_BASE_URL}/settings`, updatedData );
      setSuccess(true);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { updateSettings, loading, error, success };
};
