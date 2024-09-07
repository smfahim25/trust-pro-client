import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../Assets/sound/notification.mp3";
import useGetMessages from "./useGetMessages";
import { useLocation } from "react-router";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();
  const { triggerRefetch } = useGetMessages();
  const location = useLocation();

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      const sound = new Audio(notificationSound);
      sound.play().catch((error) => {
        console.warn("Notification sound could not be played:", error);
      });
      if (location.pathname === "/cradmin/live-support") {
        triggerRefetch();
      }

      setMessages([...messages, newMessage]);
    };

    socket?.on("newMessage", handleNewMessage);

    return () => socket?.off("newMessage", handleNewMessage);
  }, [socket, setMessages, messages, triggerRefetch, location]);
};

export default useListenMessages;
