import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Pages/Home";
import Watchlist from "./components/Watchlist";
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

const App = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <ToastContainer position="top-right" autoClose={3000} />
        <Navbar />
        <Routes>
          <Route path="/auth" element={<AuthPage />} />

          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/watchlist"
            element={
              <PrivateRoute>
                <Watchlist watchlistItems={[]} />
              </PrivateRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart cartItems={[]} />
              </PrivateRoute>
            }
          />
          <Route
            path="/SellerDashboard"
            element={
              <SellerRoute>
                <SellerDashboard />
              </SellerRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <PrivateRoute>
                <ProductDetailsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/productList"
            element={
              <PrivateRoute>
                <ProductListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/category/:categoryName"
            element={
              <PrivateRoute>
                <ProductListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <PrivateRoute>
                <BookProductPage />
              </PrivateRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <MoreBenefits />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
