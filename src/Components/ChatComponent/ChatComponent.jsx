import React, { useEffect, useState, useRef } from "react";
import Header from "../Header/Header";
import axios from "axios";
import { useUser } from "../../context/UserContext";
import useGetAllConversation from "../../hooks/useGetAllConversation";
import { API_BASE_URL } from "../../api/getApiURL";
import { IoSend, IoClose } from "react-icons/io5";
import { ImAttachment } from "react-icons/im";
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
  const [selectedImage, setSelectedImage] = useState(null); // For full-screen view
  const { user } = useUser();
  const { data } = useGetAllConversation(user.id);
  const { selectedConversation, setSelectedConversation, setMessages } =
    useConversation();
  const { messages } = useGetMessages();
  useListenMessages();

  // Refs for chat end and file input
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
    setFilePreview("");
    fileInputRef.current.value = null; // Reset file input
  };

  // Open file input
  const handleAttachmentClick = () => {
    fileInputRef.current.click();
  };

  // Scroll to bottom of the chat
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  console.log(data);
  useEffect(() => {
    if (data) {
      setSelectedConversation(data[0]);
    }
  }, [data, setSelectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const sendMessage = async () => {
    if (message.trim() === "" && !file) return;
    formData.append("userId", user.id);
    formData.append("recipientId", 0);
    formData.append("messageText", message);
    formData.append("senderType", "user");
    if (file) {
      formData.append("documents", file);
    }

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
    const now = new Date();
    const secondsDifference = Math.floor((now - date) / 1000); // Difference in seconds

    if (secondsDifference < 60) {
      return "just now"; // Show "just now" if less than a minute
    }

    const hoursDifference = differenceInHours(now, date);
    return hoursDifference >= 1
      ? formatDistanceToNow(date, { addSuffix: true })
      : format(date, "hh:mm a");
  };

  // Show full-screen image
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  // Close full-screen modal
  const closeModal = () => {
    setSelectedImage(null);
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
                      {message?.message_text && (
                        <div className="px-3 py-2 bg-indigo-500 rounded">
                          <h2 className="text-white text-sm font-normal leading-snug">
                            {message?.message_text}
                          </h2>
                        </div>
                      )}
                      {message?.message_image && (
                        <div className="justify-end items-center inline-flex">
                          <img
                            className="w-[80%] leading-4 mt-1 cursor-pointer"
                            src={`${API_BASE_URL}/${message?.message_image}`}
                            alt=""
                            onClick={() =>
                              handleImageClick(
                                `${API_BASE_URL}/${message?.message_image}`
                              )
                            }
                          />
                        </div>
                      )}
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
                        {message?.message_text && (
                          <div className="px-3.5 py-2 bg-gray-100 rounded justify-start items-center gap-3 inline-flex break-normal flex-wrap">
                            <h5 className="text-gray-900 text-sm font-normal leading-snug">
                              {message?.message_text}
                            </h5>
                          </div>
                        )}
                        {message?.message_image && (
                          <img
                            className="w-[80%] mt-1 cursor-pointer"
                            src={`${API_BASE_URL}/${message?.message_image}`}
                            alt=""
                            onClick={() =>
                              handleImageClick(
                                `${API_BASE_URL}/${message?.message_image}`
                              )
                            }
                          />
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
                className="absolute top-1 right-1 text-gray-600 cursor-pointer"
                onClick={removeSelectedImage}
              >
                <IoClose size={16} />
              </span>
              <img
                src={filePreview}
                alt="Preview"
                className="w-full h-full object-cover rounded-md"
              />
            </div>
          </div>
        )}

        <span
          className="cursor-pointer mr-1 text-xl text-gray-700"
          onClick={handleAttachmentClick}
        >
          <ImAttachment />
        </span>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          type="text"
          placeholder="Message"
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-full px-2 py-1 border-none outline-none bg-transparent text-sm font-normal"
        />
        <button
          onClick={handleSendMessage}
          className="h-[40px] rounded-full flex justify-center items-center "
        >
          <IoSend className="text-white" />
        </button>
      </div>

      {/* Full-Screen Image Modal */}
      {selectedImage && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative w-full h-full flex justify-center items-center">
            <img
              src={selectedImage}
              alt="Full-size"
              className="max-w-[90%] max-h-[90%] object-contain"
            />
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-white bg-gray-800 rounded-full px-4"
              onClick={(e) => {
                e.stopPropagation(); // Prevents closing the modal when clicking the button
                closeModal();
              }}
            >
              <IoClose size={24} className="mt-2" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
