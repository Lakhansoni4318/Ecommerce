// components/InvoiceDocument.tsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "#fff",
  },
  header: {
    borderBottom: "2 solid #000",
    marginBottom: 20,
    paddingBottom: 10,
  },
  companyName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E3A8A",
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#374151",
  },
  section: {
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: "#6B7280",
  },
  value: {
    fontWeight: "bold",
    color: "#111827",
  },
  table: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 4,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderBottom: "1 solid #D1D5DB",
    padding: 8,
  },
  tableRow: {
    flexDirection: "row",
    padding: 8,
    borderBottom: "1 solid #E5E7EB",
  },
  cell: {
    flex: 1,
    fontSize: 12,
  },
  total: {
    textAlign: "right",
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
  },
});

const InvoiceDocument = ({ order }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.companyName}>Lakhan E-Commerce</Text>
        <Text style={styles.invoiceTitle}>Invoice</Text>
      </View>

      {/* Order Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Details</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Product:</Text>
          <Text style={styles.value}>{order.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Order Date:</Text>
          <Text style={styles.value}>{order.orderDate}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Order ID:</Text>
          <Text style={styles.value}>{order.orderId}</Text>
        </View>
      </View>

      {/* Customer Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{order.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{order.phone}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{order.address}</Text>
        </View>
      </View>

      {/* Product Table */}
      <View style={[styles.section, styles.table]}>
        <View style={styles.tableHeader}>
          <Text style={[styles.cell, { flex: 2 }]}>Product</Text>
          <Text style={styles.cell}>Qty</Text>
          <Text style={styles.cell}>Price</Text>
          <Text style={styles.cell}>Total</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={[styles.cell, { flex: 2 }]}>{order.name}</Text>
          <Text style={styles.cell}>{order.quantity}</Text>
          <Text style={styles.cell}>₹{order.price.toLocaleString()}</Text>
          <Text style={styles.cell}>
            ₹{(order.price * order.quantity).toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Payment Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Information</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Method:</Text>
          <Text style={styles.value}>{order.paymentType.toUpperCase()}</Text>
        </View>
        {order.cardInfo && (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>Card Holder:</Text>
              <Text style={styles.value}>{order.cardInfo.cardName}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Card Number:</Text>
              <Text style={styles.value}>{order.cardInfo.cardNumber}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Expiry:</Text>
              <Text style={styles.value}>{order.cardInfo.expiry}</Text>
            </View>
          </>
        )}
      </View>

      {/* Total */}
      <Text style={styles.total}>
        Grand Total: ₹{(order.price * order.quantity).toLocaleString()}
      </Text>
    </Page>
  </Document>
);

export default InvoiceDocument;
