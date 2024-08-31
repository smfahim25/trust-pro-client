import React, { useCallback, useEffect, useState } from 'react';
import Header from '../Header/Header';
import axios from 'axios';
import { useUser } from '../../context/UserContext';
import useGetAllConversation from '../../hooks/useGetAllConversation';
import useGetAllMessages from '../../hooks/useGetAllMessages';
import API_BASE_URL from '../../api/getApiURL';

const ChatComponent = () => {
  const [message, setMessage] = useState('');
  const [conversationId, setConversationId] = useState(4);
  const {user} = useUser();
  const {data} = useGetAllConversation(user.id);
  const [toggleMessage,setToggleMessage] = useState(false);
  // const {data:messages} = useGetAllMessages(conversationId,user.id);

  const [messages, setMessages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    if(toggleMessage){
      fetchAllMessages();
    }
  }, [conversationId, user,toggleMessage]);
  

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async() => {
    const messageData = {
      userId:user.id,
      recipientId:19,
      messageText: message,
    }
    const response = await axios.post(`${API_BASE_URL}/messages/send`,messageData);
    console.log('Message sent:', message);
    setMessage(''); // Clear the input field after sending
    setToggleMessage(!toggleMessage);
  };

  return (
    <div className="w-full">
      <Header pageTitle="Live Chat"/>
      <hr className='pb-4'/>
      <div className="h-[83vh] overflow-y-auto">
        {
          messages?.map((message)=>
          <div key={message?.id} className="grid pb-1 px-2">
             {message?.sender_id !== user.id ? (
 <div className="flex gap-2.5 mb-4">
 <div className="grid">
   <h5 className="text-gray-900 text-sm font-semibold leading-snug pb-1">Support Admin</h5>
   <div className="w-full flex flex-col">
     <div className="px-3.5 py-2 bg-gray-100 rounded justify-start items-center gap-3 inline-flex break-normal flex-wrap">
       <h5 className="text-gray-900 text-sm font-normal leading-snug ">{message?.message_text}</h5>
     </div>
     <div className="justify-end items-center inline-flex mb-2.5">
       <h6 className="text-gray-500 text-xs font-normal leading-4 py-1">{message?.created_at}</h6>
     </div>
   </div>
   {/* <div className="w-max grid">
     <div className="px-3.5 py-2 bg-gray-100 rounded justify-start items-center gap-3 inline-flex">
       <h5 className="text-gray-900 text-sm font-normal leading-snug">Let me know</h5>
     </div>
     <div className="justify-end items-center inline-flex mb-2.5">
       <h6 className="text-gray-500 text-xs font-normal leading-4 py-1">05:14 PM</h6>
     </div>
   </div> */}
 </div>
</div>
              ) : (
                <div className="flex gap-2.5 justify-end pb-1">
                <div>
                  <div className="grid mb-2">
                    <h5 className="text-right text-gray-900 text-sm font-semibold leading-snug pb-1">You</h5>
                    <div className="px-3 py-2 bg-indigo-600 rounded">
                      <h2 className="text-white text-sm font-normal leading-snug">{message?.message_text}</h2>
                    </div>
                    <div className="justify-start items-center inline-flex">
                      <h3 className="text-gray-500 text-xs font-normal leading-4 py-1">{message?.created_at}</h3>
                    </div>
                  </div>
                  {/* <div className="justify-center">
                    <div className="grid w-fit ml-auto">
                      <div className="px-3 py-2 bg-indigo-600 rounded">
                        <h2 className="text-white text-sm font-normal leading-snug">Anyone on for lunch today</h2>
                      </div>
                      <div className="justify-start items-center inline-flex">
                        <h3 className="text-gray-500 text-xs font-normal leading-4 py-1">You</h3>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
              )}
           
          </div>
          )
        }
     
      </div>
     
      <div className="w-full pl-3 pr-1 py-1 px-2 rounded-3xl border border-gray-200 items-center gap-2 inline-flex justify-between ">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
            <g id="User Circle">
              <path
                id="icon"
                d="M6.05 17.6C6.05 15.3218 8.26619 13.475 11 13.475C13.7338 13.475 15.95 15.3218 15.95 17.6M13.475 8.525C13.475 9.89191 12.3669 11 11 11C9.6331 11 8.525 9.89191 8.525 8.525C8.525 7.1581 9.6331 6.05 11 6.05C12.3669 6.05 13.475 7.1581 13.475 8.525ZM19.25 11C19.25 15.5563 15.5563 19.25 11 19.25C6.44365 19.25 2.75 15.5563 2.75 11C2.75 6.44365 6.44365 2.75 11 2.75C15.5563 2.75 19.25 6.44365 19.25 11Z"
                stroke="#4F46E5"
                strokeWidth="1.6"
              />
            </g>
          </svg>
          <input
            className="grow shrink basis-0 text-black text-xs font-medium leading-4 focus:outline-none"
            placeholder="Type here..."
            value={message}
            onChange={handleInputChange}
          />
        </div>
        <div className="flex items-center gap-2">
          <svg
            className="cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
          >
            <g id="Attach 01">
              <g id="Vector">
                <path
                  d="M14.9332 7.79175L8.77551 14.323C8.23854 14.8925 7.36794 14.8926 6.83097 14.323C6.294 13.7535 6.294 12.83 6.83097 12.2605L12.9887 5.72925M12.3423 6.41676L13.6387 5.04176C14.7126 3.90267 16.4538 3.90267 17.5277 5.04176C18.6017 6.18085 18.6017 8.02767 17.5277 9.16676L16.2314 10.5418M16.8778 9.85425L10.72 16.3855C9.10912 18.0941 6.49732 18.0941 4.88641 16.3855C3.27549 14.6769 3.27549 11.9066 4.88641 10.198L11.0441 3.66675"
                  stroke="#9CA3AF"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.9332 7.79175L8.77551 14.323C8.23854 14.8925 7.36794 14.8926 6.83097 14.323C6.294 13.7535 6.294 12.83 6.83097 12.2605L12.9887 5.72925M12.3423 6.41676L13.6387 5.04176C14.7126 3.90267 16.4538 3.90267 17.5277 5.04176C18.6017 6.18085 18.6017 8.02767 17.5277 9.16676L16.2314 10.5418M16.8778 9.85425L10.72 16.3855C9.10912 18.0941 6.49732 18.0941 4.88641 16.3855C3.27549 14.6769 3.27549 11.9066 4.88641 10.198L11.0441 3.66675"
                  stroke="black"
                  strokeOpacity="0.2"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </g>
          </svg>
          <button
            className="items-center flex px-3 py-2 bg-indigo-600 rounded-full shadow"
            onClick={handleSendMessage}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <g id="Send 01">
                <path
                  id="icon"
                  d="M9.04071 6.959L6.54227 9.45744M6.89902 10.0724L7.03391 10.3054C8.31034 12.5102 8.94855 13.6125 9.80584 13.5252C10.6631 13.4379 11.0659 12.2295 11.8715 9.81261L13.0272 6.34566C13.7631 4.13794 14.1311 3.03408 13.5484 2.45139C12.9657 1.8687 11.8618 2.23666 9.65409 2.97257L6.18714 4.12822C3.77029 4.93383 2.56187 5.33664 2.47454 6.19392C2.38721 7.0512 3.48957 7.68941 5.69431 8.96584L5.92731 9.10074C6.23326 9.27786 6.38623 9.36643 6.50978 9.48998C6.63333 9.61352 6.72189 9.7665 6.89902 10.0724Z"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </g>
            </svg>
            <h3 className="text-white text-xs font-semibold leading-4 px-2">Send</h3>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
