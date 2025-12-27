import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../Utils/Constants";
import { RiDeleteBin6Line } from "react-icons/ri";


const inputClass =
  "w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-[#14151c] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white";

const ProductSettings = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const [brandName, setBrandName] = useState("");
  const [categoryForm, setCategoryForm] = useState({
    name: "",
    hsnCode: "",
    description: "",
  });

  /* ----------------------------------
     FETCH DATA
  ---------------------------------- */
  const fetchData = async () => {
    try {
      const [brandRes, categoryRes] = await Promise.all([
        axios.get(`${BASE_URL}/product-brand/all`, {
          withCredentials: true,
        }),
        axios.get(`${BASE_URL}/product-category/all`, {
          withCredentials: true,
        }),
      ]);

      setBrands(brandRes?.data?.data || []);
      setCategories(categoryRes?.data?.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load product settings");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ----------------------------------
     CREATE BRAND
  ---------------------------------- */
  const createBrand = async () => {
    if (!brandName.trim()) return alert("Brand name is required");

    try {
      await axios.post(
        `${BASE_URL}/product-brand/create`,
        { name: brandName },
        { withCredentials: true }
      );

      setBrandName("");
      fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create brand");
    }
  };

  /* ----------------------------------
     CREATE CATEGORY
  ---------------------------------- */
  const createCategory = async () => {
    if (!categoryForm.name || !categoryForm.hsnCode) {
      return alert("Name and HSN Code are required");
    }

    try {
      await axios.post(`${BASE_URL}/product-category/create`, categoryForm, {
        withCredentials: true,
      });

      setCategoryForm({ name: "", hsnCode: "", description: "" });
      fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create category");
    }
  };
  /* ----------------------------------
   DELETE BRAND
---------------------------------- */
  const deleteBrand = async (id) => {
    if (!window.confirm("Delete this brand?")) return;

    try {
      await axios.delete(`${BASE_URL}/product-brand/delete/${id}`, {
        withCredentials: true,
      });
      fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete brand");
    }
  };

  /* ----------------------------------
   DELETE CATEGORY
---------------------------------- */
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      await axios.delete(`${BASE_URL}/product-category/delete/${id}`, {
        withCredentials: true,
      });
      fetchData();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-[#09090B] min-h-screen space-y-6">
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Product Settings
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= BRAND ================= */}
        <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Product Brands
          </h2>

          {/* CREATE */}
          <div className="flex gap-2 mb-4">
            <input
              placeholder="New brand name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className={inputClass}
            />
            <button
              onClick={createBrand}
              className="px-4 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black text-sm"
            >
              Add
            </button>
          </div>

          {/* LIST */}
          <ul className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
            {brands.length === 0 ? (
              <li className="py-3 text-gray-500">No brands found</li>
            ) : (
              brands.map((b) => (
                <li
                  key={b._id}
                  className="py-3 flex justify-between items-center"
                >
                  <span className="text-gray-800 dark:text-gray-200">
                    {b.name}
                  </span>

                  <button
                    onClick={() => deleteBrand(b._id)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete brand"
                  >
                    <RiDeleteBin6Line size={18} />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        {/* ================= CATEGORY ================= */}
        <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Product Categories
          </h2>

          {/* CREATE */}
          <div className="space-y-2 mb-4">
            <input
              placeholder="Category name"
              value={categoryForm.name}
              onChange={(e) =>
                setCategoryForm((p) => ({ ...p, name: e.target.value }))
              }
              className={inputClass}
            />

            <input
              placeholder="HSN Code"
              value={categoryForm.hsnCode}
              onChange={(e) =>
                setCategoryForm((p) => ({ ...p, hsnCode: e.target.value }))
              }
              className={inputClass}
            />

            <textarea
              placeholder="Description (optional)"
              value={categoryForm.description}
              onChange={(e) =>
                setCategoryForm((p) => ({
                  ...p,
                  description: e.target.value,
                }))
              }
              className={`${inputClass} h-20`}
            />

            <button
              onClick={createCategory}
              className="px-4 py-2 rounded-md bg-black text-white dark:bg-white dark:text-black text-sm"
            >
              Add Category
            </button>
          </div>

          {/* LIST */}
          <div className="divide-y divide-gray-200 dark:divide-gray-800 text-sm">
            {categories.length === 0 ? (
              <p className="py-3 text-gray-500">No categories found</p>
            ) : (
              categories.map((c) => (
                <div
                  key={c._id}
                  className="py-3 flex justify-between items-start gap-4"
                >
                  <div>
                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                      {c.name}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      HSN: {c.hsnCode}
                    </p>
                    {c.description && (
                      <p className="text-xs text-gray-500 mt-1">
                        {c.description}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteCategory(c._id)}
                    className="text-red-600 hover:text-red-800 mt-1"
                    title="Delete category"
                  >
                    <RiDeleteBin6Line size={18} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductSettings;
