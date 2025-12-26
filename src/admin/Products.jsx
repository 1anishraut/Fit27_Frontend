import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";
import { RiDeleteBin6Line } from "react-icons/ri";

const Products = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [allSizes, setAllSizes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [skuSearch, setSkuSearch] = useState("");
  const debounceRef = useRef(null);

  /* ----------------------------------
     FETCH ALL PRODUCTS
  ---------------------------------- */
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/product/all`, {
        withCredentials: true,
      });

      const data = res?.data?.data || [];
      setProducts(data);

      const sizes = [
        ...new Set(
          data
            .flatMap((p) => p.varients || [])
            .map((v) => v.size)
            .filter(Boolean)
        ),
      ];
      setAllSizes(sizes);
    } catch (err) {
      console.error(err);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------
     SEARCH BY SKU (DEBOUNCED)
  ---------------------------------- */
  const searchBySKU = async (sku) => {
    if (!sku) {
      fetchProducts();
      return;
    }

    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/product/search`, {
        params: { sku },
        withCredentials: true,
      });

      setProducts(res?.data?.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to search by SKU");
    } finally {
      setLoading(false);
    }
  };

  const handleSkuChange = (e) => {
    const value = e.target.value;
    setSkuSearch(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      searchBySKU(value.trim());
    }, 300);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}/product/delete/${id}`, {
        withCredentials: true,
      });

      // remove deleted product from UI instantly
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-[#09090B] min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Products
        </h1>

        <button
          onClick={() => navigate("/adminDashboard/createProduct")}
          className="px-4 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm hover:opacity-90"
        >
          + Create New Product
        </button>
      </div>

      {/* SKU FILTER */}
      <div className="mb-4 bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Search by SKU
        </label>

        <div className="flex justify-between mt-6 ">
          <input
            type="text"
            value={skuSearch}
            onChange={handleSkuChange}
            placeholder="Type SKU (e.g. ABC123)"
            className="w-full md:w-96 border border-gray-300 dark:border-gray-700 rounded-md px-2 text-sm bg-white dark:bg-[#14151c] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white my-3"
          />

          {/* AVAILABLE SIZES */}
          {allSizes.length > 0 && (
            <div className=" bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Available Sizes
              </p>

              <div className="flex flex-wrap gap-2">
                {allSizes.map((size) => (
                  <span
                    key={size}
                    className="px-3 py-1 text-xs rounded-full bg-black text-white dark:bg-white dark:text-black"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-gray-600 dark:text-gray-300">
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="p-6 text-sm text-gray-600 dark:text-gray-300">
            No products found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 dark:bg-[#181920] text-gray-700 dark:text-gray-300">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-left">Sizes</th>
                  <th className="px-4 py-3 text-left">Stock</th>
                  <th className="px-4 py-3 text-left">Brand</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Created</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {products.map((p) => {
                  const totalStock = (p.unit || []).reduce(
                    (sum, u) => sum + (u.stock || 0),
                    0
                  );

                  const isLowStock = (p.unit || []).some(
                    (u) => u.stockAlert > 0 && u.stock <= u.stockAlert
                  );

                  return (
                    <tr
                      key={p._id}
                      className="hover:bg-gray-50 dark:hover:bg-[#1f1f23]"
                    >
                      <td className="px-4 py-3 font-medium">{p.name}</td>

                      <td className="px-4 py-3">
                        {p.varients?.length ? (
                          <div className="flex flex-wrap gap-1">
                            {[
                              ...new Set(
                                p.varients.map((v) => v.size).filter(Boolean)
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
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* ✅ STOCK (UI SAME, ONLY COLOR CHANGE) */}
                      <td
                        className={`px-4 py-3 font-medium ${
                          isLowStock
                            ? "text-red-600 dark:text-red-500"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {totalStock}
                      </td>

                      <td className="px-4 py-3">{p.brand?.name || "-"}</td>

                      <td className="px-4 py-3">₹{p.sellingPrice}</td>

                      <td className="px-4 py-3">
                        {p.status === "active" ? (
                          <span className="px-2 py-1 text-xs rounded bg-green-500 text-white">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded bg-red-500 text-white">
                            Inactive
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 text-gray-600 dark:text-gray-400">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => handleDeleteProduct(p._id)}
                          className="text-red-600 hover:text-red-700 transition"
                          title="Delete product"
                        >
                          <RiDeleteBin6Line size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
