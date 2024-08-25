import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Spinner from '../Spinner/Spinner';

const user = {
  uuid: "sample-uuid-1234",
  id: "user-id-5678",
};

const fetchReferralHistoryCount = async (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockReferralHistoryCount = 5; 
      resolve(mockReferralHistoryCount);
    }, 1000);
  });
};

const ReferralBonusHistory = () => {
  const [referralHistoryCount, setReferralHistoryCount] = useState(null);

  useEffect(() => {
    const getReferralHistoryCount = async () => {
      const count = await fetchReferralHistoryCount(user.id);
      setReferralHistoryCount(count);
    };
    getReferralHistoryCount();
  }, []);

  return (
    <div className="referral-list">
        <Header pageTitle="Referral Bonus History"/>
      <div className="referral_code">
        <p>{`${window.location.origin}/?referral=${user.uuid}`}</p>
      </div>

      <div className="main_container">
        <div className="main_content">
          <div>
            {referralHistoryCount === null ? (
              <Spinner/>
            ) : referralHistoryCount <= 0 ? (
              <div
                className="no_data_content ff_NunitoSemiBold"
                style={{ minHeight: "calc(-260px + 100vh)" }}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/assets/images/img_nodata.png`}
                  alt="No Data"
                  className="img_no_data"
                />
                <div>No Data</div>
              </div>
            ) : (
              <div className="table-tab-container">
                <div className="table-tab-content">
                  <table className="wp-list-table widefat referral_history_table">
                    {/* Populate table with referral history data */}
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralBonusHistory;
