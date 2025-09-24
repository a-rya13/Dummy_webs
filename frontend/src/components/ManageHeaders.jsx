import React, { useState, useEffect } from "react";
import axios from "axios";
import Editheader from "../components/Editheader"; // ✅ consistent casing

function ManageHeaders() {
  const [headers, setHeaders] = useState([]);
  const [headerName, setHeaderName] = useState("");
  const [headerIndex, setHeaderIndex] = useState("");
  const [viewHeaders, setViewHeaders] = useState(false);
  const [editHeaderId, setEditHeaderId] = useState(null); // ✅ state for modal

  // ✅ Fetch headers from backend
  useEffect(() => {
    const fetchHeaders = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/headers");
        setHeaders(res.data);
      } catch (err) {
        console.error("❌ Error fetching headers:", err.message);
      }
    };
    fetchHeaders();
  }, []);

  // ✅ Save header
  const handleSaveHeader = async () => {
    if (!headerName || !headerIndex) return alert("⚠️ Fill all fields!");
    try {
      const res = await axios.post("http://localhost:5000/api/headers", {
        name: headerName,
        index: headerIndex,
      });
      setHeaders([...headers, res.data.header]);
      setHeaderName("");
      setHeaderIndex("");
      alert("✅ Header saved successfully!");
    } catch (err) {
      console.error("❌ Error saving header:", err.message);
      alert("Failed to save header");
    }
  };

  // ✅ Delete header (by name)
  const handleDeleteHeader = async (name) => {
    try {
      await axios.delete(`http://localhost:5000/api/headers/${name}`);
      setHeaders(headers.filter((h) => h.name !== name));
      alert(`🗑️ Header '${name}' deleted successfully!`);
    } catch (err) {
      console.error("❌ Error deleting header:", err.message);
    }
  };

  return (
    <section className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 flex flex-col border border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-yellow-300">
        📑 Manage Headers
      </h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setViewHeaders(false)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition"
        >
          Add Header
        </button>
        <button
          onClick={() => setViewHeaders(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-800 transition"
        >
          View Headers
        </button>
      </div>

      {!viewHeaders ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Header Name"
            value={headerName}
            onChange={(e) => setHeaderName(e.target.value)}
            className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Header Index (e.g., 1, 2, 3)"
            value={headerIndex}
            onChange={(e) => setHeaderIndex(e.target.value)}
            className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSaveHeader}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition w-full"
          >
            Save Header
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {headers.length === 0 ? (
            <p className="text-gray-400">No headers added yet.</p>
          ) : (
            headers.map((h) => (
              <li
                key={h._id}
                className="flex justify-between items-center bg-gray-800 p-3 rounded-lg shadow"
              >
                <span>
                  {h.index}. {h.name}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditHeaderId(h._id)} // ✅ open modal
                    className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteHeader(h.name)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      )}

      {/* ✅ Edit Modal */}
      {editHeaderId && (
        <Editheader
          headerId={editHeaderId}
          onClose={() => setEditHeaderId(null)}
          onUpdated={(updatedHeader) => {
            setHeaders(
              headers.map((h) =>
                h._id === updatedHeader._id ? updatedHeader : h
              )
            );
          }}
        />
      )}
    </section>
  );
}

export default ManageHeaders;
