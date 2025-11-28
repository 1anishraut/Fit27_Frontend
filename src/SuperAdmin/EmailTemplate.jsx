import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FiSearch,
  FiPlus,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
} from "react-icons/fi";

import { BASE_URL } from "../Utils/Constants";
import CreateEmailTemplateModal from "../SuperAdmin/Components/CreateEmailTemplateModal";
import EditEmailTemplateModal from "../SuperAdmin/Components/EditEmailTemplateModal";

export default function EmailTemplates() {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);

  const [templates, setTemplates] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  // ----------------------------------------
  // CLICK OUTSIDE TO CLOSE DROPDOWN
  // ----------------------------------------
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch templates
  const fetchTemplates = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/email-template/all`, {
        withCredentials: true,
      });
      setTemplates(res.data.data || []);
    } catch (err) {
      console.log("Fetch failed:", err);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  /* Search filter */
  const filtered = templates.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.emailType.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q)
    );
  });

  const paginated = filtered.slice(0, rowsPerPage);

  /* ============================
       DELETE TEMPLATE
  ============================= */
  const deleteTemplate = async (id) => {
    if (!window.confirm("Are you sure you want to delete this template?"))
      return;

    try {
      await axios.delete(`${BASE_URL}/email-template/delete/${id}`, {
        withCredentials: true,
      });

      alert("Template deleted!");
      fetchTemplates();
      setOpenMenuId(null);
    } catch (err) {
      console.log(err);
      alert("Failed to delete template");
    }
  };

  return (
    <div className="p-6 dark:bg-[#09090B] min-h-screen">
      {/* Header */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setOpen(true)}
          className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center rounded-lg"
        >
          <FiPlus size={20} />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#0D0D0F] p-4 rounded-xl shadow flex justify-between items-center">
        <div className="flex items-center gap-2">
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="border px-3 py-2 rounded-lg dark:bg-[#1f1f23] dark:text-gray-200"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span className="text-gray-600 dark:text-gray-400">
            entries per page
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <FiSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border rounded-lg dark:bg-[#1f1f23] dark:text-gray-200"
          />
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 bg-white dark:bg-[#0D0D0F] rounded-xl shadow overflow-visible pb-10">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-[#1f1f23] text-gray-700 dark:text-gray-300">
            <tr>
              <th className="p-3 text-left">EMAIL TYPE</th>
              <th className="p-3 text-left">SUBJECT</th>
              <th className="p-3 text-left">CREATED</th>
              <th className="p-3 text-left">ACTION</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-500">
                  No templates found
                </td>
              </tr>
            ) : (
              paginated.map((t) => (
                <tr key={t._id} className="border-b dark:border-gray-700">
                  <td className="p-3 capitalize">{t.emailType}</td>
                  <td className="p-3">{t.subject}</td>
                  <td className="p-3">
                    {new Date(t.createdAt).toLocaleDateString()}
                  </td>

                  {/* ACTION COLUMN */}
                  <td className="p-3 relative overflow-visible">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === t._id ? null : t._id)
                      }
                      className="p-2 rounded hover:bg-gray-200 dark:hover:bg-[#1f1f23]"
                    >
                      <FiMoreVertical size={18} />
                    </button>

                    {/* DROPDOWN */}
                    {openMenuId === t._id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 top-10 w-36 bg-white dark:bg-[#1f1f23] border dark:border-gray-700 rounded-lg shadow-lg z-[999]"
                      >
                        {/* EDIT */}
                        <button
                          onClick={() => {
                            setSelectedTemplateId(t._id);
                            setEditOpen(true);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center gap-2 px-3 py-2 w-full hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
                        >
                          <FiEdit2 size={16} /> Edit
                        </button>

                        {/* DELETE */}
                        <button
                          onClick={() => deleteTemplate(t._id)}
                          className="flex items-center gap-2 px-3 py-2 w-full text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
                        >
                          <FiTrash2 size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      <CreateEmailTemplateModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onCreated={fetchTemplates}
      />

      {/* Edit Modal */}
      <EditEmailTemplateModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        onUpdated={fetchTemplates}
        templateId={selectedTemplateId}
      />
    </div>
  );
}
