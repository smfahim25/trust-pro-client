import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../api/getApiURL';
import { useUser } from '../../../context/UserContext';
import { useSocketContext } from '../../../context/SocketContext';
import useListenMessages from '../../../hooks/useListenMessages';

const SupportInbox = () => {
  const { adminUser } = useUser();
  const { onlineUsers } = useSocketContext();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [reciverId, setReciverId] = useState(null);
  const [conversationId, setConversationId] = useState(null);

  // const { messages: liveMessages } = useListenMessages(conversationId, 0);

  useEffect(() => {
    fetchConversations();
  }, []);

  // useEffect(() => {
  //   if (liveMessages && selectedConversation) {
  //     setSelectedConversation((prevConversation) => ({
  //       ...prevConversation,
  //       messages: [...(prevConversation?.messages || []), ...liveMessages],
  //     }));
  //   }
  // }, [liveMessages]);

  const fetchConversations = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/conversation/`);
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/messages/${conversationId}/user/0`);
      setSelectedConversation({ ...selectedConversation, messages: response.data });
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendReply = async () => {
    if (replyText.trim() === '' || !selectedConversation) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/messages/send`, {
        userId: adminUser.id, // Admin user ID
        recipientId: reciverId,
        messageText: replyText,
        senderType: 'admin',
      });

      setSelectedConversation((prevConversation) => ({
        ...prevConversation,
        messages: [...(prevConversation?.messages || []), response.data],
      }));
      setReplyText('');
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const handleFetchConversation = (conv) => {
    fetchMessages(conv.conversation_id);
    setConversationId(conv.conversation_id);
    setReciverId(conv?.user1_id);
    setSelectedConversation(conv);
  };

  const checkOnlineStatus = (userId) => {
    const userIdStr = String(userId);
    const isOnline = onlineUsers?.map(String).includes(userIdStr);
    return isOnline;
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-1/3 bg-white shadow-lg p-4">
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
                <p className={`text-xs ${checkOnlineStatus(conv.user1_id) ? 'text-green-500' : 'text-red-500'}`}>
                  {checkOnlineStatus(conv.user1_id) ? 'Online' : 'Offline'}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="max-h-screen w-2/3 bg-white shadow-lg p-4 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="font-bold pb-2">
              {selectedConversation?.user1_name || selectedConversation?.user1_uuid}
            </div>
            <div className="flex-1 overflow-y-auto mb-4">
              {selectedConversation?.messages?.map((msg, index) => (
                <div key={index} className={`mb-2 p-2 rounded-md ${msg.sender_type === 'admin' ? 'bg-blue-200 text-right' : 'bg-gray-200'}`}>
                  <p>{msg.message_text}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply here..."
                className="flex-1 p-2 border rounded-md focus:outline-none"
              />
              <button onClick={sendReply} className="ml-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Reply
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
