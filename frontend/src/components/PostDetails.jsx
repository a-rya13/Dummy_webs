// PostDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  // ✅ Helper to normalize links
  const normalizeUrl = (url) => {
    if (!url) return "";
    const trimmed = url.trim();
    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)) {
      return trimmed; // already has http://, https://, mailto:, etc.
    }
    return `https://${trimmed}`;
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/post/${id}`);
        setPost(res.data);
      } catch (err) {
        console.error("❌ Error fetching post:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return <p className="text-gray-400 p-6">Loading...</p>;
  if (!post) return <p className="text-red-400 p-6">Post not found ❌</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Link to="/" className="text-blue-400 hover:underline">
        ← Back to Home
      </Link>

      <div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">{post.title}</h2>

        <div
          className="text-gray-300 mb-4"
          dangerouslySetInnerHTML={{ __html: post.description }}
        />

        {post.attachments?.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
            {post.attachments.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${post.title} - ${i}`}
                className="w-full h-40 object-cover rounded-md border border-gray-700"
              />
            ))}
          </div>
        )}

        {post.pdfLink?.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-yellow-400">PDF Links:</h4>
            <ul className="list-disc list-inside text-blue-400">
              {post.pdfLink.map((link, i) => (
                <li key={i}>
                  <a
                    href={normalizeUrl(link)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    PDF {i + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {post.useful_links?.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold text-yellow-400">Useful Links:</h4>
            <ul className="list-disc list-inside text-blue-400">
              {post.useful_links.map((link, i) => (
                <li key={i}>
                  <a
                    href={normalizeUrl(link)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link {i + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-sm text-gray-400">
          🟢 Start: {new Date(post.start_date).toLocaleDateString()} <br />
          🔴 Last: {new Date(post.last_date).toLocaleDateString()} <br />
          🕒 Created: {new Date(post.createdAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
