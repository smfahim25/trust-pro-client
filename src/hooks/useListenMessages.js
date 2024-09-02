import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useGetAllMessages from "./useGetAllMessages";

const useListenMessages = (convId, userId) => {
  const { socket } = useSocketContext();
  const { messages, setMessages } = useGetAllMessages(convId, userId);
  console.log(messages);
  useEffect(() => {
    if (!convId || !socket) return;

    const handleNewMessage = (newMessage) => {
      console.log("getting message in admin : ",newMessage);
      setMessages(prevMessages => [...prevMessages, newMessage]);
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, convId, userId, setMessages]);

  return { messages,setMessages };
};

export default useListenMessages;
