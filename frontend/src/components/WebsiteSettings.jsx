import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function WebsiteSettings() {
  const [websiteName, setWebsiteName] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // ✅ Fetch current website title from backend
  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/website`);
        if (res.data?.title) {
          setWebsiteName(res.data.title);
        }
      } catch (err) {
        console.error("❌ Error fetching website title:", err.message);
        toast.error("Failed to fetch website title ❌");
      }
    };
    fetchTitle();
  }, []);

  // ✅ Save updated title to backend
  const handleSave = async () => {
    if (!websiteName.trim()) {
      toast.warning("⚠️ Website name cannot be empty!");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/api/website`, {
        title: websiteName,
      });
      toast.success(`✅ Website name updated to: ${res.data.website.title}`);
    } catch (err) {
      console.error(
        "❌ Error saving website title:",
        err.response?.data || err.message
      );
      toast.error("Failed to update website name ❌");
    }
  };

  return (
    <section className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 flex flex-col border border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-yellow-300">
        🌐 Website Settings
      </h2>
      <input
        type="text"
        placeholder="Enter Website Name"
        value={websiteName}
        onChange={(e) => setWebsiteName(e.target.value)}
        className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 mb-4"
        id="websiteNameInput"
      />
      <button
        onClick={handleSave}
        className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition"
      >
        Save Website Name
      </button>
    </section>
  );
}

export default WebsiteSettings;
