import React, { useEffect, useState, useRef } from "react";
import Header from "../Header/Header";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import useGetAllConversation from "../../hooks/useGetAllConversation";
import API_BASE_URL from "../../api/getApiURL";
import { IoSend } from "react-icons/io5";
import { ImAttachment } from "react-icons/im";
import { CgProfile } from "react-icons/cg";
import debounce from "lodash.debounce"; // Import debounce function from lodash

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const [conversationId, setConversationId] = useState(4);
  const { user } = useUser();
  const { data } = useGetAllConversation(user.id);
  const [toggleMessage, setToggleMessage] = useState(false);
  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Create refs for the chat container and file input
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchAllMessages = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${API_BASE_URL}/messages/${conversationId}/user/${user.id}`
        );
        setMessages(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMessages();
    if (toggleMessage) {
      fetchAllMessages();
    }
  }, [conversationId, user, toggleMessage]);

  useEffect(() => {
    // Scroll to bottom when the messages state is updated
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  // Define sendMessage without dependencies
  const sendMessage = async () => {
    if (message.trim() === "") return; // Don't send empty messages

    const messageData = {
      userId: user.id,
      recipientId: 17,
      messageText: message,
    };

    try {
      await axios.post(`${API_BASE_URL}/messages/send`, messageData);
      console.log("Message sent:", message);
      setMessage(""); // Clear the input field after sending
      setToggleMessage(!toggleMessage);
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const debouncedSendMessage = debounce(async () => {
    await sendMessage();
  }, 300);

  const handleSendMessage = () => {
    debouncedSendMessage();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const getFormattedDeliveryTime = (createdAt) => {
    const date = new Date(createdAt);

    // Convert date to local time string
    const localDateTime = date.toLocaleString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return localDateTime.replace(",", "");
  };

  return (
    <div className="w-full">
      <Header pageTitle="Live Chat" />
      <hr className="pb-4" />
      <div className="h-[83vh] overflow-y-auto">
        {messages?.map((message, index) => {
          const isCurrentUser = message?.sender_id === user.id;
          const previousMessage = messages[index - 1];
          const showLabel =
            !previousMessage || previousMessage.sender_id !== message.sender_id;

          return (
            <div key={message?.id} className="grid pb-1 px-2">
              {isCurrentUser ? (
                <div className="flex gap-2.5 justify-end pb-1">
                  <div>
                    {showLabel && (
                      <h5 className="text-right text-gray-900 text-sm font-semibold leading-snug pb-1">
                        You
                      </h5>
                    )}
                    <div className="px-3 py-2 bg-indigo-500 rounded">
                      <h2 className="text-white text-sm font-normal leading-snug">
                        {message?.message_text}
                      </h2>
                    </div>
                    <div className="justify-start items-center inline-flex">
                      <h3 className="text-gray-500 text-xs font-normal leading-4 py-1">
                        {getFormattedDeliveryTime(message?.created_at)}
                      </h3>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2.5">
                  <div className="grid">
                    {showLabel && (
                      <h5 className="text-gray-900 text-sm font-semibold leading-snug pb-1">
                        Support Admin
                      </h5>
                    )}
                    <div className="w-full flex flex-col">
                      <div className="px-3.5 py-2 bg-gray-100 rounded justify-start items-center gap-3 inline-flex break-normal flex-wrap">
                        <h5 className="text-gray-900 text-sm font-normal leading-snug ">
                          {message?.message_text}
                        </h5>
                      </div>
                      <div className="justify-end items-center inline-flex mb-2.5">
                        <h6 className="text-gray-500 text-xs font-normal leading-4 py-1">
                          {getFormattedDeliveryTime(message?.created_at)}
                        </h6>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
        {/* Ref to capture the end of the chat */}
        <div ref={chatEndRef} />
      </div>

      <div className="w-full pl-3 pr-1 py-1 px-2 rounded-3xl border border-gray-200 items-center gap-2 inline-flex">
        <div className="flex items-center gap-2">
          <CgProfile size={25} />
        </div>
        <div className="w-full">
          <input
            className="w-full grow shrink basis-0 text-black text-xs font-medium leading-4 focus:outline-none h-[20px]"
            placeholder="Type here..."
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>
        <div className="flex items-center gap-2">
          {/* <ImAttachment
            size={20}
            onClick={handleAttachmentClick}
            className="cursor-pointer"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }} // Hide the file input
          /> */}
          <button onClick={handleSendMessage}>
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
