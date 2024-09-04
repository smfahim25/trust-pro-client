import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import { API_BASE_URL } from "../api/getApiURL";
import { toast } from "react-toastify";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/messages/${selectedConversation.conversation_id}/user/0`
        );
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setMessages(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?.conversation_id) getMessages();
  }, [selectedConversation?.conversation_id, setMessages]);

  return { messages, loading };
};
export default useGetMessages;
