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
    image: "",
  });

  /* ---------------- UNITS ---------------- */
  const [units, setUnits] = useState([
    { type: "Piece", stock: "", stockAlert: "" },
  ]);

  /* ---------------- VARIANTS ---------------- */
  const [variants, setVariants] = useState([{ SKU: "", size: "", color: "" }]);

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

  const handleUnitChange = (index, field, value) => {
    const copy = [...units];
    copy[index][field] = value;
    setUnits(copy);
  };

  const handleVariantChange = (index, field, value) => {
    const copy = [...variants];
    copy[index][field] = value;
    setVariants(copy);
  };

  const addUnit = () =>
    setUnits((prev) => [...prev, { type: "Piece", stock: "", stockAlert: "" }]);

  const removeUnit = (index) =>
    setUnits((prev) => prev.filter((_, i) => i !== index));

  const addVariant = () =>
    setVariants((prev) => [...prev, { SKU: "", size: "", color: "" }]);

  const removeVariant = (index) =>
    setVariants((prev) => prev.filter((_, i) => i !== index));

  /* ----------------------------------
     SUBMIT
  ---------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    /* ✅ CORRECT VALIDATION */
    const hasValidUnit = units.some((u) => u.type && u.stock !== "");

    if (
      !form.name ||
      form.sellingPrice === "" ||
      !form.brand ||
      !form.productCategory ||
      !form.location ||
      !hasValidUnit
    ) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      ...form,
      costPrice: Number(form.costPrice || 0),
      sellingPrice: Number(form.sellingPrice),
      unit: units.map((u) => ({
        type: u.type,
        stock: Number(u.stock || 0),
        stockAlert: Number(u.stockAlert || 0),
      })),
      varients: variants.filter((v) => v.SKU),
    };

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/product/create`, payload, {
        withCredentials: true,
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
              placeholder="Cost Price"
              value={form.costPrice}
              onChange={handleChange}
              className={inputClass}
            />
            <input
              type="number"
              name="sellingPrice"
              placeholder="Selling Price *"
              value={form.sellingPrice}
              onChange={handleChange}
              className={inputClass}
            />
          </div>
        </div>

        {/* VARIANTS */}
        <div className="bg-white dark:bg-[#111218] rounded-xl p-6">
          <h2 className="font-semibold mb-3">Variants (SKU)</h2>

          {variants.map((v, i) => (
            <div key={i} className="grid md:grid-cols-4 gap-3 mb-3">
              <input
                placeholder="SKU"
                value={v.SKU}
                onChange={(e) => handleVariantChange(i, "SKU", e.target.value)}
                className={inputClass}
              />
              <input
                placeholder="Size"
                value={v.size}
                onChange={(e) => handleVariantChange(i, "size", e.target.value)}
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
              <button
                type="button"
                onClick={() => removeVariant(i)}
                disabled={variants.length === 1}
                className="text-red-500 text-sm"
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

        {/* UNITS */}
        <div className="bg-white dark:bg-[#111218] rounded-xl p-6">
          <h2 className="font-semibold mb-3">Units & Stock</h2>

          {units.map((u, i) => (
            <div key={i} className="grid md:grid-cols-4 gap-3 mb-3">
              <select
                value={u.type}
                onChange={(e) => handleUnitChange(i, "type", e.target.value)}
                className={selectClass}
              >
                {UNIT_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Stock *"
                value={u.stock}
                onChange={(e) => handleUnitChange(i, "stock", e.target.value)}
                className={inputClass}
              />

              <input
                type="number"
                placeholder="Stock Alert"
                value={u.stockAlert}
                onChange={(e) =>
                  handleUnitChange(i, "stockAlert", e.target.value)
                }
                className={inputClass}
              />

              <button
                type="button"
                onClick={() => removeUnit(i)}
                disabled={units.length === 1}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addUnit}
            className="text-blue-600 text-sm"
          >
            + Add Unit
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
