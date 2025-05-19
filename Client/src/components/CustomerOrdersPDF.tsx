import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

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

interface Order {
  _id: string;
  product: {
    name: string;
    price: number;
    image: string;
    variant?: string;
  };
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
    accountType: string;
  };
  orders: Order[];
}

const CustomerInvoicePDF: React.FC<Props> = ({ user, orders }) => {
  const total = orders.reduce((sum, order) => sum + order.product.price, 0);

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Image style={styles.logo} src="https://via.placeholder.com/100" />
          <Text style={styles.title}>Order Summary for {user.username}</Text>
        </View>

        {/* Customer Info */}
        <View style={styles.userInfo}>
          <Text style={styles.label}>Customer Email: <Text>{user.email}</Text></Text>
          <Text style={styles.label}>Account Type: <Text>{user.accountType}</Text></Text>
        </View>

        {/* Orders */}
        {orders.map((order, index) => (
          <View key={order._id} style={styles.orderBox}>
            <Image src={order.product.image} style={styles.productImage} />
            <View style={styles.orderDetails}>
              <Text style={styles.orderItem}><Text style={styles.boldText}>Order #{index + 1}</Text></Text>
              <Text style={styles.orderItem}><Text style={styles.boldText}>Product:</Text> {order.product.name} {order.product.variant ? `(${order.product.variant})` : ""}</Text>
              <Text style={styles.orderItem}><Text style={styles.boldText}>Price:</Text> ₹{order.product.price}</Text>
              <Text style={styles.orderItem}><Text style={styles.boldText}>Order Date:</Text> {new Date(order.orderTime).toLocaleString()}</Text>
              <Text style={styles.orderItem}><Text style={styles.boldText}>Address:</Text> {order.address}</Text>
              <Text style={styles.orderItem}>
                <Text style={styles.boldText}>Payment Type:</Text> {order.paymentType}
                {order.paymentType !== "cash" && order.paymentDetails
                  ? ` (Card ending ${order.paymentDetails.cardNumber.slice(-4)})`
                  : ""}
              </Text>
            </View>
          </View>
        ))}

        {/* Footer Total */}
        <Text style={styles.footer}>Total Spent: ₹{total}</Text>
      </Page>
    </Document>
  );
};

export default CustomerInvoicePDF;
