import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaTrashAlt } from "react-icons/fa";
import api from "../../api/apiService";

type Product = {
  _id: string;
  productName: string;
  description: string;
  imageUrls: string[];
  sellingPrice: number;
  costPrice: number;
};

type WatchlistProduct = {
  _id: string;
  addedAt: string;
  productId: Product;
};

const Wishlist = () => {
  // State stores products from Wishlist.products but we map them to productId for display
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await api.getWatchList();
        // response.data.Wishlist.products is an array of WatchlistProduct
        // Extract productId from each to get Product info
        const products: Product[] = response.data.Wishlist.products.map(
          (item: WatchlistProduct) => item.productId
        );
        setWishlist(products);
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);

  const removeFromWishlist = async (productId: string) => {
    try {
      await api.removeFromWatchList(productId);
      setWishlist((prev) => prev.filter((p) => p._id !== productId));
    } catch (error) {
      console.error("Failed to remove product from wishlist:", error);
    }
  };

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-rose-50 px-4">
        <FaHeart className="text-8xl text-rose-400 mb-8 animate-pulse" />
        <h2 className="text-4xl font-extrabold text-rose-600 mb-4">Your wishlist is empty</h2>
        <p className="text-gray-700 mb-8 max-w-md text-center text-lg">
          Looks like you haven't added any products to your wishlist yet.
          Start exploring and add your favorites!
        </p>
        <button
          onClick={() => navigate("/categories")}
          className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-transform transform hover:scale-105"
        >
          Browse Categories
        </button>
      </div>
    );
  }

  return (
    <div className="bg-rose-50 min-h-screen py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-extrabold text-rose-600 mb-14 text-center tracking-wide">
          Your Wishlist
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-400 cursor-pointer flex flex-col"
              onClick={() => navigate(`/product/${encodeURIComponent(product._id)}`)}
            >
              <div className="w-full aspect-[3/4] bg-gray-100 overflow-hidden relative group">
                <img
                  src={product.imageUrls[0]}
                  alt={product.productName}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <FaHeart className="absolute top-5 right-5 text-rose-600 text-4xl drop-shadow-md" />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-semibold text-gray-900 line-clamp-2 mb-3">
                  {product.productName}
                </h2>
                <p className="text-gray-600 text-sm line-clamp-3 flex-grow mb-5">{product.description}</p>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-rose-600 font-bold text-2xl">
                      ₹{product.sellingPrice.toLocaleString()}
                    </span>
                    <span className="text-sm line-through text-gray-400 ml-3">
                      ₹{product.costPrice.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent triggering parent onClick
                      removeFromWishlist(product._id);
                    }}
                    className="text-rose-600 hover:text-rose-800 p-3 rounded-full transition"
                    aria-label="Remove from wishlist"
                  >
                    <FaTrashAlt className="text-2xl" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
