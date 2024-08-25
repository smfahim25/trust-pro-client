import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const AdminRoute = ({ children }) => {
  const { adminUser } = useUser();
  if (!adminUser) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

export default AdminRoute;
