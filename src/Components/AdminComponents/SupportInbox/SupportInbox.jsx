import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../../api/getApiURL";
import { useUser } from "../../../context/UserContext";
import { useSocketContext } from "../../../context/SocketContext";
import useListenMessages from "../../../hooks/useListenMessages";
import useGetMessages from "../../../hooks/useGetMessages";
import useConversation from "../../../zustand/useConversation";
import { format, formatDistanceToNow, differenceInHours } from "date-fns";
import { FaReply } from "react-icons/fa";

const SupportInbox = () => {
  const { adminUser } = useUser();
  const { onlineUsers } = useSocketContext();
  const [conversations, setConversations] = useState([]);
  const [replyText, setReplyText] = useState("");
  const { selectedConversation, setSelectedConversation, setMessages } =
    useConversation();
  const { messages, loading } = useGetMessages();
  useListenMessages();

  // Ref for scrolling to the bottom
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    fetchConversations();
    if (messages) {
      scrollToBottom(); // Scroll to bottom when messages update
    }
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/conversation/`);
      setConversations(response.data);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    }
  };

  const sendReply = async () => {
    if (replyText.trim() === "" || !selectedConversation) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/messages/send`, {
        userId: adminUser.id, // Admin user ID
        recipientId: selectedConversation?.user1_id,
        messageText: replyText,
        senderType: "admin",
      });
      setMessages([...messages, response?.data]);
      setReplyText("");
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  const handleFetchConversation = (conv) => {
    setSelectedConversation(conv);
  };

  const checkOnlineStatus = (userId) => {
    const userIdStr = String(userId);
    const isOnline = onlineUsers?.map(String).includes(userIdStr);
    return isOnline;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hoursDifference = differenceInHours(new Date(), date);

    if (hoursDifference >= 1) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, "hh:mm a");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendReply();
    }
  };

  return (
    <div className="flex">
      <div className="w-1/3 bg-white shadow-lg p-4 h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Conversations</h3>
        <ul className="space-y-2">
          {conversations.map((conv) => (
            <li
              key={conv.conversation_id}
              className="p-2 bg-gray-200 hover:bg-gray-300 cursor-pointer rounded-md"
              onClick={() => handleFetchConversation(conv)}
            >
              <div className="flex justify-between">
                <p>{conv?.user1_name || conv?.user1_uuid}</p>
                <p
                  className={`text-xs ${
                    checkOnlineStatus(conv.user1_id)
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {checkOnlineStatus(conv.user1_id) ? "Online" : "Offline"}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-2/3 bg-white shadow-lg p-4 flex flex-col h-[90vh] overflow-y-auto">
        {selectedConversation ? (
          <>
            <div className="font-bold pb-2 border-b mb-4">
              {selectedConversation?.user1_name ||
                selectedConversation?.user1_uuid}
            </div>
            <div className="flex-1 overflow-y-auto mb-4">
              {messages?.map((msg, index) => {
                const isAdmin = msg.sender_type === "admin";

                return (
                  <div key={msg.id} className="grid pb-1 px-2">
                    {isAdmin ? (
                      <div className="flex gap-2.5 justify-end pb-1">
                        <div>
                          <div className="px-3 py-2 bg-indigo-500 rounded">
                            <h2 className="text-white text-sm font-normal leading-snug">
                              {msg.message_text}
                            </h2>
                          </div>
                          <div className="justify-start items-center inline-flex">
                            <h3 className="text-gray-500 text-xs font-normal leading-4 py-1">
                              {formatTime(msg.created_at)}
                            </h3>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2.5">
                        <div className="grid">
                          <div className="w-full flex flex-col">
                            <div className="px-3.5 py-2 bg-gray-100 rounded justify-start items-center gap-3 inline-flex break-normal flex-wrap">
                              <h5 className="text-gray-900 text-sm font-normal leading-snug">
                                {msg.message_text}
                              </h5>
                            </div>
                            <div className="justify-end items-center inline-flex mb-2.5">
                              <h6 className="text-gray-500 text-xs font-normal leading-4 py-1">
                                {formatTime(msg.created_at)}
                              </h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
            <div className="w-full pl-3 pr-1 py-1 px-2 rounded-3xl border border-gray-200 items-center gap-2 inline-flex">
              <div className="w-full">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={handleKeyDown} // Listen for Enter key
                  placeholder="Type your reply here..."
                  className="w-full grow shrink basis-0 text-black text-xs font-medium leading-4 focus:outline-none h-[20px]"
                />
              </div>
              <button
                onClick={sendReply}
                className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex"
              >
                <FaReply title="reply" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to view messages
          </div>
        )}
      </div>
    </div>
  );
};

export default SupportInbox;
