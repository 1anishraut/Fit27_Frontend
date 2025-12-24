import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../../Utils/Constants";

const inputClass =
  "w-full border border-gray-300 dark:border-gray-700 rounded-md px-3 py-2 text-sm bg-white dark:bg-[#14151c] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white";

const selectClass = inputClass;

const UNIT_TYPES = ["Piece", "Pack", "Box", "Kg"];

const CreateProduct = () => {
  const navigate = useNavigate();

  const [brands, setBrands] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    SKU: "",
    description: "",
    brand: "",
    location: "",
    costPrice: "",
    sellingPrice: "",
    status: "active",
    image: "",
  });

  const [units, setUnits] = useState([
    { type: "Piece", stock: "", stockAlert: "" },
  ]);

  /* ----------------------------------
     FETCH DROPDOWNS
  ---------------------------------- */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [brandRes, locRes] = await Promise.all([
          axios.get(`${BASE_URL}/product-brand/all`, {
            withCredentials: true,
          }),
          axios.get(`${BASE_URL}/location/all`, {
            withCredentials: true,
          }),
        ]);

        setBrands(brandRes?.data?.data || []);
        setLocations(locRes?.data?.data || []);
      } catch (err) {
        console.error(err);
        alert("Failed to load dropdown data");
      }
    };

    fetchData();
  }, []);

  /* ----------------------------------
     FORM HANDLERS
  ---------------------------------- */
  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleUnitChange = (index, field, value) => {
    setUnits((prev) => {
      const copy = [...prev];
      copy[index][field] = value;
      return copy;
    });
  };

  const addUnit = () => {
    setUnits((prev) => [...prev, { type: "Piece", stock: "", stockAlert: "" }]);
  };

  const removeUnit = (index) => {
    setUnits((prev) => prev.filter((_, i) => i !== index));
  };

  /* ----------------------------------
     SUBMIT
  ---------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.SKU || !form.sellingPrice) {
      alert("Name, SKU and Selling Price are required");
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

  return (
    <div className="p-6 bg-gray-50 dark:bg-[#09090B] min-h-screen">
      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Create Product
          </h1>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-gray-600 dark:text-gray-300 hover:underline"
          >
            Cancel
          </button>
        </div>

        {/* BASIC INFO */}
        <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              name="name"
              placeholder="Product Name *"
              value={form.name}
              onChange={handleChange}
              className={inputClass}
            />

            <input
              name="SKU"
              placeholder="SKU *"
              value={form.SKU}
              onChange={handleChange}
              className={inputClass}
            />

            <select
              name="brand"
              value={form.brand}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="">Select Brand</option>
              {brands.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>

            <input
              name="costPrice"
              type="number"
              placeholder="Cost Price"
              value={form.costPrice}
              onChange={handleChange}
              className={inputClass}
            />

            <input
              name="sellingPrice"
              type="number"
              placeholder="Selling Price *"
              value={form.sellingPrice}
              onChange={handleChange}
              className={inputClass}
            />

            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              className={selectClass}
            >
              <option value="">Select Location</option>
              {locations.map((l) => (
                <option key={l._id} value={l._id}>
                  {l.locationName}
                </option>
              ))}
            </select>
          </div>

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className={`${inputClass} mt-4 h-24`}
          />
        </div>

        {/* UNITS */}
        <div className="bg-white dark:bg-[#111218] border border-gray-200 dark:border-gray-700 rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
            Units & Stock
          </h2>

          <div className="space-y-3">
            {units.map((u, i) => (
              <div
                key={i}
                className="grid grid-cols-1 md:grid-cols-4 gap-3 items-center bg-gray-50 dark:bg-[#181920] p-3 rounded-lg"
              >
                <select
                  value={u.type}
                  onChange={(e) => handleUnitChange(i, "type", e.target.value)}
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
                  placeholder="Stock"
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
                  className="text-red-500 text-sm hover:underline"
                  disabled={units.length === 1}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addUnit}
            className="mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            + Add Unit
          </button>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-black text-white dark:bg-white dark:text-black text-sm hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
