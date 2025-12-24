import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="p-6 bg-gray-50 dark:bg-[#09090B] min-h-screen">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
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
                  <th className="px-4 py-3 text-left">SKU</th>
                  <th className="px-4 py-3 text-left">Brand</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Created</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {products.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-gray-50 dark:hover:bg-[#1f1f23]"
                  >
                    <td className="px-4 py-3 text-gray-900 dark:text-gray-100 font-medium">
                      {p.name}
                    </td>

                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {p.SKU}
                    </td>

                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {p.brand?.name || "-"}
                    </td>

                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      ₹{p.sellingPrice}
                    </td>

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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
