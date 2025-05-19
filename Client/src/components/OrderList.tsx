import { useEffect, useState } from "react";
import api from "../../api/apiService";

interface OrderListProps {
  renderAction?: (order: any) => React.ReactNode;
}

const OrderList: React.FC<OrderListProps> = ({ renderAction }) => {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await api.getOrders();
      setOrders(res.data.orders);
    };
    fetchOrders();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            <th className="text-left py-3 px-4 border-b">Customer Email</th>
            <th className="text-left py-3 px-4 border-b">Order Date</th>
            <th className="text-left py-3 px-4 border-b">Product</th>
            <th className="text-left py-3 px-4 border-b">Price</th>
            <th className="text-left py-3 px-4 border-b">Address</th>
            <th className="text-left py-3 px-4 border-b">Payment Type</th>
            <th className="text-center py-3 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-500">
                No orders found.
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="py-3 px-4 border-b">{order.userId?.email || "N/A"}</td>
                <td className="py-3 px-4 border-b">
                  {new Date(order.orderTime).toLocaleString()}
                </td>
                <td className="py-3 px-4 border-b">{order.product?.name}</td>
                <td className="py-3 px-4 border-b">₹{order.product?.price}</td>
                <td className="py-3 px-4 border-b">{order.address}</td>
                <td className="py-3 px-4 border-b">
                  {order.paymentType}
                  {order.paymentType !== "cash" && order.paymentDetails
                    ? ` (Card ending ${order.paymentDetails.cardNumber.slice(-4)})`
                    : ""}
                </td>
                <td className="py-3 px-4 border-b text-center">
                  {renderAction && renderAction(order)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
