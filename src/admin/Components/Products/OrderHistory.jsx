import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../Utils/Constants";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/order/all`, {
        withCredentials: true,
      });
      setOrders(res?.data?.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load order history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getCustomerName = (order) => {
    if (order.customer)
      return `${order.customer.firstName} ${order.customer.surName || ""}`;
    if (order.customerInfo)
      return `${order.customerInfo.firstName} ${
        order.customerInfo.surName || ""
      }`;
    return "-";
  };

  const getCustomerType = (order) => {
    if (order.customer) return "Existing";
    if (order.customerInfo) return "Walk-in";
    return "-";
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-[#09090B] min-h-screen">
      <h1 className="text-xl font-semibold mb-6 dark:text-white">
        Order History
      </h1>

      <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-gray-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-sm text-gray-500">No orders found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 dark:bg-[#181920] text-gray-700 dark:text-gray-300">
                <tr>
                  {[
                    "Date",
                    "Customer",
                    "Type",
                    "Items",
                    "Payment",
                    "Total",
                    "Status",
                  ].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {orders.map((order) => (
                  <tr
                    key={order._id}
                    onClick={() => setSelectedOrder(order)}
                    className="cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1f1f23]"
                  >
                    <td className="px-4 py-3">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 font-medium dark:text-white">
                      {getCustomerName(order)}
                    </td>

                    <td className="px-4 py-3">
                      {getCustomerType(order) === "Existing" ? (
                        <span className="px-2 py-1 text-xs rounded bg-blue-500 text-white">
                          Existing
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded bg-gray-500 text-white">
                          Walk-in
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {order.selectedProducts?.length || 0}
                    </td>

                    <td className="px-4 py-3">{order.paymentMode}</td>

                    <td className="px-4 py-3 font-semibold">
                      ₹{order.totalAmount?.toFixed(2)}
                    </td>

                    <td className="px-4 py-3">
                      {order.status === "PAID" && (
                        <span className="px-2 py-1 text-xs rounded bg-green-500 text-white">
                          Paid
                        </span>
                      )}
                      {order.status === "PENDING" && (
                        <span className="px-2 py-1 text-xs rounded bg-yellow-500 text-white">
                          Pending
                        </span>
                      )}
                      {order.status === "CANCELLED" && (
                        <span className="px-2 py-1 text-xs rounded bg-red-500 text-white">
                          Cancelled
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= ORDER DETAILS MODAL ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-[#111218] w-full max-w-4xl rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold dark:text-white">
                Order Details
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm mb-4">
              <div className="space-y-1">
                <p>
                  <b>Date:</b>{" "}
                  {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
                <p>
                  <b>Status:</b> {selectedOrder.status}
                </p>
                <p>
                  <b>Payment:</b> {selectedOrder.paymentMode}
                </p>
              </div>

              <div className="space-y-1">
                <p>
                  <b>Customer Type:</b> {getCustomerType(selectedOrder)}
                </p>
                <p>
                  <b>Name:</b> {getCustomerName(selectedOrder)}
                </p>
                <p>
                  <b>Contact:</b>{" "}
                  {selectedOrder.customer?.contact ||
                    selectedOrder.customerInfo?.contact}
                </p>
                {selectedOrder.customerInfo?.billingAddress && (
                  <p className="text-xs text-gray-500">
                    {Object.values(selectedOrder.customerInfo.billingAddress)
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}
              </div>
            </div>

            <div className="overflow-x-auto mb-4">
              <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 dark:bg-[#181920] text-gray-700 dark:text-gray-300">
                  <tr>
                    {["Product", "SKU", "Size", "Qty", "Price", "Total"].map(
                      (h) => (
                        <th key={h} className="px-3 py-2 text-left font-medium">
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {selectedOrder.selectedProducts.map((p, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2">{p.productName}</td>
                      <td className="px-3 py-2">{p.variant.SKU}</td>
                      <td className="px-3 py-2">{p.variant.size || "-"}</td>
                      <td className="px-3 py-2">{p.qty}</td>
                      <td className="px-3 py-2">₹{p.price}</td>
                      <td className="px-3 py-2">₹{p.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-sm space-y-1 border-t pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{selectedOrder.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount</span>
                <span>₹{selectedOrder.discount}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span>₹{selectedOrder.tax}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{selectedOrder.totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
