import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../Utils/Constants";
import { FiTrash2, FiUserPlus } from "react-icons/fi";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showVariantsModal, setShowVariantsModal] = useState(false);

  /* CART */
  const [cartItems, setCartItems] = useState([]);

  /* CUSTOMER */
  const [selectedCustomer, setSelectedCustomer] = useState("");

  /* DISCOUNT */
  const [discount, setDiscount] = useState(0);

  /* ----------------------------------
     FETCH PRODUCTS
  ---------------------------------- */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/product/all`, {
        withCredentials: true,
      });
      setProducts(res?.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------
     FETCH CUSTOMERS
  ---------------------------------- */
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/admin/users`, {
        withCredentials: true,
      });
      setUsers(res?.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, []);

  /* ----------------------------------
     ADD TO CART
  ---------------------------------- */
  const addToCart = (product, variant) => {
    setCartItems((prev) => {
      const index = prev.findIndex((i) => i.variant.SKU === variant.SKU);

      if (index !== -1) {
        return prev.map((item, i) =>
          i === index ? { ...item, qty: item.qty + 1 } : item
        );
      }

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

  /* ----------------------------------
     REMOVE FROM CART
  ---------------------------------- */
  const removeFromCart = (sku) => {
    setCartItems((prev) => prev.filter((i) => i.variant.SKU !== sku));
  };

  /* ----------------------------------
     CALCULATIONS
  ---------------------------------- */
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  const appliedDiscount = discount > subtotal ? subtotal : discount;

  const total = subtotal - appliedDiscount;

  return (
    <div className="p-6 bg-gray-50 dark:bg-[#09090B] min-h-screen">
      <h1 className="text-xl font-semibold mb-6 dark:text-white">
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
                  className="cursor-pointer bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg"
                >
                  <div className="h-40 bg-gray-100 dark:bg-[#1f1f23] flex items-center justify-center">
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
                    <h3 className="font-semibold dark:text-white">{p.name}</h3>
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

        {/* RIGHT – UI UNCHANGED */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-4 sticky top-20 max-w-sm">
            {/* SELECT CUSTOMER (same top position as your UI) */}
            <div className="flex gap-3 " >
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full border rounded px-3 py-2 text-sm "
              >
                <option value="">Select customer</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.firstName} {u.surName}
                  </option>
                ))}
              </select>
              <button
              onClick={""}
               className="px-3 rounded bg-blue-600 text-white">
                <FiUserPlus />
              </button>
            </div>

            {/* CART ITEMS */}
            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-12">
                Empty Cart
              </p>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.variant.SKU}
                    className="border rounded-lg p-3 flex justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium dark:text-white">
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
                      className="text-red-500"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* SUMMARY – SAME STRUCTURE */}
            <div className="border-t mt-4 pt-3 space-y-2 text-sm">
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
                  className="w-20 border rounded px-2 py-1 text-sm text-right"
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

            <button
              disabled={cartItems.length === 0 || !selectedCustomer}
              className="w-full mt-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-50"
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>

      {/* VARIANT MODAL – unchanged */}
      {showVariantsModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-[#111218] max-w-4xl w-full rounded-xl p-6">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {selectedProduct.name} – Variants
              </h2>
              <button onClick={() => setShowVariantsModal(false)}>✕</button>
            </div>

            <table className="min-w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2">SKU</th>
                  <th className="px-3 py-2">Size</th>
                  <th className="px-3 py-2">Color</th>
                  <th className="px-3 py-2">Price</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedProduct.varients.map((v, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2">{v.SKU}</td>
                    <td className="px-3 py-2">{v.size}</td>
                    <td className="px-3 py-2">{v.color}</td>
                    <td className="px-3 py-2">₹{v.sizeSellingPrice}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(selectedProduct, v);
                        }}
                        className="px-3 py-1 text-xs bg-black text-white rounded"
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
    </div>
  );
};

export default Cart;
