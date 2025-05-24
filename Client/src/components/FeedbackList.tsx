import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyFeedback from "./EmptyFeedback";
import { FaStar, FaUserCircle, FaSearch } from "react-icons/fa";
import api from "../../api/apiService";

type Feedback = {
  _id: string;
  title: string;
  description: string;
  rating: number;
  productId: string;
  userId?: {
    username?: string;
    email?: string;
  };
};

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<Feedback[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await api.getAllReviews();
        setFeedbacks(response.data.reviews || []);
        setFilteredFeedbacks(response.data.reviews || []);
      } catch (error) {
        console.error(error);
        setFeedbacks([]);
        setFilteredFeedbacks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredFeedbacks(feedbacks);
    } else {
      const filtered = feedbacks.filter(
        ({ title, description, userId }) =>
          title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          userId?.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFeedbacks(filtered);
    }
  }, [searchTerm, feedbacks]);

  if (loading) return <p className="text-center text-gray-500">Loading reviews...</p>;
  if (filteredFeedbacks.length === 0) return <EmptyFeedback />;

  return (
    <div className="p-6 w-full">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Customer Feedback</h2>
        <p className="text-gray-600 mb-6">
          View and respond to product reviews from your customers.
        </p>

        <div className="relative mb-8 w-full max-w-lg">
          <input
            type="text"
            className="w-full border border-gray-300 rounded-full py-3 pl-12 pr-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search Reviews"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-4 top-3.5 text-gray-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFeedbacks.map((feedback) => (
            <div
              key={feedback._id}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-md hover:shadow-lg transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <FaUserCircle className="text-3xl text-blue-500" />
                  <div>
                    <p className="font-semibold text-lg">{feedback.userId?.username || "Anonymous"}</p>
                    <p className="text-sm text-gray-500">{feedback.userId?.email || ""}</p>
                  </div>
                </div>

                <div className="flex items-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-sm mr-1 ${
                        i < feedback.rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600 text-sm">{feedback.rating}/5</span>
                </div>

                <h3 className="font-semibold text-lg text-gray-800 mb-1">{feedback.title}</h3>
                <p className="text-gray-700 text-sm mb-4">{feedback.description}</p>
              </div>

              <button
                onClick={() => navigate(`/product/${feedback.productId}`)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition text-sm self-start"
              >
                View Product
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackList;
