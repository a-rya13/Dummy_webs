import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Editheader({ headerId, onClose, onUpdated }) {
  const [header, setHeader] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch header details
  useEffect(() => {
    const fetchHeader = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/headers/${headerId}`
        );
        setHeader(res.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching header:", err.message);
        setLoading(false);
      }
    };
    fetchHeader();
  }, [headerId]);

  // ✅ Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5000/api/headers/${headerId}`,
        header
      );
      toast.success("✅ Header updated successfully!");
      onUpdated(res.data.header); // notify parent
      onClose();
    } catch (err) {
      console.error("❌ Error updating header:", err.message);
      toast.error(err.response?.data?.message || "Failed to update header");
    }
  };

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (!header) return <p className="text-red-400">Header not found.</p>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md border border-gray-700">
        <h2 className="text-xl font-bold text-yellow-300 mb-4">
          ✏️ Edit Header
        </h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            value={header.name}
            onChange={(e) => setHeader({ ...header, name: e.target.value })}
            className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Header Name"
            required
          />

          <input
            type="number"
            value={header.index}
            onChange={(e) => setHeader({ ...header, index: e.target.value })}
            className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Header Index"
            required
          />

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Editheader;
