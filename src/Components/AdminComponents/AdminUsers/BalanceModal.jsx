import React, { useEffect, useState } from 'react';
import useWallets from '../../../hooks/useWallets';
import useCryptoTradeConverter from '../../../hooks/userCryptoTradeConverter';

const BalanceModal = ({ isOpen, onClose, details }) => {
    const { wallets } = useWallets(details?.id);

    const [coinValues, setCoinValues] = useState({});
    const { convertUSDTToCoin, loading } = useCryptoTradeConverter();
  
    useEffect(() => {
      const fetchConvertedValues = async () => {
        if (wallets?.length > 0) {
          const newCoinValues = {};
  
          for (const wallet of wallets) {
            try {
              const convertedCoin = await convertUSDTToCoin(wallet?.coin_amount, wallet.coin_id);
              newCoinValues[wallet.coin_id] = convertedCoin;
            } catch (error) {
              console.error("Error converting coin:", error);
              newCoinValues[wallet.coin_id] = null; // Handle conversion error
            }
          }
  
          setCoinValues(newCoinValues);
        }
      };
  
      fetchConvertedValues();
    }, [wallets]);


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative flex flex-col items-center max-w-lg gap-4 p-6 rounded-md shadow-md sm:py-8 sm:px-12 bg-white text-black">
        <button onClick={onClose} className="absolute top-2 right-2 bg-gray-900 hover:bg-gray-700">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" className="flex-shrink-0 w-6 h-6">
            <polygon points="427.314 107.313 404.686 84.687 256 233.373 107.314 84.687 84.686 107.313 233.373 256 84.686 404.687 107.314 427.313 256 278.627 404.686 427.313 427.314 404.687 278.627 256 427.314 107.313"></polygon>
          </svg>
        </button>

        <h2 className="text-2xl font-semibold leading-tight tracking-wide">Balance Details</h2>
        <div className="">
        <p className='text-start text-xs font-semibold' >UID : {details?.uuid}</p>
        <p className='text-start text-xs font-semibold'>Wallet : {details?.user_wallet}</p>
        </div>
        <table className="min-w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b">Coin Logo</th>
            <th className="py-2 px-4 border-b">Coin Name</th>
            <th className="py-2 px-4 border-b">Coin Symbol</th>
            <th className="py-2 px-4 border-b">Balance</th>
          </tr>
        </thead>
        <tbody className="text-center">
          {wallets?.map((wallet, index) => (
            <tr key={wallet.id}>
              <td className="py-2 px-4 border-b">
              {wallet.coin_logo ? (
                    <img
                      className="icon w-[30px] h-[30px]"
                      src={`/assets/images/coins/${wallet.coin_symbol.toLowerCase()}-logo.png`}
                      alt={wallet.coin_symbol || ""}
                    />
                  ) : (
                    <img src="" alt="No Icon" className="icon" />
                  )}
              </td>
              <td className="py-2 px-4 border-b">
              {wallet?.coin_name}
              </td>
              <td className="py-2 px-4 border-b">{wallet?.coin_symbol}</td>
              <td className="py-2 px-4 border-b">
                {loading
                    ? "Loading..."
                    : coinValues[wallet.coin_id] !== undefined
                    ? coinValues[wallet.coin_id]
                    : "N/A"}{" "}
                    {wallet.coin_symbol}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
        <div className='mb-4'>
         
        </div>
      </div>
    </div>
  );
};

export default BalanceModal;
