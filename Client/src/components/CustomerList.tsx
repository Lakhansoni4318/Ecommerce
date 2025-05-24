import { useEffect, useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CustomerOrdersPDF from "./CustomerOrdersPDF";
import EmptyCustomer from "./EmptyCustomer";
import api from "../../api/apiService";

const CustomerList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [userRes, orderRes] = await Promise.all([
        api.getUsers(),
        api.getOrders(),
      ]);

      const normalizedOrders = orderRes.data.orders.map((order: any) => ({
        ...order,
        products:
          order.products && order.products.length
            ? order.products
            : order.product
            ? [order.product]
            : [],
      }));

      setUsers(userRes.data.users);
      setOrders(normalizedOrders);
    };

    fetchData();
  }, []);

  const getUserOrders = (userId: string) =>
    orders.filter((order: any) => order.userId?._id === userId);

  // Filter out sellers (case-insensitive)
  const nonSellerUsers = users.filter(
    (user) => user.accountType.toLowerCase() !== "seller"
  );

  // Apply search filter on non-sellers by username or email
  const filteredUsers = nonSellerUsers.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.username.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  });

  const customersWithInfo = filteredUsers.map((user: any) => {
    const userOrders = getUserOrders(user._id);
    const totalSpent = userOrders.reduce(
      (sum, order) => sum + (order.product?.price || 0),
      0
    );
    const lastOrderDate = userOrders.length
      ? new Date(userOrders[0].orderTime).toLocaleString()
      : "-";
    return { ...user, orders: userOrders, totalSpent, lastOrderDate };
  });

  if (filteredUsers.length === 0) return <EmptyCustomer />;

  return (
    <>
      <h2 className="text-3xl font-bold mb-2">Customer List</h2>
      <p className="text-gray-600 mb-6">
        Manage your customer and seller accounts.
      </p>

      <input
        type="text"
        placeholder="Search by username or email"
        className="mb-4 p-2 border border-gray-300 rounded w-full max-w-sm"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

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
                    fileName={`order_report_${user._id}.pdf`}
                  >
                    {({ loading }) =>
                      loading ? (
                        <span>Loading...</span>
                      ) : (
                        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                          Download Order Report
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
