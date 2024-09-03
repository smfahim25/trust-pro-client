import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../Assets/sound/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useConversation();

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      const sound = new Audio(notificationSound);
      sound.play().catch((error) => {
        console.warn("Notification sound could not be played:", error);
      });
      setMessages([...messages, newMessage]);
    };

    socket?.on("newMessage", handleNewMessage);

    return () => socket?.off("newMessage", handleNewMessage);
  }, [socket, setMessages, messages]);
};

export default useListenMessages;
