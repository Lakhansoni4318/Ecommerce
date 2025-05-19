import { useEffect, useState } from "react";
import {
  FaHeart,
  FaChevronLeft,
  FaCartPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaCommentSlash,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/apiService";
import RatingStars from "./RatingStars"; // import the new component

const ProductDetailsPage = () => {
  // ... other states
  const [reviews, setReviews] = useState<Array<{
    name: string;
    date: string;
    rating: number;
    title: string;
    description: string;
  }>>([]);

  // Review form controlled inputs
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewDescription, setReviewDescription] = useState("");

  useEffect(() => {
    // Fetch product and reviews (replace dummy with real API)
    const fetchProductAndReviews = async () => {
      try {
        const response = await api.productDetails(id);
        const productData = response.data;
        setProduct(productData);
        setMainImage(productData.imageUrls?.[0] || "");
        setInCart(productData.inCart);
        setInWatchlist(productData.inWatchlist);
        setReviews(productData.reviews || []); // assuming API returns reviews array
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product");
      }
    };
    if (id) fetchProductAndReviews();
  }, [id]);

  const handleSubmitReview = () => {
    if (reviewRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!reviewTitle.trim()) {
      toast.error("Please enter a review title");
      return;
    }
    if (!reviewDescription.trim()) {
      toast.error("Please enter your review");
      return;
    }

    // Submit review to API here
    // For now, just show success toast and reset
    toast.success("Review submitted!");
    setShowReviewForm(false);
    setReviewRating(0);
    setReviewTitle("");
    setReviewDescription("");
  };

  if (!product) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Breadcrumb, Images, Info omitted for brevity */}

      {/* Remove dummy static stars here */}
      {/* Optionally show average rating */}
      <div className="flex items-center mb-2">
        <RatingStars rating={product.averageRating ?? 0} />
        <span className="text-sm text-gray-600 ml-2">
          {product.averageRating
            ? `(${product.reviews?.length || 0} reviews)`
            : "(No reviews yet)"}
        </span>
      </div>

      {/* Reviews Section */}
      <hr className="my-10" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>

          {reviews.length === 0 ? (
            <div className="flex flex-col items-center text-gray-400 space-y-2">
              <FaCommentSlash size={50} />
              <p className="text-lg">No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <>
              <div className="flex items-center text-lg mb-4">
                <span className="font-bold mr-2">
                  {product.averageRating?.toFixed(1) || "0.0"}
                </span>
                <RatingStars rating={product.averageRating ?? 0} />
              </div>
              <p className="text-sm text-gray-600 mb-6">
                Share your thoughts. If you've used this product, share your
                experience.
              </p>
            </>
          )}

          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900"
          >
            {showReviewForm ? "Cancel Review" : "Write a Review"}
          </button>

          {showReviewForm && (
            <div className="mt-6 p-6 border rounded-lg bg-gray-50 shadow">
              <div className="mb-3 font-medium">Your Rating:</div>
              <RatingStars
                rating={reviewRating}
                onRate={setReviewRating}
                editable
                size={30}
              />

              <input
                type="text"
                placeholder="Review title"
                className="w-full p-2 border rounded mb-4 mt-4"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
              />
              <textarea
                placeholder="Write your review..."
                className="w-full p-2 border rounded mb-4"
                rows={4}
                value={reviewDescription}
                onChange={(e) => setReviewDescription(e.target.value)}
              ></textarea>
              <button
                onClick={handleSubmitReview}
                className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
              >
                Submit Review
              </button>
            </div>
          )}
        </div>

        {/* Review List */}
        <div className="md:col-span-2 space-y-6">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg bg-white shadow-sm"
            >
              <div className="flex justify-between mb-1">
                <div className="font-semibold">{review.name}</div>
                <div className="text-sm text-gray-500">{review.date}</div>
              </div>
              <RatingStars rating={review.rating} />
              <div className="font-bold mt-1 mb-1">{review.title}</div>
              <p className="text-gray-700 text-sm whitespace-pre-line">
                {review.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
