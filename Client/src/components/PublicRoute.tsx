import { Navigate } from "react-router-dom";

import React from "react";

const PublicRoute: React.FC<React.PropsWithChildren> = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
