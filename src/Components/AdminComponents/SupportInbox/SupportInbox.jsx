import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../api/getApiURL';

const SupportInbox = () => {
    const [conversations, setConversations] = useState([]);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [replyText, setReplyText] = useState('');

    useEffect(() => {
        fetchConversations();
    }, []);

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
            const response = await axios.get(`http://localhost:5000/api/v1/messages/${conversationId}/user/0`);
            setSelectedConversation({ ...selectedConversation, messages: response.data });
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendReply = async () => {
        if (replyText.trim() === '') return;

        try {
            const response = await axios.post('http://localhost:5000/api/v1/messages/send', {
                userId: 1, // Admin user ID
                recipientId: selectedConversation.user2_id,
                messageText: replyText,
                senderType: 'admin'
            });

            setSelectedConversation({
                ...selectedConversation,
                messages: [...selectedConversation.messages, response.data]
            });
            setReplyText('');
        } catch (error) {
            console.error('Error sending reply:', error);
        }
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
              onClick={() => fetchMessages(conv.conversation_id)}
            >
              Conversation with {conv.user1_uuid === 'Anonymous' ? 'Anonymous User' : conv.user1_uuid}
            </li>
          ))}
        </ul>
      </div>

      <div className="max-h-screen w-2/3 bg-white shadow-lg p-4 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="flex-1 overflow-y-auto mb-4">
              {selectedConversation.messages.map((msg, index) => (
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
