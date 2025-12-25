import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../Utils/Constants";
import { FiTrash2, FiUserPlus } from "react-icons/fi";
import AddCustomer from "./AddCustomer";

const inputClass =
  "w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-[#14151c] text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showVariantsModal, setShowVariantsModal] = useState(false);
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  const [cartItems, setCartItems] = useState([]);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [customerInfo, setCustomerInfo] = useState(null);

  const [paymentMode, setPaymentMode] = useState("CASH");
  const [discount, setDiscount] = useState(0);

  /* ---------------------------------- FETCH */
  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/product/all`, {
        withCredentials: true,
      });
      setProducts(res?.data?.data || []);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const res = await axios.get(`${BASE_URL}/admin/users`, {
      withCredentials: true,
    });
    setUsers(res?.data?.data || []);
  };

  /* ---------------------------------- CART */
  const addToCart = (product, variant) => {
    setCartItems((prev) => {
      const index = prev.findIndex((i) => i.variant.SKU === variant.SKU);
      if (index !== -1)
        return prev.map((item, i) =>
          i === index ? { ...item, qty: item.qty + 1 } : item
        );

      return [
        ...prev,
        {
          productId: product._id,
          productName: product.name,
          variant,
          price: variant.sizeSellingPrice,
          qty: 1,
        },
      ];
    });

    setShowVariantsModal(false);
  };

  const removeFromCart = (sku) => {
    setCartItems((prev) => prev.filter((i) => i.variant.SKU !== sku));
  };

  /* ---------------------------------- CALC */
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const appliedDiscount = discount > subtotal ? subtotal : discount;
  const total = subtotal - appliedDiscount;

  /* ---------------------------------- BUILD ORDER */
  const buildSelectedProducts = () =>
    cartItems.map((item) => ({
      product: item.productId,
      productName: item.productName,
      variant: {
        SKU: item.variant.SKU,
        size: item.variant.size,
        color: item.variant.color,
      },
      price: item.price,
      qty: item.qty,
      total: item.price * item.qty,
    }));

  /* ---------------------------------- CUSTOMER */
  const handleCreateCustomer = (data) => {
    setCustomerInfo({
      firstName: data.firstName,
      surName: data.surName,
      emailId: data.emailId,
      contact: data.contact,
      billingAddress: {
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        country: data.country,
        zip: data.zip,
      },
    });

    setSelectedCustomer("");
    setShowAddCustomer(false);
  };

  const resolvedCustomer = selectedCustomer
    ? users.find((u) => u._id === selectedCustomer)
    : null;

  /* ---------------------------------- PLACE ORDER */
  const handlePlaceOrder = async () => {
    try {
      if (!cartItems.length) return alert("Cart is empty");
      if (!selectedCustomer && !customerInfo)
        return alert("Select or add customer");

      const payload = {
        selectedProducts: buildSelectedProducts(),
        paymentMode,
        subtotal,
        discount,
        tax: 0,
        totalAmount: total,
      };

      if (selectedCustomer) payload.customer = selectedCustomer;
      if (customerInfo) payload.customerInfo = customerInfo;

      await axios.post(`${BASE_URL}/order/create`, payload, {
        withCredentials: true,
      });

      alert("Order placed successfully");

      setCartItems([]);
      setDiscount(0);
      setSelectedCustomer("");
      setCustomerInfo(null);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-[#09090B] min-h-screen">
      <h1 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">
        Point of Sale
      </h1>

      <div className="grid grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="col-span-12 lg:col-span-9">
          {loading ? (
            <p className="text-sm text-gray-500">Loading products...</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p._id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setShowVariantsModal(true);
                  }}
                  className="cursor-pointer bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
                >
                  <div className="h-40 bg-gray-100 dark:bg-[#181920] flex items-center justify-center">
                    {p.image ? (
                      <img
                        src={`${BASE_URL}/${p.image}`}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-gray-400">No Image</span>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                      {p.name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {p.brand?.name || "-"}
                    </p>
                    <p className="text-sm font-medium">₹{p.sellingPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-4 sticky top-20 max-w-sm">
            {/* CUSTOMER SELECT */}
            <div className="flex gap-3">
              <select
                value={selectedCustomer}
                onChange={(e) => {
                  setSelectedCustomer(e.target.value);
                  setCustomerInfo(null);
                }}
                className={inputClass}
              >
                <option value="">Select customer</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.firstName} {u.surName}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowAddCustomer(true)}
                className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#1f1f23]"
              >
                <FiUserPlus />
              </button>
            </div>

            {/* CART ITEMS */}
            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-12">
                Empty Cart
              </p>
            ) : (
              <div className="space-y-3 mt-4">
                {cartItems.map((item) => (
                  <div
                    key={item.variant.SKU}
                    className="bg-gray-50 dark:bg-[#181920] rounded-md p-3 flex justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {item.productName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.variant.size} | {item.variant.SKU}
                      </p>
                      <p className="text-xs">
                        ₹{item.price} × {item.qty}
                      </p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.variant.SKU)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* SUMMARY */}
            <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Add discount</span>
                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-20 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm text-right bg-white dark:bg-[#14151c]"
                />
              </div>

              <div className="flex justify-between">
                <span>Tax</span>
                <span>Not collected</span>
              </div>

              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* CUSTOMER DETAILS */}
            {(resolvedCustomer || customerInfo) && (
              <div className="mt-3 text-sm text-gray-700 dark:text-gray-300">
                <p className="font-medium">Customer</p>
                <p>
                  {(resolvedCustomer || customerInfo).firstName}{" "}
                  {(resolvedCustomer || customerInfo).surName}
                </p>
                <p>{(resolvedCustomer || customerInfo).contact}</p>
                {(resolvedCustomer || customerInfo).emailId && (
                  <p>{(resolvedCustomer || customerInfo).emailId}</p>
                )}
              </div>
            )}

            {/* PAYMENT */}
            <div className="mt-3">
              <select
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                className={inputClass}
              >
                <option value="CASH">Cash</option>
                <option value="CARD">Card</option>
                <option value="UPI">UPI</option>
                <option value="ONLINE">Online</option>
              </select>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={!cartItems.length}
              className="w-full mt-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-90 disabled:opacity-50"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>

      {/* VARIANT MODAL */}
      {showVariantsModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 max-w-4xl w-full rounded-xl p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {selectedProduct.name} – Variants
              </h2>
              <button onClick={() => setShowVariantsModal(false)}>✕</button>
            </div>

            <table className="min-w-full text-sm border border-gray-200 dark:border-gray-700">
              <thead className="bg-gray-100 dark:bg-[#181920]">
                <tr>
                  <th className="px-3 py-2 text-left">SKU</th>
                  <th className="px-3 py-2 text-left">Size</th>
                  <th className="px-3 py-2 text-left">Color</th>
                  <th className="px-3 py-2 text-left">Price</th>
                  <th className="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedProduct.varients.map((v, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-200 dark:border-gray-700"
                  >
                    <td className="px-3 py-2">{v.SKU}</td>
                    <td className="px-3 py-2">{v.size}</td>
                    <td className="px-3 py-2">{v.color}</td>
                    <td className="px-3 py-2">₹{v.sizeSellingPrice}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => addToCart(selectedProduct, v)}
                        className="px-3 py-1 text-xs rounded bg-black text-white dark:bg-white dark:text-black"
                      >
                        Select
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <AddCustomer
        open={showAddCustomer}
        onClose={() => setShowAddCustomer(false)}
        onCreate={handleCreateCustomer}
      />
    </div>
  );
};

export default Cart;
