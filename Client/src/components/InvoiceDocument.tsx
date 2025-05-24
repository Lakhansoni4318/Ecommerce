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
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "#f9fafb",
  },
  header: {
    textAlign: "center",
    marginBottom: 25,
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
    borderBottomStyle: "solid",
    paddingBottom: 10,
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
    color: "#1E40AF",
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontWeight: "600",
    color: "#374151",
  },
  value: {
    color: "#111827",
    maxWidth: "60%",
    textAlign: "right",
  },
  productsTable: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    overflow: "hidden",
  },
  productsHeader: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    padding: 8,
  },
  headerCell: {
    flex: 1,
    color: "white",
    fontWeight: "700",
    fontSize: 12,
  },
  productRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    padding: 8,
    alignItems: "center",
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 10,
  },
  productNameCell: {
    flex: 3,
  },
  productQtyCell: {
    flex: 1,
    textAlign: "center",
  },
  productPriceCell: {
    flex: 1,
    textAlign: "right",
  },
  productTotalCell: {
    flex: 1,
    textAlign: "right",
    fontWeight: "600",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "bold",
    marginRight: 10,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2563eb",
  },
  paymentSection: {
    marginTop: 25,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  paymentTitle: {
    fontWeight: "700",
    fontSize: 14,
    marginBottom: 10,
    color: "#2563eb",
  },
  footer: {
    marginTop: 30,
    fontSize: 11,
    textAlign: "center",
    color: "#6b7280",
    fontStyle: "italic",
  },
});

interface Product {
  id: string;
  _id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
}

interface PaymentDetails {
  cardName: string;
  cardNumber: string;
  expiry: string;
}

interface User {
  _id: string;
  email: string;
}

interface Order {
  _id: string;
  userId: User;
  orderTime: string;
  address: string;
  phone: string;
  products: Product[];
  paymentType: string;
  paymentDetails?: PaymentDetails | null;
}

interface Props {
  order: Order;
}

const CustomerInvoice: React.FC<Props> = ({ order }) => {
  // Calculate total amount for order
  const totalAmount = order.products.reduce(
    (acc, product) => acc + product.price * product.quantity,
    0
  );

  return (
    <Document>
      <Page style={styles.page} size="A4">
        {/* Header */}
        <View style={styles.header}>
          <Image
            style={styles.logo}
            src="https://via.placeholder.com/60" // Replace with your logo URL
          />
          <Text style={styles.title}>Eroam Store - Invoice</Text>
        </View>

        {/* Customer & Order Info */}
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.label}>Customer Email:</Text>
            <Text style={styles.value}>{order.userId?.email || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Order Date:</Text>
            <Text style={styles.value}>
              {new Date(order.orderTime).toLocaleString()}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Shipping Address:</Text>
            <Text style={styles.value}>{order.address}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{order.phone}</Text>
          </View>
        </View>

        {/* Products Table */}
        <View style={styles.productsTable}>
          <View style={styles.productsHeader}>
            <Text style={[styles.headerCell, { flex: 3 }]}>Product</Text>
            <Text style={styles.headerCell}>Qty</Text>
            <Text style={styles.headerCell}>Price (₹)</Text>
            <Text style={styles.headerCell}>Total (₹)</Text>
          </View>
          {order.products.map((product) => (
            <View style={styles.productRow} key={product._id}>
              <View style={styles.productNameCell}>
                {product.image && (
                  <Image src={product.image} style={styles.productImage} />
                )}
                <Text>{product.name}</Text>
              </View>
              <Text style={styles.productQtyCell}>{product.quantity}</Text>
              <Text style={styles.productPriceCell}>
                {product.price.toLocaleString("en-IN")}
              </Text>
              <Text style={styles.productTotalCell}>
                {(product.price * product.quantity).toLocaleString("en-IN")}
              </Text>
            </View>
          ))}
        </View>

        {/* Total Amount */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>₹{totalAmount.toLocaleString("en-IN")}</Text>
        </View>

        {/* Payment Info */}
        <View style={styles.paymentSection}>
          <Text style={styles.paymentTitle}>Payment Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Payment Type:</Text>
            <Text style={styles.value}>{order.paymentType.toUpperCase()}</Text>
          </View>
          {order.paymentDetails ? (
            <>
              <View style={styles.row}>
                <Text style={styles.label}>Cardholder Name:</Text>
                <Text style={styles.value}>{order.paymentDetails.cardName}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Card Number:</Text>
                <Text style={styles.value}>{order.paymentDetails.cardNumber}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Expiry Date:</Text>
                <Text style={styles.value}>{order.paymentDetails.expiry}</Text>
              </View>
            </>
          ) : (
            <Text style={{ marginTop: 8, color: "#444" }}>
              Payment made by cash / other method
            </Text>
          )}
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          Thank you for shopping with Eroam Store! We appreciate your business.
        </Text>
      </Page>
    </Document>
  );
};

export default CustomerInvoice;
