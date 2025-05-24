import { useEffect, useState } from "react";
import {
  FaShoppingCart,
  FaPlus,
  FaMinus,
  FaTrashAlt,
  FaCheckCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import api from "../../api/apiService";

interface Product {
  _id: string;
  productName: string;
  sellingPrice: number;
  costPrice: number;
  imageUrls: string[];
  ratingAverage: number;
  ratingCount: number;
  stock: number;
}

interface CartItem {
  _id: string;
  productId: Product;
  quantity: number;
}

const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false); // tracks if cart was modified locally

  const fetchCart = async () => {
    try {
      const res = await api.getCart();
      setCartItems(res.data.cart?.products || []);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const ProceedToCheckout = async () => {
    const payload = cartItems.map((item) => ({
      productId: item.productId._id,
      quantity: item.quantity,
    }));
    localStorage.setItem("cart", JSON.stringify(payload));
    navigate("/payment");
  };

  const increment = (item: CartItem) => {
    if (item.quantity < item.productId.stock) {
      setCartItems((prev) =>
        prev.map((ci) =>
          ci._id === item._id ? { ...ci, quantity: ci.quantity + 1 } : ci
        )
      );
      setIsDirty(true);
    }
  };

  const decrement = (item: CartItem) => {
    if (item.quantity > 1) {
      setCartItems((prev) =>
        prev.map((ci) =>
          ci._id === item._id ? { ...ci, quantity: ci.quantity - 1 } : ci
        )
      );
      setIsDirty(true);
    }
  };

  const removeItem = async (item: CartItem) => {
    try {
      for (let i = 0; i < item.quantity; i++) {
        await api.removeFromCart(item.productId._id);
      }
      fetchCart();
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  };

  const buyNow = async (id:string, quantity:number) => {
    const payload = [{ productId: id, quantity }];
    localStorage.setItem("cart", JSON.stringify(payload));
    navigate("/payment");
  };
  const updateCartToServer = async () => {
    try {
      const payload = cartItems.map((item) => ({
        productId: item.productId._id,
        quantity: item.quantity,
      }));
      await api.updateCart(payload);
      setIsDirty(false);
      alert("Cart updated successfully!");
    } catch (error) {
      console.error("Failed to update cart:", error);
      alert("Something went wrong while updating cart.");
    }
  };

  const calculateTotal = () =>
    cartItems.reduce(
      (acc, item) => acc + item.productId.sellingPrice * item.quantity,
      0
    );

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500 text-xl">
        Loading cart...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🛒 Your Cart</h2>

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-center text-gray-500">
          <FaShoppingCart className="text-6xl mb-6 text-blue-400 animate-bounce" />
          <p className="text-2xl font-bold mb-2">Your cart is empty!</p>
          <p className="text-sm mb-6">
            Start adding amazing products to your cart now.
          </p>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all text-white px-5 py-3 rounded-md font-semibold shadow-lg"
          >
            <FaPlus /> Add Products
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="border rounded-xl shadow-lg hover:shadow-xl transition bg-white p-4 flex flex-col justify-between"
              >
                <img
                  src={item.productId.imageUrls[0]}
                  alt={item.productId.productName}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {item.productId.productName}
                  </h3>
                  <div className="text-sm text-yellow-600">
                    ⭐ {item.productId.ratingAverage} (
                    {item.productId.ratingCount})
                  </div>
                  <div className="text-gray-700">
                    <span className="font-semibold">Price:</span> ₹
                    {item.productId.sellingPrice}
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-gray-200 p-2 rounded hover:bg-gray-300 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                        onClick={() => decrement(item)}
                      >
                        <FaMinus />
                      </button>
                      <span className="text-md font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        className="bg-gray-200 p-2 rounded hover:bg-gray-300 disabled:opacity-50"
                        disabled={item.quantity >= item.productId.stock}
                        onClick={() => increment(item)}
                      >
                        <FaPlus />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item)}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Remove from cart"
                    >
                      <FaTrashAlt size={18} />
                    </button>
                  </div>
                  <div className="mt-2 font-bold text-blue-600">
                    Subtotal: ₹
                    {(
                      item.quantity * item.productId.sellingPrice
                    ).toLocaleString()}
                  </div>
                  <button
                    onClick={() => buyNow(item._id, item.quantity)}
                    className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow transition"
                  >
                    <FaCheckCircle />
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-bold text-gray-800">
              Grand Total: ₹{calculateTotal().toLocaleString()}
            </div>
            <div className="flex gap-4">
              {isDirty && (
                <button
                  onClick={updateCartToServer}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white text-lg font-semibold px-6 py-3 rounded-lg shadow-md transition"
                >
                  Update Cart
                </button>
              )}
              <button
                onClick={ProceedToCheckout}
                className="bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold px-6 py-3 rounded-lg shadow-md transition"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
