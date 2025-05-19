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
    padding: 30,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#f5f5f5",
  },
  header: {
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
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
  },
  infoSection: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 6,
    border: "1px solid #ddd",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    color: "#444",
  },
  productCard: {
    backgroundColor: "#ffffff",
    border: "1px solid #ccc",
    borderRadius: 6,
    padding: 12,
    marginTop: 10,
    flexDirection: "row",
  },
  productImage: {
    width: 70,
    height: 70,
    marginRight: 12,
  },
  productDetails: {
    flex: 1,
    justifyContent: "center",
  },
  footer: {
    marginTop: 30,
    fontSize: 10,
    textAlign: "center",
    color: "#777",
  },
});

// Interfaces
interface Product {
  name: string;
  price: number;
  image?: string;
}

interface PaymentDetails {
  cardName: string;
  cardNumber: string;
  expiry: string;
}

interface User {
  name: string;
}

interface Order {
  _id: string;
  user: User;
  orderTime: string;
  address: string;
  product: Product;
  paymentType: string;
  paymentDetails?: PaymentDetails;
}

interface Props {
  order: Order;
}

const InvoiceDocument: React.FC<Props> = ({ order }) => {
  const product = order.product;

  return (
    <Document>
      <Page style={styles.page} size="A4">
        {/* Header */}
        <View style={styles.header}>
          <Image
            style={styles.logo}
            src="https://via.placeholder.com/60" // Replace with real logo URL
          />
          <Text style={styles.title}>Eroam Store - Invoice</Text>
        </View>

        {/* Customer Info */}
        <View style={styles.infoSection}>
          <View style={styles.row}>
            <Text style={styles.label}>Customer:</Text>
            <Text style={styles.value}>{order.user?.name || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Order Date:</Text>
            <Text style={styles.value}>{new Date(order.orderTime).toLocaleString()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Shipping Address:</Text>
            <Text style={styles.value}>{order.address}</Text>
          </View>
        </View>

        {/* Product Card */}
        <View style={styles.productCard}>
          {product.image && (
            <Image src={product.image} style={styles.productImage} />
          )}
          <View style={styles.productDetails}>
            <Text style={{ fontSize: 13, fontWeight: "bold", marginBottom: 4 }}>
              {product.name}
            </Text>
            <Text>Price: ₹{product.price.toLocaleString("en-IN")}</Text>
            <Text>Payment Type: {order.paymentType}</Text>
            {order.paymentDetails && (
              <>
                <Text>Cardholder: {order.paymentDetails.cardName}</Text>
                <Text>Card Ending: {order.paymentDetails.cardNumber.slice(-4)}</Text>
                <Text>Expiry: {order.paymentDetails.expiry}</Text>
              </>
            )}
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Thank you for shopping with Eroam Store!</Text>
      </Page>
    </Document>
  );
};

export default InvoiceDocument;
