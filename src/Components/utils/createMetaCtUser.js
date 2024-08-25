import axios from "axios";
import API_BASE_URL from "../../api/getApiURL";

export const createMetaCtUser = async (
  wallet,
  referral = "",
  setUser,
  setLoading
) => {
  try {
    let user;
    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/users/wallet/${wallet}`
      );
      user = response.data;
    } catch (error) {
      if (error.response && error.response.data.error === "User not found") {
        // If user not found, proceed to create a new user
        console.log("User not found, creating a new one.");
      } else {
        // If there's another error, throw it
        throw error;
      }
    }

    if (user && user.uuid) {
      setUser(user);
      console.log("User retrieved successfully");
    } else {
      // Create a new user since it wasn't found
      const newUserResponse = await axios.post(`${API_BASE_URL}/users/create`, {
        user_wallet: wallet,
        referral_uuid: referral,
      });

      if (newUserResponse.data && newUserResponse.data.uuid) {
        setUser(newUserResponse.data);
        console.log("New user registered successfully");
      } else {
        setLoading(false);
        throw new Error("User creation failed");
      }
    }
  } catch (error) {
    console.error("Error in createMetaCtUser:", error);
    setLoading(false);
    throw error;
  } finally {
    setLoading(false);
  }
};
