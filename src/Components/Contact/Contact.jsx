import React from 'react';
import Header from '../Header/Header';
import useSettings from '../../hooks/useSettings';

const Contact = () => {
    const {settings} = useSettings();

    return (
        <div>
            <Header pageTitle="Contact Us"/>
            <div className="ml-4 p-2">
            <h2>Online support WhatsApp: {settings?.whatsapp}</h2>
            <h2>Email: {settings?.email}</h2>
            </div>
        </div>
    );
};

export default Contact;