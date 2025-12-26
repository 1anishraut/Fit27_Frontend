import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../Utils/Constants";

/* ----------------------------------
   STYLES
---------------------------------- */
const inputClass =
  "w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-[#14151c] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white";

const selectClass = inputClass;

const UNIT_TYPES = ["Piece", "Pack", "Box", "Kg"];

/* ----------------------------------
   COMPONENT
---------------------------------- */
const CreateProduct = () => {
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  /* ---------------- FORM ---------------- */
  const [form, setForm] = useState({
    name: "",
    description: "",
    brand: "",
    productCategory: "",
    location: "",
    costPrice: "",
    sellingPrice: "",
    status: "active",
    // image: "",
  });

  /* ---------------- VARIANTS ---------------- */
  const [variants, setVariants] = useState([
    {
      SKU: "",
      size: "",
      color: "",
      type: "Piece", // ✅ NEW
      stock: "", // ✅ NEW
      stockAlert: "", // ✅ NEW
      sizeCostPrice: "",
      sizeSellingPrice: "",
    },
  ]);

  /* ----------------------------------
     FETCH DROPDOWNS
  ---------------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandRes, categoryRes, locRes] = await Promise.all([
          axios.get(`${BASE_URL}/product-brand/all`, { withCredentials: true }),
          axios.get(`${BASE_URL}/product-category/all`, {
            withCredentials: true,
          }),
          axios.get(`${BASE_URL}/location/all`, { withCredentials: true }),
        ]);

        setBrands(brandRes?.data?.data || []);
        setCategories(categoryRes?.data?.data || []);
        setLocations(locRes?.data?.data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load dropdown data");
      }
    };

    fetchData();
  }, []);

  /* ----------------------------------
     HANDLERS
  ---------------------------------- */
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleVariantChange = (i, field, value) => {
    const copy = [...variants];
    copy[i][field] =
      field === "SKU" || field === "size" ? value.toUpperCase() : value;
    setVariants(copy);
  };

  const addVariant = () =>
    setVariants((prev) => [
      ...prev,
      {
        SKU: "",
        size: "",
        color: "",
        sizeCostPrice: "",
        sizeSellingPrice: "",
      },
    ]);

  const removeVariant = (index) =>
    setVariants((prev) => prev.filter((_, i) => i !== index));

  /* ----------------------------------
     SUBMIT
  ---------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const activeVariants = variants.filter((v) => v.SKU);

    if (activeVariants.length === 0) {
      alert("At least one variant is required");
      return;
    }

    for (const v of activeVariants) {
      if (
        v.stock === "" ||
        v.type === "" ||
        v.sizeCostPrice === "" ||
        v.sizeSellingPrice === ""
      ) {
        alert("Variant stock, unit type & prices are required");
        return;
      }
    }

    if (!form.name || !form.brand || !form.productCategory || !form.location) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();

    Object.entries(form).forEach(([key, val]) => {
      if (val !== "" && val !== null && val !== undefined) {
        formData.append(key, val);
      }
    });

    formData.append(
      "varients",
      JSON.stringify(
        activeVariants.map((v) => ({
          SKU: v.SKU,
          size: v.size,
          color: v.color,
          type: v.type,
          stock: Number(v.stock),
          stockAlert: Number(v.stockAlert || 0),
          sizeCostPrice: Number(v.sizeCostPrice),
          sizeSellingPrice: Number(v.sizeSellingPrice),
        }))
      )
    );

    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setLoading(true);

      await axios.post(`${BASE_URL}/product/create`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Product created successfully");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------------------------
     UI
  ---------------------------------- */
  return (
    <div className="p-6 bg-gray-50 dark:bg-[#09090B] min-h-screen">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold">Create Product</h1>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-gray-500 hover:underline"
          >
            Cancel
          </button>
        </div>

        {/* BASIC INFO */}
        <div className="bg-white dark:bg-[#111218] rounded-xl p-6 space-y-4">
          <input
            name="name"
            placeholder="Product Name *"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className={`${inputClass} h-24`}
          />
          {/* 🔥 IMAGE UPLOAD (NEW) */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
            className={inputClass}
          />

          <div className="grid md:grid-cols-3 gap-4">
            <select
              name="productCategory"
              value={form.productCategory}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="">Select Category *</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <select
              name="brand"
              value={form.brand}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="">Select Brand *</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>

            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="">Select Location *</option>
              {locations.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.locationName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="number"
              name="costPrice"
              placeholder="Base Cost Price"
              value={form.costPrice}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              type="number"
              name="sellingPrice"
              placeholder="Base Selling Price *"
              value={form.sellingPrice}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* VARIANTS */}
        <div className="bg-white dark:bg-[#111218] rounded-xl p-6">
          <h2 className="font-semibold mb-3">Variants (Size-wise Pricing)</h2>

          {variants.map((v, i) => (
            <div key={i} className="grid md:grid-cols-5 gap-3 mb-3 items-end">
              <input
                placeholder="SKU *"
                value={v.SKU}
                onChange={(e) => handleVariantChange(i, "SKU", e.target.value)}
                className={inputClass}
              />

              <input
                placeholder="Size"
                value={v.size}
                onChange={(e) =>
                  handleVariantChange(i, "size", e.target.value.toUpperCase())
                }
                className={inputClass}
              />

              <input
                placeholder="Color"
                value={v.color}
                onChange={(e) =>
                  handleVariantChange(i, "color", e.target.value)
                }
                className={inputClass}
              />

              <input
                type="number"
                placeholder="Size Cost Price *"
                value={v.sizeCostPrice}
                onChange={(e) =>
                  handleVariantChange(i, "sizeCostPrice", e.target.value)
                }
                className={inputClass}
              />

              <input
                type="number"
                placeholder="Size Selling Price *"
                value={v.sizeSellingPrice}
                onChange={(e) =>
                  handleVariantChange(i, "sizeSellingPrice", e.target.value)
                }
                className={inputClass}
              />
              <select
                value={v.type}
                onChange={(e) => handleVariantChange(i, "type", e.target.value)}
                className={selectClass}
              >
                {UNIT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Stock *"
                value={v.stock}
                onChange={(e) =>
                  handleVariantChange(i, "stock", e.target.value)
                }
                className={inputClass}
              />

              <input
                type="number"
                placeholder="Stock Alert"
                value={v.stockAlert}
                onChange={(e) =>
                  handleVariantChange(i, "stockAlert", e.target.value)
                }
                className={inputClass}
              />

              <button
                type="button"
                onClick={() => removeVariant(i)}
                disabled={variants.length === 1}
                className="text-red-500 text-sm border rounded-2xl py-1 mx-6 hover:bg-red-400 hover:text-white transition-all duration-300"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addVariant}
            className="text-blue-600 text-sm"
          >
            + Add Variant
          </button>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded-lg disabled:opacity-50"
          >
            {loading ? "Saving..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
