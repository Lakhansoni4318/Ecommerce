import { useEffect, useState } from "react";
import { CreditCard, Truck, Home, Phone } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import api from "../../api/apiService";

type CartItem = {
  productId: string;
  quantity: number;
};

type Review = {
  title: string;
  description: string;
  rating: number;
  createdAt: string;
};

type Product = {
  _id: string;
  productName: string;
  sellingPrice: number;
  description: string;
  imageUrls?: string[];
  quantity: number; // updated from cart
  reviews?: Review[];
};

const BookProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentType, setPaymentType] = useState("credit");
  const storedUser = localStorage.getItem("user");
  const user: any = storedUser ? JSON.parse(storedUser) : null;
  const userEmail = user?.email || null;


  const [form, setForm] = useState({
    address: "",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
    phone: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      const parsedCart: CartItem[] = JSON.parse(storedCart);

      const fetchProducts = async () => {
        try {
          const response = await api.productCartDetails(parsedCart);
          const fetched = response.data?.products || [];

          // Inject quantity from cart into fetched products
          const merged = fetched.map((product: Product) => {
            const match = parsedCart.find(
              (item) => item.productId === product._id
            );
            return {
              ...product,
              quantity: match?.quantity || 1,
            };
          });

          setProducts(merged);
        } catch (error) {
          console.error("Failed to fetch cart products:", error);
          toast.error("Unable to load cart items");
        }
      };

      fetchProducts();
    }
  }, []);
  const handleOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic validation for card payment
    if (paymentType === "credit" || paymentType === "debit") {
      if (
        !form.cardName.trim() ||
        !form.cardNumber.trim() ||
        !form.expiry.trim() ||
        !form.cvv.trim()
      ) {
        toast.error("Please fill all card payment details");
        return;
      }
      // Optional: Add more validations like card number length, expiry format, CVV length here
    }

    const orderData = {
      products: products.map((product) => ({
        id: product._id,
        name: product.productName,
        price: product.sellingPrice,
        image: product.imageUrls?.[0] || "",
        quantity: product.quantity,
      })),
      address: form.address.trim(),
      phone: form.phone.trim(),
      email: userEmail || "",
      paymentType,
      // Include paymentDetails only for card payments
      ...(paymentType === "credit" || paymentType === "debit"
        ? {
            paymentDetails: {
              cardName: form.cardName.trim(),
              cardNumber: form.cardNumber.trim(),
              expiry: form.expiry.trim(),
              cvv: form.cvv.trim(),
            },
          }
        : {}),
    };

    try {
      const response = await api.createOrder(orderData);
      if (response.status === 200 || response.status === 201) {
        toast.success("Order placed successfully!");
        localStorage.removeItem("cart");
        navigate("/");
      } else {
        toast.error("Failed to place order");
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("Order creation failed");
    }
  };

  if (!products.length)
    return <div className="text-center py-10">Loading cart...</div>;

  const totalPrice = products.reduce(
    (acc, item) => acc + item.sellingPrice * item.quantity,
    0
  );

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-tr from-white to-blue-50 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8 grid lg:grid-cols-2 gap-10">
        {/* Product Summary */}
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-gray-800">Order Summary</h2>
          {products.map((product) => (
            <div
              key={product._id}
              className="relative flex items-center gap-4 bg-gradient-to-tr from-white to-blue-50 border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={product.imageUrls?.[0]}
                alt={product.productName}
                className="w-24 h-24 rounded-xl object-cover border border-gray-200"
              />
              <div className="flex-1 space-y-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {product.productName}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                    ₹{product.sellingPrice} each
                  </span>
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-1 rounded-full">
                    Qty: {product.quantity}
                  </span>
                  <span className="ml-auto font-semibold text-blue-800">
                    ₹{product.sellingPrice * product.quantity}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div className="pt-4 text-right text-xl font-semibold text-gray-800">
            Total: ₹{totalPrice}
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleOrder} className="space-y-6">
          <div>
            <label className="block mb-1 font-semibold">Shipping Address</label>
            <div className="relative">
              <Home className="absolute top-3 left-3 text-gray-400" />
              <input
                type="text"
                placeholder="123 Main Street, City, ZIP"
                className="w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Phone Number</label>
            <div className="relative">
              <Phone className="absolute top-3 left-3 text-gray-400" />
              <input
                type="tel"
                placeholder="9876543210"
                className="w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold">Payment Method</label>
            <div className="flex space-x-4">
              {[
                { type: "credit", icon: <CreditCard />, label: "Credit" },
                { type: "debit", icon: <CreditCard />, label: "Debit" },
                { type: "cash", icon: <Truck />, label: "Cash on Delivery" },
              ].map((option) => (
                <button
                  key={option.type}
                  type="button"
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition font-medium ${
                    paymentType === option.type
                      ? "bg-blue-100 border-blue-500"
                      : "border-gray-300"
                  }`}
                  onClick={() => setPaymentType(option.type)}
                >
                  {option.icon} {option.label}
                </button>
              ))}
            </div>
          </div>

          {(paymentType === "credit" || paymentType === "debit") && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Cardholder Name"
                className="w-full px-4 py-3 border rounded-xl shadow-sm"
                value={form.cardName}
                onChange={(e) => setForm({ ...form, cardName: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Card Number"
                className="w-full px-4 py-3 border rounded-xl shadow-sm"
                value={form.cardNumber}
                onChange={(e) =>
                  setForm({ ...form, cardNumber: e.target.value })
                }
                required
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-1/2 px-4 py-3 border rounded-xl shadow-sm"
                  value={form.expiry}
                  onChange={(e) => setForm({ ...form, expiry: e.target.value })}
                  required
                />
                <input
                  type="password"
                  placeholder="CVV"
                  className="w-1/2 px-4 py-3 border rounded-xl shadow-sm"
                  value={form.cvv}
                  onChange={(e) => setForm({ ...form, cvv: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-blue-700 transition"
          >
            Place Order
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default BookProductPage;
