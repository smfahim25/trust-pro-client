import React, { useState, useEffect } from 'react';
import Header from '../Header/Header';
import Spinner from '../Spinner/Spinner';
const user = {
  uuid: "sample-uuid-1234",
};

const fetchReferralsCount = async (uuid) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockReferralCount = 0; 
      resolve(mockReferralCount);
    }, 1000);
  });
};

const ReferralList = () => {
  const [referrals, setReferrals] = useState(null);

  useEffect(() => {
    const getReferralCount = async () => {
      const count = await fetchReferralsCount(user.uuid);
      setReferrals(count);
    };
    getReferralCount();
  }, []);

  return (
    <div className="referral-list">
        <Header pageTitle="Referral List"/>
      <div className="referral_code">
        <p>{`${window.location.origin}/?referral=${user.uuid}`}</p>
      </div>

      <div className="main_container">
        <div className="main_content">
          <div>
            {referrals === null ? (
              <Spinner/>
            ) : referrals <= 0 ? (
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
                  <table className="wp-list-table widefat referrals-table">
                    {/* Populate table with referral data */}
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

export default ReferralList;
