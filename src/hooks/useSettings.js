import { useState, useEffect } from "react";
import API_BASE_URL from "../api/getApiURL";

const useSettings = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/settings`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };


      fetchSettings();
    
  }, []);

  return { settings, loading, error,setSettings };
};

export default useSettings;
