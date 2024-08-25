import { useState, useEffect } from 'react';

const useMetalCoinName = (coin) => {
    const [coinName, setCoinName] = useState('');

    useEffect(() => {
        let data = '';

        switch (coin) {
            case 'ES':
                data = "S&P Futures";
                break;
            case 'GC':
                data = "Gold (XAU)";
                break;
            case 'SI':
                data = "Silver (XAG)";
                break;
            case 'CL':
                data = "Crude Oil (WTI)";
                break;
            case 'PL':
                data = "Platinum (XPT)";
                break;
            default:
                data = "";
                break;
        }

        setCoinName(data);
    }, [coin]);

    return coinName;
};

export default useMetalCoinName;
