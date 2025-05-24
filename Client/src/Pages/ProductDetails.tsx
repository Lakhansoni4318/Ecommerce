import { useEffect, useState } from "react";
import {
  FaStar,
  FaRegStar,
  FaHeart,
  FaChevronLeft,
  FaCartPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaCommentDots,
  FaUserCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/apiService";

interface Review {
  rating: number;
  title: string;
  description: string;
  createdAt: string;
  username?: string;
}

interface Product {
  _id: string;
  productName: string;
  productCategory: string;
  description: string;
  imageUrls: string[];
  sellingPrice: number;
  stock: number;
  inCart: boolean;
  inWatchlist: boolean;
  averageRating: number;
  totalReviews: number;
  reviews?: Review[];
}

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const navigate = useNavigate();

  // Review form state
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewDescription, setReviewDescription] = useState("");

  const buyNow = async (id: string, quantity: number) => {
    const payload = [{ productId: id, quantity }];
    localStorage.setItem("cart", JSON.stringify(payload));
    navigate("/payment");
  };

  const addToWatchlist = async () => {
    if (!product) return;
    setWatchlistLoading(true);
    try {
      await api.addWatchList({ productId: product._id });
      setInWatchlist(true);
      toast.success("Added to Wishlist ❤️");
    } catch (error) {
      console.error("Failed to add to Wishlist:", error);
      toast.error("Failed to add to Wishlist");
    } finally {
      setWatchlistLoading(false);
    }
  };

  const removeFromWatchlist = async () => {
    if (!id) return;
    setWatchlistLoading(true);
    try {
      await api.removeFromWatchList(id);
      setInWatchlist(false);
      toast.info("Removed from Wishlist");
    } catch (error) {
      console.error("Failed to remove from Wishlist:", error);
      toast.error("Failed to remove from Wishlist");
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleCartToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product) return;
    setCartLoading(true);
    try {
      if (!inCart) {
        await api.addToCart({
          productId: product._id,
          quantity,
        });
        setInCart(true);
        toast.success(
          <>
            <FaCheckCircle className="inline mr-1 text-green-500" />
            Added to Cart
          </>
        );
      } else {
        await api.removeFromCart(product._id);
        setInCart(false);
        toast.info(
          <>
            <FaTimesCircle className="inline mr-1 text-blue-500" />
            Removed from Cart
          </>
        );
      }
    } catch (error) {
      console.error("Cart action failed:", error);
      toast.error("Cart update failed");
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const response = await api.productDetails(id);
        const productData: Product = response.data;
        setProduct(productData);
        setMainImage(productData.imageUrls?.[0] || "");
        setInCart(productData.inCart);
        setInWatchlist(productData.inWatchlist);
        setQuantity(1);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product");
      }
    };
    fetchProduct();
  }, [id]);

  if (!product) return <div className="p-6 text-center">Loading...</div>;

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => {
      const newQty = prev + amount;
      if (newQty < 1) return 1;
      if (newQty > product.stock) return product.stock;
      return newQty;
    });
  };

  const handleReviewSubmit = async () => {
    if (!product) return;

    if (!reviewRating || !reviewTitle || !reviewDescription) {
      toast.error("Please fill in all review fields.");
      return;
    }

    try {
      const reviewPayload = {
        productId: product._id,
        rating: reviewRating,
        title: reviewTitle,
        description: reviewDescription,
      };

      await api.addReview(reviewPayload);
      toast.success("✅ Review submitted successfully!");
      setReviewRating(0);
      setReviewTitle("");
      setReviewDescription("");
      setShowReviewForm(false);
    } catch (error) {
      console.error("Review submission failed:", error);
      toast.error("❌ Failed to submit review. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center text-gray-600 text-sm mb-6">
        <FaChevronLeft className="mr-2" />
        <span
          className="mr-2 cursor-pointer"
          onClick={() => window.history.back()}
        >
          Back
        </span>
        <span className="mx-2">{product.productCategory}</span>
        <span className="text-gray-400">&gt;</span>
        <span className="ml-2 text-black">{product.productName}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left - Images */}
        <div>
          <img
            src={mainImage}
            alt={product.productName}
            className="w-full max-h-96 object-contain rounded-xl mb-4 bg-white"
          />
          <div className="flex space-x-3 overflow-x-auto">
            {product.imageUrls.map((imgUrl, index) => (
              <img
                key={index}
                src={imgUrl}
                alt={`Thumbnail ${index}`}
                className={`w-20 h-20 object-cover rounded-lg cursor-pointer border-2 ${
                  mainImage === imgUrl
                    ? "border-blue-600"
                    : "border-transparent"
                } hover:border-blue-500`}
                onClick={() => setMainImage(imgUrl)}
              />
            ))}
          </div>
        </div>

        {/* Right - Info */}
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-3">{product.productName}</h1>

            <div className="flex items-center mb-2">
              {[...Array(4)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 mr-1" />
              ))}
              <FaRegStar className="text-yellow-400 mr-2" />
              <span className="text-sm text-gray-600">(50 reviews)</span>
            </div>

            <p className="text-2xl font-semibold text-green-600 mb-1">
              ₹{product.sellingPrice}
            </p>
            <p
              className={`text-sm mb-4 ${
                product.stock > 0 ? "text-green-700" : "text-red-600"
              }`}
            >
              {product.stock > 0
                ? `In stock (${product.stock} available)`
                : "Out of stock"}
            </p>

            <p className="text-gray-700 mb-4 whitespace-pre-line">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center mb-6 gap-3">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg overflow-hidden bg-white shadow">
                <button
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-5 py-1 text-sm">{quantity}</span>
                <button
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock || product.stock === 0}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-3 mt-4">
            {product.stock > 0 && (
              <button
                className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl shadow-md transition-all duration-200 w-full md:w-auto"
                onClick={() => buyNow(product._id, quantity)}
              >
                <FaCheckCircle />
                Buy Now
              </button>
            )}

            <button
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md w-full md:w-auto ${
                inCart
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
              onClick={handleCartToggle}
              disabled={cartLoading}
            >
              {inCart ? "Remove from Cart" : "Add to Cart"}
              <FaCartPlus />
            </button>

            {/* Wishlist (Heart) */}
            <button
              className={`flex items-center justify-center w-12 h-12 rounded-full transition duration-200 shadow-md ${
                inWatchlist
                  ? "bg-red-100 hover:bg-red-200"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
              onClick={inWatchlist ? removeFromWatchlist : addToWatchlist}
              disabled={watchlistLoading}
              title={inWatchlist ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              {watchlistLoading ? (
                <span className="text-gray-400 text-sm">...</span>
              ) : (
                <FaHeart
                  className={`text-xl ${
                    inWatchlist ? "text-red-600" : "text-gray-500"
                  }`}
                />
              )}
            </button>
          </div>

          {/* Shipping Info */}
          <div className="mt-6 text-sm text-gray-600">
            <h3 className="font-semibold mb-1">Shipping & Returns</h3>
            <p>
              Free shipping on orders over ₹2000. Delivery in 3–5 business days.
            </p>
            <p className="mt-1">
              30-day return policy on unused items in original packaging.
            </p>
          </div>
        </div>
      </div>

      <hr className="my-10" />

      {/* Reviews Section */}
      {/* Reviews Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold flex items-center gap-2 mb-3">
          <FaCommentDots /> Customer Reviews
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Share your thoughts. If you've used this product, write a quick
          review!
        </p>

        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="mb-6 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          {showReviewForm ? "Cancel Review" : "Write a Review"}
        </button>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Review Form (Left) */}
          {showReviewForm && (
            <div className="md:w-1/2 w-full bg-gray-100 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-3">Write a Review</h4>
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => {
                  const starIndex = i + 1;
                  return (
                    <span key={i} onClick={() => setReviewRating(starIndex)}>
                      {reviewRating >= starIndex ? (
                        <FaStar className="text-yellow-400 text-xl cursor-pointer" />
                      ) : (
                        <FaRegStar className="text-yellow-400 text-xl cursor-pointer" />
                      )}
                    </span>
                  );
                })}
              </div>
              <input
                type="text"
                placeholder="Review Title"
                className="w-full mb-3 p-2 rounded border"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
              />
              <textarea
                rows={4}
                placeholder="Write your review here..."
                className="w-full mb-4 p-2 rounded border"
                value={reviewDescription}
                onChange={(e) => setReviewDescription(e.target.value)}
              />
              <button
                onClick={handleReviewSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Submit Review
              </button>
            </div>
          )}

          {/* Reviews List (Right) */}
          <div className={`md:w-1/2 w-full ${!showReviewForm ? "w-full" : ""}`}>
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-6">
                {product.reviews.map((review, index) => (
                  <div
                    key={index}
                    className="p-5 bg-white border rounded-md shadow-sm"
                  >
                    <div className="flex items-center mb-2 gap-2 text-yellow-400">
                      {[...Array(5)].map((_, i) =>
                        i < review.rating ? (
                          <FaStar key={i} />
                        ) : (
                          <FaRegStar key={i} />
                        )
                      )}
                      <span className="text-xs text-gray-500 ml-auto">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold mb-1">
                      {review.title}
                    </h4>
                    <p className="text-gray-700 text-sm">
                      {review.description}
                    </p>
                    <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
                      <FaUserCircle />
                      {review.username || "Anonymous"}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 bg-gray-50 p-6 rounded-lg mt-4">
                <p className="text-lg font-medium">No reviews yet!</p>
                <p className="text-sm">
                  Be the first to share your experience 📝
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
