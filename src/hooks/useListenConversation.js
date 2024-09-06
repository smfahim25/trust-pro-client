import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import notificationSound from "../Assets/sound/notification.mp3";

const useListenConversation = () => {
  const { socket } = useSocketContext();
  //   const { messages, setMessages } = useConversation();

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      const sound = new Audio(notificationSound);
      sound.play().catch((error) => {
        console.warn("Notification sound could not be played:", error);
      });
      console.log("geting new conver: ", newMessage);
    };

    socket?.on("getUnreadMessage", handleNewMessage);

    return () => socket?.off("getUnreadMessage", handleNewMessage);
  }, [socket]);
};

export default useListenConversation;
