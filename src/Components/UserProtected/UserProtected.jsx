import React from 'react';
import { useUser } from '../../context/UserContext';
import { Navigate } from 'react-router';

const UserProtected = ({ children }) => {
    const { adminUser } = useUser();
    if (!adminUser) {
      return <Navigate to="/admin-login" replace />;
    }
  
    return children;
  };

export default UserProtected;
