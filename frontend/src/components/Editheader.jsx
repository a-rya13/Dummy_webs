import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Editheader({ headerId, onClose, onUpdated }) {
  const [header, setHeader] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false); // controls confirmation popup
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // ✅ Fetch header details
  useEffect(() => {
    const fetchHeader = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/headers/${headerId}`);
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
        `${API_BASE_URL}/api/headers/${headerId}`,
        header
      );
      toast.success("✅ Header updated successfully!");
      onUpdated(res.data.header);
      onClose();
    } catch (err) {
      console.error("❌ Error updating header:", err.message);
      toast.error(err.response?.data?.message || "Failed to update header");
    }
  };

  // ✅ Handle delete
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/headers/${headerId}`);
      toast.success("🗑️ Header deleted successfully!");
      onUpdated({ _id: headerId, deleted: true });
      onClose();
    } catch (err) {
      console.error("❌ Error deleting header:", err.message);
      toast.error(err.response?.data?.message || "Failed to delete header");
    }
  };

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (!header) return <p className="text-red-400">Header not found.</p>;

  return (
    <>
      {/* Main Edit Header Modal */}
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
                onClick={() => setShowConfirm(true)} // open confirmation modal
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-800 transition"
              >
                Delete
              </button>
              <div className="flex gap-2">
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
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-60">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm text-center border border-gray-600">
            <h3 className="text-lg font-semibold text-red-400 mb-2">
              ⚠️ Confirm Deletion
            </h3>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete the header{" "}
              <span className="font-bold text-yellow-300">{header.name}</span>?
              <br />
              This action cannot be undone.
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-800 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Editheader;
