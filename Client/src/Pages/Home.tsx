import { useEffect } from "react";
import BigCard from "../components/BigCard";
import FeaturedProducts from "../components/FeaturedProducts";
import TrendingCategories from "../components/TrendingCategories";
import WhyShopWithUs from "../components/WhyShopWithUs";
import api from "../../api/apiService";

const Home = () => {
  const getUserData = async () => {
    try {
      debugger
      const response = await api.profile();
      console.log("User profile:", response.data);
      
      // Store the entire user object in localStorage as a JSON string
      const userData = {
        username: response.data.user.username,
        email: response.data.user.email,
        accountType: response.data.user.accountType
      };
      localStorage.setItem("user", JSON.stringify(userData)); // Store as a string

    } catch (err) {
      console.error("Failed to fetch user data:", err);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <div className="min-h-screen">
      <BigCard />
      <TrendingCategories />
      <FeaturedProducts />
      <WhyShopWithUs />
    </div>
  );
};

export default Home;
