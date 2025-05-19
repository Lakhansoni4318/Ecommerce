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

const App = () => {
  return (
    <Router>
      <div className="min-h-screen">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
        />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/watchlist"
            element={<Watchlist watchlistItems={[]} />}
          />
          <Route path="/cart" element={<Cart cartItems={[]} />} />
          <Route path="/SellerDashboard" element={<SellerDashboard />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/productList" element={<ProductListPage />} />
          <Route path="/category/:categoryName" element={<ProductListPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/payment/:id" element={<BookProductPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <MoreBenefits />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
