import { FaShoppingCart, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  id: number;
  name: string;
  sellingPrice: number;
  quantity: number;
}

const Cart = ({ cartItems }: { cartItems: CartItem[] }) => {
  const navigate = useNavigate();

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.sellingPrice * item.quantity, 0);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-center text-gray-500">
          <FaShoppingCart className="text-6xl mb-6 text-blue-400 animate-bounce" />
          <p className="text-2xl font-bold mb-2">Your cart is empty!</p>
          <p className="text-sm mb-6">Start adding amazing products to your cart now.</p>

          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all text-white px-5 py-3 rounded-md font-semibold shadow-lg"
          >
            <FaPlus /> Add Products
          </button>
        </div>
      ) : (
        <div>
          {/* Your existing cart items list here */}
          <div className="grid grid-cols-1 gap-4">
            {cartItems.map((item) => (
              <div key={item.id} className="border p-4 rounded-md shadow hover:shadow-lg transition">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ${item.sellingPrice}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 text-right text-xl font-bold">
            Total: ${calculateTotal().toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
