import { FaStar, FaShoppingCart, FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../api/apiService";
import { toast } from "react-toastify";

interface ProductCardProps {
  discount?: number;
  imageUrls: string[];
  productCategory: string;
  stock: number | string; // your api returns 96 as number
  productName: string;
  rating?: number; // rating was number in your original props
  quantity?: number;
  sellingPrice: number;
  costPrice?: number;
  _id: any; // your api _id is string, not number
  inCart?: boolean;
  inWatchlist: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  discount,
  imageUrls,
  productCategory,
  stock,
  productName,
  rating = 0,
  quantity = 0,
  sellingPrice,
  costPrice,
  _id,
  inCart = false,
  inWatchlist,
}) => {
  const navigate = useNavigate();

  // Local states for immediate UI feedback
  const [isInCart, setIsInCart] = useState(inCart);
  const [isInWatchlist, setIsInWatchlist] = useState(inWatchlist);

  const handleCardClick = () => {
    navigate(`/product/${_id}`);
  };

  const addToCart = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (!isInCart) {
        await api.addToCart({ productId: id, quantity: 1 });
        setIsInCart(true);
        toast.success("Added to cart!");
      } else {
        await api.removeFromCart(id);
        setIsInCart(false);
        toast.success("Removed from cart!");
      }
    } catch (error) {
      console.error("Cart action failed:", error);
      toast.error("Failed to update cart");
    }
  };

  const toggleWatchlist = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (!isInWatchlist) {
        await api.addWatchList({ productId: id });
        setIsInWatchlist(true);
        toast.success("Added to watchlist!");
      } else {
        await api.removeFromWatchList(id);
        setIsInWatchlist(false);
        toast.success("Removed from watchlist!");
      }
    } catch (error) {
      console.error("Watchlist action failed:", error);
      toast.error("Failed to update watchlist");
    }
  };

  const fallbackImage = "/no-image.png";

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl transition-all cursor-pointer relative"
    >
      <div className="relative">
        {discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {discount}% OFF
          </span>
        )}
        <img
          src={imageUrls[0] || fallbackImage}
          alt={productName}
          className="w-full h-48 object-contain rounded-lg bg-white"
        />

        {/* Watchlist toggle button */}
        <button
          onClick={(e) => toggleWatchlist(_id, e)}
          className="absolute top-2 right-2 text-red-500 text-xl p-1 bg-white rounded-full shadow hover:scale-110 transition-transform"
          aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
          title={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
        >
          {isInWatchlist ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <span>{productCategory}</span>
        <span className={Number(stock) > 0 ? "text-green-500" : "text-red-500"}>
          {Number(stock) > 0 ? "In Stock" : "Out of Stock"}
        </span>
      </div>

      <h3 className="mt-2 text-lg font-semibold text-gray-800">{productName}</h3>

      <div className="flex items-center gap-2 text-yellow-400 mt-2">
        {rating > 0 && (
          <>
            {Array.from({ length: 5 }, (_, index) => (
              <FaStar
                key={index}
                className={index < rating ? "" : "text-gray-300"}
              />
            ))}
            <span className="text-sm text-gray-500 ml-2">({quantity} sold)</span>
          </>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-blue-600">₹{sellingPrice}</span>
          {costPrice && (
            <span className="ml-2 text-sm text-gray-400 line-through">₹{costPrice}</span>
          )}
        </div>

        <button
          onClick={(e) => addToCart(_id, e)}
          disabled={Number(stock) <= 0}
          className={`flex items-center gap-2 ${
            Number(stock) > 0
              ? "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          } text-sm font-semibold px-3 py-2 rounded-lg transition-all`}
          aria-label={isInCart ? "Remove from cart" : "Add to cart"}
          title={isInCart ? "Remove from cart" : "Add to cart"}
        >
          <FaShoppingCart />
          {isInCart ? "Remove" : "Add"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
