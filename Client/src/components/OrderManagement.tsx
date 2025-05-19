import OrderList from "./OrderList";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoiceDocument from "./InvoiceDocument";

const OrderManagement = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-2">Orders Management</h2>
      <p className="text-gray-600 mb-6">
        View customer orders, update status, and download invoices.
      </p>
      <OrderList
        renderAction={(order: any) => (
          <PDFDownloadLink
            document={<InvoiceDocument order={order} />}
            fileName={`invoice_${order._id}.pdf`}
          >
            {({ loading }) =>
              loading ? (
                <span>Loading...</span>
              ) : (
                <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                  Download Invoice
                </button>
              )
            }
          </PDFDownloadLink>
        )}
      />
    </div>
  );
};

export default OrderManagement;
