import React from 'react';
import { Link } from 'react-router-dom';

const ChatPopup = ({ visible, onClose }) => {
    if (!visible) return null;
    const chatServiceName = "Live Chat";
    return (
        <div id="chat_popup">
            <div className="ssb-overlay" style={{ zIndex: 2030 }}></div>
            <div className="setting_popup ssb-popup ssb-popup--center" style={{ width: '80%', zIndex: 2031, height: 'auto' }}>
                <div className="title fs-16 fc-353F52 ff_NunitoSemiBold flex justify-between">
                    <div className="title-text">Chat with us</div>
                    <div className="close" onClick={onClose}>
                        <img src={`assets/images/icon_close.svg`} alt="Close" className="icon_close" />
                    </div>
                </div>
                <div className="flex justify-center mt-5">
                    <Link className="" to={'/contact-us'}>
                        <div onClick={onClose} className="">
                            <img className='w-[35px] ml-2' src={`assets/images/service-chat.png`} alt="Chat Service" />
                        </div>
                        <div className="text-center">{chatServiceName || "Live Chat"}</div>
                    </Link>
                </div>
            </div> 
        </div>
    );
};

export default ChatPopup;
