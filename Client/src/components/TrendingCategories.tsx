import { useEffect, useState } from "react";
import { FaTv, FaTshirt, FaBook, FaHome, FaHeartbeat, FaPuzzlePiece } from "react-icons/fa";
import { Link } from "react-router-dom";
import api from "../../api/apiService";

const iconMap:any = {
  Electronics: <FaTv className="text-4xl text-rose-600 mb-4" />,
  Fashion: <FaTshirt className="text-4xl text-rose-600 mb-4" />,
  Books: <FaBook className="text-4xl text-rose-600 mb-4" />,
  Home: <FaHome className="text-4xl text-rose-600 mb-4" />,
  Beauty: <FaHeartbeat className="text-4xl text-rose-600 mb-4" />,
  "Toys & Games": <FaPuzzlePiece className="text-4xl text-rose-600 mb-4" />,
};

type Category = {
  name: string;
  count: number;
};

const TrendingCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategoryStats = async () => {
      try {
        const response = await api.getCategoryStats();
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Error fetching category stats:", error);
      }
    };

    fetchCategoryStats();
  }, []);

  return (
    <div className="w-full bg-rose-50 py-12 px-6 my-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between mb-10 px-4">
        <div>
          <h2 className="text-4xl font-bold text-rose-600">Trending Categories</h2>
          <p className="text-lg text-gray-700 mt-2">Explore our most popular shopping categories</p>
        </div>
        <div className="mt-4 md:mt-0">
          <a href="/categories" className="text-rose-600 font-semibold hover:text-rose-800 transition-all">
            View All Categories
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
        {categories.map((category) => (
          <Link
            to={`/category/${encodeURIComponent(category.name)}`}
            key={category.name}
            className="bg-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center hover:bg-rose-100 transition-all cursor-pointer"
          >
            {iconMap[category.name] || (
              <FaPuzzlePiece className="text-4xl text-rose-600 mb-4" />
            )}
            <h3 className="text-lg font-semibold text-gray-800">{category.name}</h3>
            <p className="text-gray-500 mt-2">{category.count} Products</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrendingCategories;
