import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ContactUs from "../components/ContactUs";

export default function Home() {
  const [websiteName, setWebsiteName] = useState("News Web");
  const [headers, setHeaders] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedHeaderId, setSelectedHeaderId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const [siteRes, headersRes, postsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/website`),
          axios.get(`${API_BASE_URL}/api/headers`),
          axios.get(`${API_BASE_URL}/api/post`),
        ]);
        if (siteRes.data?.title) setWebsiteName(siteRes.data.title);
        setHeaders(Array.isArray(headersRes.data) ? headersRes.data : []);
        setPosts(Array.isArray(postsRes.data) ? postsRes.data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load content.");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const getPostsByHeader = (headerId) =>
    posts.filter(
      (p) => p.category === headerId && new Date(p.last_date) >= new Date()
    );

  const middlePosts = selectedHeaderId
    ? getPostsByHeader(selectedHeaderId)
    : posts.filter((p) => new Date(p.last_date) >= new Date());

  return (
    <div className="flex flex-col min-h-screen bg-white text-black font-sans">
      {/* Top Navbar */}
      <header className="bg-green-300 shadow-lg px-6 py-6 flex justify-center items-center sticky top-0 z-50">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide text-center">
          {websiteName}
        </h1>
      </header>

      {/* Second Navbar */}
      <nav className="bg-orange-500 shadow-inner py-2 sticky top-[96px] z-40 overflow-x-auto">
        <div className="flex gap-3 px-4 min-w-max">
          <button
            onClick={() => setSelectedHeaderId("")}
            className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 text-white ${
              selectedHeaderId === ""
                ? "bg-orange-600 shadow-lg"
                : "hover:bg-orange-700"
            }`}
          >
            Home
          </button>

          {headers.map((h) => (
            <button
              key={h._id}
              onClick={() => setSelectedHeaderId(h._id)}
              className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 text-white ${
                selectedHeaderId === h._id
                  ? "bg-orange-600 shadow-lg"
                  : "hover:bg-orange-700"
              }`}
            >
              {h.name}
            </button>
          ))}

          {/* Contact Us Button */}
          <button
            onClick={() =>
              document.getElementById("contact")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="px-4 py-2 rounded-full font-semibold transition-all duration-300 text-white hover:bg-orange-700"
          >
            Contact Us
          </button>
        </div>
      </nav>

      {/* Main Grid Layout */}
      <main className="flex-1 p-6">
        {loading ? (
          <p className="text-gray-500">Loading content...</p>
        ) : error ? (
          <p className="text-red-400">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 h-[calc(100vh-160px)]">
            {/* Left Column */}
            <div className="flex flex-col gap-6 col-span-1 h-full overflow-y-auto posts-scroll">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="bg-gray-100 p-4 rounded-lg shadow max-h-full overflow-y-auto"
                >
                  <h2 className="text-orange-600 font-bold mb-3 text-xl">
                    {headers[i]?.name || `Header ${i + 1}`}
                  </h2>
                  <ul className="space-y-2">
                    {getPostsByHeader(headers[i]?._id).map((p) => (
                      <li key={p._id}>
                        <Link
                          to={`/post/${p._id}`}
                          className="text-blue-500 hover:underline"
                        >
                          {p.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Middle Column */}
            <div className="bg-gray-50 p-6 rounded-lg shadow overflow-y-auto col-span-3 max-h-full">
              <h2 className="text-orange-600 font-bold mb-4 text-center text-2xl">
                {selectedHeaderId
                  ? headers.find((h) => h._id === selectedHeaderId)?.name
                  : "All Posts"}
              </h2>
              <ul className="space-y-2">
                {middlePosts.map((p) => (
                  <li key={p._id}>
                    <Link
                      to={`/post/${p._id}`}
                      className="text-blue-500 hover:underline"
                    >
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-6 col-span-1 h-full overflow-y-auto posts-scroll">
              {[2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-gray-100 p-4 rounded-lg shadow max-h-full overflow-y-auto"
                >
                  <h2 className="text-orange-600 font-bold mb-3 text-xl">
                    {headers[i]?.name || `Header ${i + 1}`}
                  </h2>
                  <ul className="space-y-2">
                    {getPostsByHeader(headers[i]?._id).map((p) => (
                      <li key={p._id}>
                        <Link
                          to={`/post/${p._id}`}
                          className="text-blue-500 hover:underline"
                        >
                          {p.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Contact Us Section */}
      <ContactUs />

      {/* Footer */}
      <footer className="bg-gray-200 text-gray-800 text-center py-4 border-t border-gray-300">
        <p>© 2025 {websiteName}. All rights reserved.</p>
      </footer>

      {/* Scrollbar CSS */}
      <style>{`
        .posts-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .posts-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .posts-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(107, 114, 128, 0.5);
          border-radius: 4px;
        }
        .posts-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(107, 114, 128, 0.8);
        }
      `}</style>
    </div>
  );
}
