import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.5,
    backgroundColor: "#f8f9fa",
  },
  headerContainer: {
    textAlign: "center",
    marginBottom: 20,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 5,
    alignSelf: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  userInfo: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: 6,
  },
  label: {
    fontWeight: "bold",
    color: "#2c3e50",
  },
  orderBox: {
    border: "1px solid #ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    padding: 10,
    marginBottom: 15,
    flexDirection: "row",
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  orderDetails: {
    flex: 1,
    justifyContent: "center",
  },
  orderItem: {
    marginBottom: 4,
  },
  boldText: {
    fontWeight: "bold",
  },
  footer: {
    marginTop: 20,
    fontSize: 13,
    textAlign: "right",
    fontWeight: "bold",
    color: "#27ae60",
  },
});

// Interfaces
interface Product {
  name: string;
  price: number;
  image: string;
  variant?: string;
  quantity?: number;
}

interface Order {
  _id: string;
  product?: Product; // for customer
  products?: Product[]; // for seller
  orderTime: string;
  paymentType: string;
  paymentDetails?: {
    cardNumber: string;
  };
  address: string;
}

interface Props {
  user: {
    username: string;
    email: string;
    accountType: "customer" | "seller";
  };
  orders: Order[];
}

const CustomerInvoicePDF: React.FC<Props> = ({ user, orders }) => {
  const isSeller = user.accountType === "seller";

  // Calculate total sales or spending
  const total = orders.reduce((sum, order) => {
    const productList = isSeller
      ? order.products || []
      : order.product
      ? [order.product]
      : [];
    return (
      sum +
      productList.reduce((acc, product) => {
        const quantity = product.quantity ?? 1;
        return acc + product.price * quantity;
      }, 0)
    );
  }, 0);

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Image style={styles.logo} src="https://via.placeholder.com/100" />
          <Text style={styles.title}>
            {isSeller
              ? `Sales Report for ${user.username}`
              : `Order Report for ${user.username}`}
          </Text>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <Text style={styles.label}>
            Email: <Text>{user.email}</Text>
          </Text>
          <Text style={styles.label}>
            Account Type: <Text>{user.accountType}</Text>
          </Text>
        </View>

        {/* Product Orders */}
        {orders.map((order, index) => {
          const productList = isSeller
            ? order.products || []
            : order.product
            ? [order.product]
            : [];

          return productList.map((product, i) => (
            <View key={`${order._id}_${i}`} style={styles.orderBox}>
              <Image src={product.image} style={styles.productImage} />
              <View style={styles.orderDetails}>
                <Text style={styles.orderItem}>
                  <Text style={styles.boldText}>Order #{index + 1}</Text>
                </Text>
                <Text style={styles.orderItem}>
                  <Text style={styles.boldText}>Product:</Text> {product.name}
                </Text>
                <Text style={styles.orderItem}>
                  <Text style={styles.boldText}>Price:</Text> ₹{product.price}
                </Text>
                {product.quantity && (
                  <Text style={styles.orderItem}>
                    <Text style={styles.boldText}>Quantity:</Text>{" "}
                    {product.quantity}
                  </Text>
                )}
                <Text style={styles.orderItem}>
                  <Text style={styles.boldText}>Order Date:</Text>{" "}
                  {new Date(order.orderTime).toLocaleString()}
                </Text>
                <Text style={styles.orderItem}>
                  <Text style={styles.boldText}>Address:</Text> {order.address}
                </Text>
                <Text style={styles.orderItem}>
                  <Text style={styles.boldText}>Payment Type:</Text>{" "}
                  {order.paymentType}
                  {order.paymentType !== "cash" && order.paymentDetails
                    ? ` (Card ending ${order.paymentDetails.cardNumber.slice(
                        -4
                      )})`
                    : ""}
                </Text>
              </View>
            </View>
          ));
        })}

        {/* Total */}
        <Text style={styles.footer}>
          {isSeller ? "Total Sales" : "Total Spent"}: ₹{total}
        </Text>
      </Page>
    </Document>
  );
};

export default CustomerInvoicePDF;
