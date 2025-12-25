import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../Utils/Constants";
import { FiTrash2 } from "react-icons/fi";

const Cart = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showVariantsModal, setShowVariantsModal] = useState(false);

  /* CART STATE */
  const [cartItems, setCartItems] = useState([]);

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
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* ----------------------------------
     ADD TO CART
  ---------------------------------- */
  const addToCart = (product, variant) => {
    setCartItems((prev) => {
      const index = prev.findIndex((i) => i.variant.SKU === variant.SKU);

      if (index !== -1) {
        const copy = [...prev];
        copy[index].qty += 1;
        return copy;
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
     TOTAL
  ---------------------------------- */
  const totalAmount = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <div className="p-6 bg-gray-50 dark:bg-[#09090B] min-h-screen">
      <h1 className="text-xl font-semibold mb-6 dark:text-white">Cart</h1>

      <div className="grid grid-cols-12 gap-6">
        {/* ================= LEFT: PRODUCTS ================= */}
        <div className="col-span-12 lg:col-span-9">
          {loading ? (
            <p className="text-sm text-gray-500">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-sm text-gray-500">No products found</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p._id}
                  onClick={() => {
                    setSelectedProduct(p);
                    setShowVariantsModal(true);
                  }}
                  className="cursor-pointer bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-lg transition"
                >
                  {/* IMAGE */}
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

                  {/* DETAILS */}
                  <div className="p-4 space-y-1">
                    <h3 className="font-semibold dark:text-white">{p.name}</h3>

                    <p className="text-xs text-gray-500">
                      {p.brand?.name || "-"}
                    </p>

                    <p className="text-sm font-medium">₹{p.sellingPrice}</p>

                    {/* SIZES */}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {[
                        ...new Set(
                          (p.varients || []).map((v) => v.size).filter(Boolean)
                        ),
                      ].map((size) => (
                        <span
                          key={size}
                          className="px-2 py-0.5 text-xs rounded bg-gray-200 dark:bg-[#2a2b31]"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= RIGHT: SELECTED PRODUCTS ================= */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-4 sticky top-20 max-w-sm">
            <h2 className="font-semibold mb-4 dark:text-white">
              Selected Products
            </h2>

            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-500">No items selected</p>
            ) : (
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.variant.SKU}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium dark:text-white">
                          {item.productName}
                        </p>
                        <p className="text-xs text-gray-500">
                          SKU: {item.variant.SKU}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.variant.size || "-"}
                          {item.variant.color && ` | ${item.variant.color}`}
                        </p>
                        <p className="text-xs">
                          ₹{item.price} × {item.qty}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.variant.SKU)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                <div className="border-t pt-3 flex justify-between font-semibold dark:text-white">
                  <span>Total</span>
                  <span>₹{totalAmount}</span>
                </div>

                <button className="w-full mt-3 px-4 py-2 rounded bg-black text-white dark:bg-white dark:text-black hover:opacity-90">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= VARIANTS MODAL ================= */}
      {showVariantsModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white dark:bg-[#111218] w-full max-w-4xl rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                {selectedProduct.name} – Variants
              </h2>
              <button
                onClick={() => setShowVariantsModal(false)}
                className="text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border">
                <thead className="bg-gray-100 dark:bg-[#181920]">
                  <tr>
                    <th className="px-3 py-2 text-left">SKU</th>
                    <th className="px-3 py-2 text-left">Size</th>
                    <th className="px-3 py-2 text-left">Color</th>
                    <th className="px-3 py-2 text-left">Price</th>
                    <th className="px-3 py-2 text-left">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {selectedProduct.varients.map((v, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2 font-medium">{v.SKU}</td>
                      <td className="px-3 py-2">{v.size || "-"}</td>
                      <td className="px-3 py-2">{v.color || "-"}</td>
                      <td className="px-3 py-2">₹{v.sizeSellingPrice}</td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => addToCart(selectedProduct, v)}
                          className="px-3 py-1 text-xs rounded bg-black text-white dark:bg-white dark:text-black hover:opacity-90"
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
        </div>
      )}
    </div>
  );
};

export default Cart;
