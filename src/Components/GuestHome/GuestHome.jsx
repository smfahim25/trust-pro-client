import React from 'react';
import './GuestHome.css';
import backGroundImg from '../../Assets/images/background.png';

import logo from '../../Assets/images/logo.png';
import introImg from '../../Assets/images/front_image.png';
import google_play from '../../Assets/images/google_play.png';
import appleLogo from '../../Assets/images/apple_store.png';
import { Link } from 'react-router-dom';

const GuestHome = () => {
    return (
        <div>
            <div
                className="main"
                style={{
                    backgroundImage: `url(${backGroundImg})`,
                    backgroundPosition: "top",
                    backgroundRepeat: "no-repeat"
                }}
                >
        <div className="img-top">
            <a href="/" className="custom-logo-link" rel="home" aria-current="page">
                <img width="56" height="56" src={logo} className="custom-logo" alt="TrustPro" decoding="async"/>
            </a> 
            <div className="theme-title">
                <span>TrustPro</span>
            </div>
        </div>
        <div className="content-title">
            <span>Get Trust Wallet</span>
           
        </div>
        <div className="content-title">
            <Link to="/login">
            <button className='bg-white text-cyan-400 hover:bg-gray-100'> Login or Create Account</button>
            </Link>
        
           
        </div>
        
        <div className="content-subtitle">
            The easiest and most secure crypto wallet
        </div>
        <div className="intro_list">
            <div className="intro_item">
                <i className="icon_select dashicons dashicons-yes"></i>
                <span>Store all your crypto and NFTs in one place</span>
            </div>
            <div className="intro_item">
                <i className="icon_select dashicons dashicons-yes"></i>
                <span>Trade 500+ assets on DEXes and earn interest</span>
            </div>
            <div className="intro_item">
                <i className="icon_select dashicons dashicons-yes"></i>
                <span>No Coinbase account required</span>
            </div>
        </div>
        
        <div className="intro_img">
            <img className="img_phone" src={introImg} alt=""/>
        </div>

        <div className="download_actions">
            <a href="https://play.google.com/store/apps/details?id=com.wallet.crypto.trustapp&amp;hl=en" target="_blank" rel='noreferrer'>
                <img src={google_play} alt=""/>
            </a>
            <a href="https://apps.apple.com/us/app/trust-crypto-bitcoin-wallet/" target="_blank" rel='noreferrer'>
                <img src={appleLogo} alt=""/>
            </a>
        </div>
    </div>
        </div>
    );
};

export default GuestHome;