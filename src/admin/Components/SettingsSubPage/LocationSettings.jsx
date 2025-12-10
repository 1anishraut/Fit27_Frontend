// src/admin/Settings/LocationSettings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../Utils/Constants";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

export default function LocationSettings() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    locationName: "",
    addressLine1: "",
    addressLine2: "",
    country: "",
    state: "",
  });

  /* -----------------------------------------
     FETCH LOCATIONS
  ------------------------------------------ */
  const fetchLocations = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/location/all`, {
        withCredentials: true,
      });

      setLocations(res.data.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  /* -----------------------------------------
     HANDLE INPUT
  ------------------------------------------ */
  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* -----------------------------------------
     OPEN ADD MODAL
  ------------------------------------------ */
  const openAddModal = () => {
    setEditingId(null);
    setForm({
      locationName: "",
      addressLine1: "",
      addressLine2: "",
      country: "",
      state: "",
    });
    setModalOpen(true);
  };

  /* -----------------------------------------
     OPEN EDIT MODAL
  ------------------------------------------ */
  const openEditModal = (loc) => {
    setEditingId(loc._id);
    setForm({
      locationName: loc.locationName || "",
      addressLine1: loc.addressLine1 || "",
      addressLine2: loc.addressLine2 || "",
      country: loc.country || "",
      state: loc.state || "",
    });
    setModalOpen(true);
  };

  /* -----------------------------------------
     SAVE LOCATION (ADD OR EDIT)
  ------------------------------------------ */
  const saveLocation = async () => {
    try {
      if (!form.locationName.trim()) {
        alert("Location name is required");
        return;
      }

      if (editingId) {
        // UPDATE
        await axios.patch(`${BASE_URL}/location/update/${editingId}`, form, {
          withCredentials: true,
        });
        alert("Location updated successfully");
      } else {
        // CREATE
        await axios.post(`${BASE_URL}/location/create`, form, {
          withCredentials: true,
        });
        alert("Location created successfully");
      }

      setModalOpen(false);
      fetchLocations();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || "Failed to save location");
    }
  };

  /* -----------------------------------------
     DELETE LOCATION
  ------------------------------------------ */
  const deleteLocation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location?"))
      return;

    try {
      await axios.delete(`${BASE_URL}/location/delete/${id}`, {
        withCredentials: true,
      });
      alert("Location deleted");
      fetchLocations();
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Location Settings</h1>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FiPlus /> Add New Location
        </button>
      </div>

      {/* Locations Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Location Name</th>
              <th className="px-4 py-2">Address Line 1</th>
              <th className="px-4 py-2">Address Line 2</th>
              <th className="px-4 py-2">Country</th>
              <th className="px-4 py-2">State</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {locations.map((loc) => (
              <tr key={loc._id} className="border-b">
                <td className="px-4 py-2">{loc.locationName}</td>
                <td className="px-4 py-2">{loc.addressLine1 || "-"}</td>
                <td className="px-4 py-2">{loc.addressLine2 || "-"}</td>
                <td className="px-4 py-2">{loc.country || "-"}</td>
                <td className="px-4 py-2">{loc.state || "-"}</td>

                <td className="px-4 py-2 text-center">
                  <button
                    onClick={() => openEditModal(loc)}
                    className="text-blue-600 hover:text-blue-800 mr-3"
                  >
                    <FiEdit2 size={18} />
                  </button>

                  <button
                    onClick={() => deleteLocation(loc._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {locations.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No locations found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal (Add / Edit) */}
      {modalOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setModalOpen(false)}
          ></div>

          <div className="fixed z-50 bg-white p-6 rounded-xl w-full max-w-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Location" : "Add New Location"}
            </h2>

            <div className="grid gap-4">
              {[
                { key: "locationName", label: "Location Name" },
                { key: "addressLine1", label: "Address Line 1" },
                { key: "addressLine2", label: "Address Line 2" },
                { key: "country", label: "Country" },
                { key: "state", label: "State" },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block mb-1">{field.label}</label>
                  <input
                    type="text"
                    value={form[field.key]}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    className="w-full border px-3 py-2 rounded-lg"
                  />
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={saveLocation}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
