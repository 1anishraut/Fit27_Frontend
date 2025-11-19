import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { MdErrorOutline } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import { BASE_URL } from "../Utils/Constants";
import { toast } from "react-toastify";

const Feedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [menuOpen, setMenuOpen] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [sortType, setSortType] = useState("newest");

  // Fetch feedbacks
  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(BASE_URL + "/feedback/all");
      const list = res?.data?.data || res?.data || [];
      setFeedbacks(list);
      setFiltered(list);
    } catch (error) {
      console.log("ERROR fetching feedbacks:", error);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  // Search filter
  useEffect(() => {
    let data = [...feedbacks];

    // Search apply
    if (searchText.trim()) {
      data = data.filter(
        (f) =>
          f.classSchedule?.toLowerCase().includes(searchText.toLowerCase()) ||
          f.user?.toLowerCase().includes(searchText.toLowerCase()) ||
          f.instructor?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Sorting apply
    if (sortType === "newest") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFiltered(data);
  }, [searchText, feedbacks, sortType]);

  const toggleMenu = (id) => {
    setMenuOpen(menuOpen === id ? null : id);
  };

  const handleDelete = async (id) => {
    const res = await axios.delete(BASE_URL + `/feedback/delete/${id}`, {
      withCredentials: true,
    });
    toast.success("Feedback deleted successfully!");
    fetchFeedbacks();
  };

  const handleEdit = (id) => {
    toast.success("Feedback updated successfully!");
  };

  return (
    <div className="p-6 relative">
      {/* Top Bar: Search + Sort */}
      <div className="flex items-center justify-between mb-4">
        {/* Search */}
        <div className="w-1/3">
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2">
            <input
              type="text"
              placeholder="Quick search"
              className="w-full outline-none text-sm"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <FiSearch className="text-gray-500 text-lg" />
          </div>
        </div>

        {/* Sort dropdown */}
        <div>
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none cursor-pointer"
          >
            <option  value="newest">Newest First</option>
            <option  value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded-lg overflow-visible">
        <table className="w-full text-sm">
          <thead className="text-gray-700 font-semibold border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left">Class Schedule</th>
              <th className="py-3 px-4 text-left">Instructor</th>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Comments</th>
              <th className="py-3 px-4 text-left">Rating</th>
              <th className="py-3 px-4 text-left">Time</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>

          {filtered.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={7}>
                  <div className="flex flex-col items-center justify-center py-16 text-gray-600">
                    <MdErrorOutline className="text-5xl text-gray-300 mb-2" />
                    <p>No feedbacks available</p>
                  </div>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {filtered.map((fb) => (
                <tr key={fb._id} className="border-b border-gray-200">
                  <td className="py-3 px-4">{fb.classSchedule}</td>
                  <td className="py-3 px-4">{fb.instructor}</td>
                  <td className="py-3 px-4">{fb.user}</td>
                  <td className="py-3 px-4">{fb.comments}</td>
                  <td className="py-3 px-4">{fb.rating} ⭐</td>
                  <td className="py-3 px-4">
                    {new Date(fb.createdAt).toLocaleString()}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right relative">
                    <button onClick={() => toggleMenu(fb._id)}>
                      <BsThreeDotsVertical className="text-xl cursor-pointer" />
                    </button>

                    {menuOpen === fb._id && (
                      <div className="absolute right-0 mt-2 w-28 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                        <button
                          onClick={() => handleEdit(fb._id)}
                          className="block px-4 py-2 text-left hover:bg-gray-100 w-full"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(fb._id)}
                          className="block px-4 py-2 text-left hover:bg-gray-100 text-red-600 w-full"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
};

export default Feedbacks;
