// PostDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [websiteName, setWebsiteName] = useState("News Web");
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const normalizeUrl = (url) => {
    if (!url) return "";
    const trimmed = url.trim();
    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [siteRes, postRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/website`),
          axios.get(`${API_BASE_URL}/api/post/${id}`),
        ]);
        if (siteRes.data?.title) setWebsiteName(siteRes.data.title);
        setPost(postRes.data);
      } catch (err) {
        console.error("❌ Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <p className="text-gray-500 p-6">Loading...</p>;
  if (!post) return <p className="text-red-400 p-6">Post not found ❌</p>;

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col">
      {/* Top Navbar */}
      <header className="bg-green-300 shadow-lg px-6 py-6 flex justify-center items-center sticky top-0 z-50">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-wide text-center">
          {websiteName}
        </h1>
      </header>

      {/* Current Header Section */}
      <nav className="bg-orange-600 shadow-inner py-2 sticky top-[96px] z-40 px-4">
        <div className="flex items-center gap-3 min-w-max">
          <Link
            to="/"
            className="px-4 py-2 rounded-full font-semibold text-white hover:bg-orange-700 transition-all duration-300"
          >
            Home
          </Link>
          <span className="px-4 py-2 rounded-full font-semibold text-white">
            {post.category?.name || "Header"}
          </span>
        </div>
      </nav>

      {/* Scrollable Main Content, left-aligned */}
      <main className="flex-1 overflow-y-auto p-6 max-w-5xl mx-6 space-y-6">
        <h2 className="text-orange-600 text-2xl font-bold mb-2">
          {post.title}
        </h2>

        <div
          className="text-gray-800"
          dangerouslySetInnerHTML={{ __html: post.description }}
        />

        {post.attachments?.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {post.attachments.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${post.title} - ${i}`}
                className="w-full h-40 object-cover rounded-md border border-gray-300"
              />
            ))}
          </div>
        )}

        {post.pdfLink?.length > 0 && (
          <div>
            <h2 className="font-semibold text-orange-600 mb-2">PDF Links:</h2>
            <ul className="list-disc list-inside text-blue-500">
              {post.pdfLink.map((link, i) => (
                <li key={i}>
                  <a
                    href={normalizeUrl(link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    PDF {i + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {post.useful_links?.length > 0 && (
          <div>
            <h2 className="font-semibold text-orange-600 mb-2">
              Useful Links:
            </h2>
            <ul className="list-disc list-inside text-blue-500">
              {post.useful_links.map((link, i) => (
                <li key={i}>
                  <a
                    href={normalizeUrl(link)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    Link {i + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-sm text-gray-500 mt-4">
          🟢 Start: {new Date(post.start_date).toLocaleDateString()} <br />
          🔴 Last: {new Date(post.last_date).toLocaleDateString()}
        </p>

        {/* Back to Home */}
        <div className="mt-6 py-4 border-t border-gray-300 flex justify-start">
          <Link
            to="/"
            className="text-blue-500 font-semibold hover:text-blue-700 transition-all duration-300"
          >
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
