import React, { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [adminUser, setAdminUser] = useState(() => {
    const savedAdminUser = localStorage.getItem("adminUser");
    return savedAdminUser ? JSON.parse(savedAdminUser) : null;
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem("adminUser", JSON.stringify(adminUser));
  }, [adminUser]);

  const logout = () => {
    setUser(null);
    setAdminUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("adminUser");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        adminUser,
        setAdminUser,
        loading,
        setLoading,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
