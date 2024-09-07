import React, { useEffect, useState, useRef } from "react";
import Header from "../Header/Header";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import useGetAllConversation from "../../hooks/useGetAllConversation";
import { API_BASE_URL } from "../../api/getApiURL";
import { IoSend } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { ImAttachment } from "react-icons/im";
import { CgProfile } from "react-icons/cg";
import debounce from "lodash.debounce";
import useListenMessages from "../../hooks/useListenMessages";
import useConversation from "../../zustand/useConversation";
import useGetMessages from "../../hooks/useGetMessages";
import { differenceInHours, format, formatDistanceToNow } from "date-fns";

const ChatComponent = () => {
  const [message, setMessage] = useState("");
  const formData = new FormData();
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState("");
  const { user } = useUser();
  const { data } = useGetAllConversation(user.id);
  const { selectedConversation, setSelectedConversation, setMessages } =
    useConversation();
  const { messages } = useGetMessages();
  useListenMessages();

  // Create refs for the chat container and file input
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile)); 
    }
  };

   // Remove selected image
   const removeSelectedImage = () => {
    setFile(null);
    setFilePreview(""); // Clear the file and preview
    fileInputRef.current.value = null; // Reset file input
  };

  // Handles the attachment icon click to open the hidden file input
  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // trigger file input
    }
  };

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
  }, [data, setSelectedConversation]);

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
    formData.append("userId", user.id);
    formData.append("recipientId",0);
    formData.append("messageText", message);
    formData.append("senderType","user");
    if(file){
      formData.append("documents",file);
    }
    // const messageData = {
    //   userId: user.id,
    //   recipientId: 0,
    //   messageText: message,
    //   senderType: "user",
    // };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/messages/send`,
        formData
      );
      if (response && !selectedConversation) {
        setSelectedConversation(response?.data);
      }
      setMessages([...messages, response?.data]);
      setMessage("");
      setFile(null);
      setFilePreview("");
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
        {messages && messages.length > 0 ? (
          messages.map((message, index) => {
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
                      <div className="justify-end items-center inline-flex">
                      {message?.message_image && (
                        <img className="w-[50%] h-[50%] leading-4 mt-1" src={`${API_BASE_URL}/${message?.message_image}`} alt="" />
                      )}
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
                          <h5 className="text-gray-900 text-sm font-normal leading-snug">
                            {message?.message_text}
                          </h5>
                        </div>
                        {message?.message_image && (
                        <img className="w-[50%] h-[50%] mt-1" src={`${API_BASE_URL}/${message?.message_image}`} alt="" />
                      )}
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
          <div className="flex flex-col justify-center items-center h-[50vh]">
            <div className="">
              <img
                src="/avatar.jpg"
                alt="User Avatar"
                className="rounded-full h-[150px] w-[150px]"
              />
            </div>
            <p className="text-center text-lg font-semibold">
              Write your question briefly, how can we help?
            </p>
          </div>
        )}

        {/* Ref to capture the end of the chat */}
        <div ref={chatEndRef} />
      </div>

      <div className="relative w-full pl-3 pr-1 py-1 px-2 rounded-3xl border border-gray-200 items-center gap-2 inline-flex">
         {/* Floating Image Preview */}
      {filePreview && (
        <div className="absolute top-[-138px] left-0 right-0 flex justify-center">
          <div className="relative w-[120px] h-[120px] bg-white shadow-lg rounded-lg p-2">
            <span
              className="absolute top-1 right-1 text-gray-500 p-1 bg-black"
              onClick={removeSelectedImage}
            >
              <IoClose size={20} className="text-white"/>
            </span>
            <img
              src={filePreview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      )}

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
          <ImAttachment
            size={20}
            onClick={handleAttachmentClick}
            className="cursor-pointer"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }} // Hide the file input
          />
          <button onClick={handleSendMessage}>
            <IoSend title="send" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
