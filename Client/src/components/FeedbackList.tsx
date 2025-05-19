import EmptyFeedback from "./EmptyFeedback";

const FeedbackList = () => {
  const feedbacks = []; 

  if (feedbacks.length === 0) return <EmptyFeedback />;

  return (
    <>
      <h2 className="text-3xl font-bold mb-2">Customer Feedback</h2>
      <p className="text-gray-600 mb-6">View and respond to product reviews from your customers.</p>
      <input className="border p-2 mb-4 w-full" placeholder="Search Reviews" />
      <div>
        {/* Map Feedback */}
      </div>
    </>
  );
};

export default FeedbackList;
