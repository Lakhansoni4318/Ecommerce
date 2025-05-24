import { useEffect, useState } from "react";
import api from "../../api/apiService";
import {
  PackageCheck,
  AlertTriangle,
  ShoppingBag,
  CalendarDays,
  Phone,
  MapPin,
  CreditCard,
  Download,
} from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoiceDocument from "../components/UserInvoice";
export default function OrderPage() {
  const [search, setSearch] = useState("");
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await api.getOrders();
      const orderItems = res.data.orders.flatMap((order: any) => {
        const base = {
          orderId: order._id,
          address: order.address,
          phone: order.phone,
          paymentType: order.paymentType,
          cardInfo: order.paymentDetails || null,
          email: order.userId?.email || "",
          orderDate: new Date(order.orderTime).toLocaleDateString(),
        };
        return order.products && order.products.length > 0
          ? order.products.map((p: any) => ({ ...base, ...p }))
          : order.product
          ? [{ ...base, ...order.product, quantity: 1 }]
          : [];
      });
      setOrders(orderItems);
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    order.name.toLowerCase().includes(search.toLowerCase())
  );


  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <PackageCheck className="text-blue-600" size={28} /> Your Orders
        </h1>
      </div>

      <input
        type="text"
        placeholder="Search your products..."
        className="w-full mb-6 p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-gray-600">
          <AlertTriangle className="text-red-500 mb-4" size={48} />
          <h2 className="text-2xl font-semibold mb-2">No Orders Found</h2>
          <p className="text-gray-500 max-w-md">
            We couldn’t find any orders matching your search.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={`${order.orderId}-${order.id}`}
              className="bg-white rounded-2xl shadow-md p-5 flex flex-col hover:shadow-lg transition"
            >
              <img
                src={order.image}
                alt={order.name}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <ShoppingBag size={20} /> {order.name}
              </h2>
              <p className="text-gray-700 font-medium mt-1">
                ₹{order.price.toLocaleString()}
              </p>
              <p className="text-gray-500 text-sm">Qty: {order.quantity}</p>

              <div className="mt-3 text-sm text-gray-500 space-y-1">
                <p className="flex items-center gap-1">
                  <CalendarDays size={16} /> Ordered on: {order.orderDate}
                </p>
                <p className="flex items-center gap-1">
                  <MapPin size={16} /> {order.address}
                </p>
                <p className="flex items-center gap-1">
                  <Phone size={16} /> {order.phone}
                </p>
                <p className="flex items-center gap-1">
                  <CreditCard size={16} /> {order.paymentType.toUpperCase()}
                </p>
              </div>
              <PDFDownloadLink
                document={<InvoiceDocument order={order} />}
                fileName={`invoice_${order.name}.pdf`}
              >
                {({ loading }) =>
                  loading ? (
                    <span className="text-sm text-gray-500">Generating...</span>
                  ) : (
                    <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700">
                      <Download size={18} /> Download Invoice
                    </button>
                  )
                }
              </PDFDownloadLink>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
