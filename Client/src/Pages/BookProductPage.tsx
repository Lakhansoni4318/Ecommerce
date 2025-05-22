import { useEffect, useState } from "react";
import {
  CreditCard,
  Truck,
  Home,
  CalendarClock,
  LockKeyhole,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/apiService";

const BookProductPage = () => {
  const [paymentType, setPaymentType] = useState("credit");
  const [form, setForm] = useState({
    address: "",
    cardNumber: "",
    cardName: "",
    expiry: "",
    cvv: "",
  });
  type Product = {
    imageUrls?: string[];
    productName: string;
    sellingPrice: number;
    productDescription: string;
  };
  
  const [product, setProduct] = useState<Product | null>(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProduct = async () => {
      try {
        const response = await api.productDetails(id);
        const productData = response.data;
        setProduct(productData);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        toast.error("Failed to load product");
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const orderData = {
      productId: id,
      address: form.address,
      paymentType,
      cardName: form.cardName,
      cardNumber: form.cardNumber,
      expiry: form.expiry,
      cvv: form.cvv,
    };

    try {
      const response = await api.createOrder(orderData);
      if (response.status === 200 || response.status === 201) {
        toast.success("Order placed successfully!");
        navigate("/")
      } else {
        toast.error("Failed to place order");
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      toast.error("Order creation failed");
    }
  };

  if (!product) return null;

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl p-8 grid lg:grid-cols-2 gap-10">
        {/* Product Section */}
        <div className="space-y-6">
          <img
            src={product.imageUrls?.[0]}
            alt={product.productName}
            className="w-full max-h-96 object-contain rounded-xl shadow-md bg-gray-100"
          />

          <h2 className="text-3xl font-bold text-gray-800">
            {product.productName}
          </h2>
          <p className="text-2xl text-green-600 font-semibold flex items-center">
            ₹{product.sellingPrice}
          </p>
          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
            {product.productDescription}
          </p>
        </div>

        {/* Checkout Section */}
        <form onSubmit={handleOrder} className="space-y-6">
          {/* Address */}
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

          {/* Payment Type */}
          <div>
            <label className="block mb-1 font-semibold">
              Select Payment Type
            </label>
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

          {/* Card Details */}
          {(paymentType === "credit" || paymentType === "debit") && (
            <div className="space-y-4">
              <div>
                <label className="block mb-1 font-semibold">
                  Cardholder Name
                </label>
                <div className="relative">
                  <User className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.cardName}
                    onChange={(e) =>
                      setForm({ ...form, cardName: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 font-semibold">Card Number</label>
                <div className="relative">
                  <CreditCard className="absolute top-3 left-3 text-gray-400" />
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="1234 5678 9012 3456"
                    className="w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={form.cardNumber}
                    onChange={(e) =>
                      setForm({ ...form, cardNumber: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="w-1/2">
                  <label className="block mb-1 font-semibold">Expiry</label>
                  <div className="relative">
                    <CalendarClock className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.expiry}
                      onChange={(e) =>
                        setForm({ ...form, expiry: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="w-1/2">
                  <label className="block mb-1 font-semibold">CVV</label>
                  <div className="relative">
                    <LockKeyhole className="absolute top-3 left-3 text-gray-400" />
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="123"
                      className="w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={form.cvv}
                      onChange={(e) =>
                        setForm({ ...form, cvv: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition"
          >
            Confirm Order
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default BookProductPage;
