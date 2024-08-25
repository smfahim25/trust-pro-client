import { useState, useEffect } from "react";
import API_BASE_URL from "../api/getApiURL";
import { useUser } from "../context/UserContext";

const useTimerProfit = () => {
  const [timerProfits, setTimerProfits] = useState([]);
  const { setLoading } = useUser();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTimerProftis = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/timerprofits`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTimerProfits(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    
      fetchTimerProftis();
    
  }, []);

  return { timerProfits, error,setTimerProfits};
};

export default useTimerProfit;
