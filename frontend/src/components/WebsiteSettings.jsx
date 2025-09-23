import React, { useState, useEffect } from "react";
import axios from "axios";

function WebsiteSettings() {
  const [websiteName, setWebsiteName] = useState("");

  // ✅ Fetch current website title from backend
  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/website");
        if (res.data?.title) {
          setWebsiteName(res.data.title);
        }
      } catch (err) {
        console.error("❌ Error fetching website title:", err.message);
      }
    };
    fetchTitle();
  }, []);

  // ✅ Save updated title to backend
  const handleSave = async () => {
    if (!websiteName.trim()) {
      alert("⚠️ Website name cannot be empty!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/website", {
        title: websiteName,
      });
      alert(`✅ Website name updated to: ${res.data.website.title}`);
    } catch (err) {
      console.error(
        "❌ Error saving website title:",
        err.response?.data || err.message
      );
      alert("Failed to update website name ❌");
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
