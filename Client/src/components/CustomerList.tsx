import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CustomerOrdersPDF from "./CustomerOrdersPDF";
import EmptyCustomer from "./EmptyCustomer";
import api from "../../api/apiService";

const CustomerList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const [userRes, orderRes] = await Promise.all([
        api.getUsers(),
        api.getOrders()
      ]);
      setUsers(userRes.data.users);
      setOrders(orderRes.data.orders);
    };
    fetchData();
  }, []);

  const getUserOrders = (userId: string) =>
    orders.filter((order: any) => order.userId?._id === userId);

  const customersWithInfo = users.map((user: any) => {
    const userOrders = getUserOrders(user._id);
    const totalSpent = userOrders.reduce((sum, order) => sum + (order.product?.price || 0), 0);
    const lastOrderDate = userOrders.length ? new Date(userOrders[0].orderTime).toLocaleString() : "-";
    return { ...user, orders: userOrders, totalSpent, lastOrderDate };
  });

  if (users.length === 0) return <EmptyCustomer />;

  return (
    <>
      <h2 className="text-3xl font-bold mb-2">Customer List</h2>
      <p className="text-gray-600 mb-6">
        Manage your customer and seller accounts.
      </p>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Account Type</th>
            <th className="border p-2">Orders</th>
            <th className="border p-2">Total Spent</th>
            <th className="border p-2">Last Order</th>
            <th className="border p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {customersWithInfo.map((user) => (
            <tr key={user._id}>
              <td className="border p-2">{user.username}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2 capitalize">{user.accountType}</td>
              <td className="border p-2 text-center">{user.orders.length}</td>
              <td className="border p-2">₹{user.totalSpent}</td>
              <td className="border p-2">{user.lastOrderDate}</td>
              <td className="border p-2 text-center">
                {user.orders.length > 0 ? (
                  <PDFDownloadLink
                    document={
                      <CustomerOrdersPDF user={user} orders={user.orders} />
                    }
                    fileName={`orders_${user._id}.pdf`}
                  >
                    {({ loading }) =>
                      loading ? (
                        <span>Loading...</span>
                      ) : (
                        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                          Download Orders
                        </button>
                      )
                    }
                  </PDFDownloadLink>
                ) : (
                  <span className="text-gray-500">No orders</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default CustomerList;
