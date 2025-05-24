import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import useAuthCheck from "./hooks/useAuthCheck";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Pages/Home";
import Wishlist from "./Pages/Wishlist";
import Cart from "./components/Cart";
import SellerDashboard from "./Pages/SellerDashboard";
import AuthPage from "./Pages/AuthPage";
import Footer from "./components/Footer";
import MoreBenefits from "./components/MoreBenefits";
import ProductDetailsPage from "./Pages/ProductDetails";
import ProductListPage from "./Pages/ProductListPage";
import BookProductPage from "./Pages/BookProductPage";
import PrivateRoute from "./components/PrivateRoute";
import SellerRoute from "./components/SellerRoute";
import OrderPage from "./Pages/OrderPage";
import ProfilePage from "./Pages/ProfilePage";

const AppRoutesWithAuthCheck = () => {
  const location = useLocation();
  const isPublicRoute = location.pathname === "/auth";

  const loading = useAuthCheck();

  if (!isPublicRoute && loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="/Wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
        <Route path="/cart" element={<PrivateRoute><Cart /></PrivateRoute>} />
        <Route path="/order" element={<PrivateRoute><OrderPage /></PrivateRoute>} />
        <Route path="/SellerDashboard" element={<SellerRoute><SellerDashboard /></SellerRoute>} />
        <Route path="/product/:id" element={<PrivateRoute><ProductDetailsPage /></PrivateRoute>} />
        <Route path="/productList" element={<PrivateRoute><ProductListPage /></PrivateRoute>} />
        <Route path="/category/:categoryName" element={<PrivateRoute><ProductListPage /></PrivateRoute>} />
        <Route path="/payment" element={<PrivateRoute><BookProductPage /></PrivateRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <MoreBenefits />
      <Footer />
    </div>
  );
};

export default AppRoutesWithAuthCheck;
