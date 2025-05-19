import { FaStar, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api/apiService";

interface ProductCardProps {
  discount?: number;
  imageUrl: string[];
  productCategory: string;
  stock: string;
  productName: string;
  rating: number;
  quantity: number;
  sellingPrice: number;
  costPrice?: number;
  _id: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  discount,
  imageUrl,
  productCategory,
  stock,
  productName,
  rating,
  quantity,
  sellingPrice,
  costPrice,
  _id,
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${_id}`);
  };

  const addToCart = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const request = { productId: id };
      const response = await api.addToCart(request);
      console.log(response);
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  const fallbackImage = "/no-image.png"; // optional fallback if array is empty

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-2xl shadow-md p-4 flex flex-col hover:shadow-xl transition-all cursor-pointer"
    >
      <div className="relative">
        {discount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {discount}% OFF
          </span>
        )}
        <img
          src={imageUrl || fallbackImage}
          alt={productName}
          className="w-full h-48 object-contain rounded-lg bg-white"
        />
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
        <span>{productCategory}</span>
        <span
          className={stock === "In Stock" ? "text-green-500" : "text-red-500"}
        >
          {stock}
        </span>
      </div>

      <h3 className="mt-2 text-lg font-semibold text-gray-800">
        {productName}
      </h3>

      <div className="flex items-center gap-2 text-yellow-400 mt-2">
        {rating && (
          <>
            {Array.from({ length: 5 }, (_, index) => (
              <FaStar
                key={index}
                className={index < rating ? "" : "text-gray-300"}
              />
            ))}
            <span className="text-sm text-gray-500 ml-2">
              ({quantity} sold)
            </span>
          </>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div>
          <span className="text-lg font-bold text-blue-600">
            ₹{sellingPrice}
          </span>
          {costPrice && (
            <span className="ml-2 text-sm text-gray-400 line-through">
              ₹{costPrice}
            </span>
          )}
        </div>

        <button
          onClick={(e) => addToCart(_id, e)}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-all"
        >
          <FaShoppingCart />
          Add
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
