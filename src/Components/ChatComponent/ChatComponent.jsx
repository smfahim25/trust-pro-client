import React, { useEffect, useState, useRef } from "react";
import Header from "../Header/Header";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import useGetAllConversation from "../../hooks/useGetAllConversation";
import { API_BASE_URL } from "../../api/getApiURL";
import { IoSend } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import debounce from "lodash.debounce";
import useListenMessages from "../../hooks/useListenMessages";
import useConversation from "../../zustand/useConversation";
import useGetMessages from "../../hooks/useGetMessages";
import { differenceInHours, format, formatDistanceToNow } from "date-fns";

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const { user } = useUser();
  const { data } = useGetAllConversation(user.id);
  const { selectedConversation, setSelectedConversation, setMessages } =
    useConversation();
  const { messages } = useGetMessages();
  useListenMessages();

  // Create refs for the chat container and file input
  const chatEndRef = useRef(null);
  // const fileInputRef = useRef(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (data) {
      setSelectedConversation(data[0]);
    }
  }, [data]);

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
      recipientId: 0,
      messageText: message,
      senderType: "user",
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/messages/send`,
        messageData
      );
      if (response && !selectedConversation) {
        setSelectedConversation(response?.data);
      }
      setMessages([...messages, response?.data]);
      setMessage("");
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

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const hoursDifference = differenceInHours(new Date(), date);

    if (hoursDifference >= 1) {
      // Show relative time if more than 1 hour ago
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      // Show exact time if within the last hour
      return format(date, "hh:mm a");
    }
  };

  return (
    <div className="w-full">
      <Header pageTitle="Live Chat" />
      <hr className="" />
      <div className="h-[83vh] overflow-y-auto">
        {messages ? (
          messages?.map((message, index) => {
            const isCurrentUser = message?.sender_id === user.id;
            const previousMessage = messages[index - 1];
            const showLabel =
              !previousMessage ||
              previousMessage.sender_id !== message.sender_id;

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
                          {formatTime(message?.created_at)}
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
                            {formatTime(message?.created_at)}
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center">Write your message how can we help</p>
        )}

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
            <IoSend title="send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
