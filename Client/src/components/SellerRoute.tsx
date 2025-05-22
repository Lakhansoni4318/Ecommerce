import { Navigate } from "react-router-dom";

import { ReactNode } from "react";

const SellerRoute = ({ children }: { children: ReactNode }) => {
  const token = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  if (!token || !user || user.accountType !== "Seller") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default SellerRoute;
