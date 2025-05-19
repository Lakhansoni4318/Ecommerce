import { FaHeart, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface WatchlistItem {
  id: string;
  name: string;
  category: string;
}

interface WatchlistProps {
  watchlistItems: WatchlistItem[];
}

const Watchlist = ({ watchlistItems }: WatchlistProps) => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto p-4 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Your Watchlist</h2>

      {watchlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-center text-gray-500">
          <FaHeart className="text-6xl mb-6 text-pink-400 animate-pulse" />
          <p className="text-2xl font-bold mb-2">Your watchlist is empty!</p>
          <p className="text-sm mb-6">Save products you love for easy access later.</p>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 transition-all text-white px-5 py-3 rounded-md font-semibold shadow-lg"
          >
            <FaPlus /> Explore Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {/* Your existing watchlist items */}
          {watchlistItems.map((item) => (
            <div key={item.id} className="border p-4 rounded-md shadow hover:shadow-lg transition">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p>Category: {item.category}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
