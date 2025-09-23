import React, { useState, useEffect } from "react";
import axios from "axios";

function EditPosts({ postId, onClose, onUpdated }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch post details
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/post/${postId}`);
        setPost(res.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching post:", err.message);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  // ✅ Handle update
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:5000/api/post/${postId}`,
        post
      );
      alert("✅ Post updated successfully!");
      onUpdated(res.data.post); // notify parent
      onClose();
    } catch (err) {
      console.error("❌ Error updating post:", err.message);
      alert("Failed to update post");
    }
  };

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (!post) return <p className="text-red-400">Post not found.</p>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-lg border border-gray-700">
        <h2 className="text-xl font-bold text-yellow-300 mb-4">✏️ Edit Post</h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="text"
            value={post.title}
            onChange={(e) => setPost({ ...post, title: e.target.value })}
            className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Post Title"
            required
          />

          <textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
            className="w-full p-2 border rounded h-32 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Post Description"
            required
          />

          <input
            type="number"
            value={post.index}
            onChange={(e) => setPost({ ...post, index: e.target.value })}
            className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Post Index"
            required
          />

          <input
            type="date"
            value={post.start_date?.substring(0, 10)}
            onChange={(e) => setPost({ ...post, start_date: e.target.value })}
            className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
            required
          />

          <input
            type="date"
            value={post.last_date?.substring(0, 10)}
            onChange={(e) => setPost({ ...post, last_date: e.target.value })}
            className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
            required
          />

          {/* 🔗 Useful Links */}
          <textarea
            value={post.useful_links?.join("\n") || ""}
            onChange={(e) =>
              setPost({
                ...post,
                useful_links: e.target.value
                  .split("\n")
                  .map((link) => link.trim())
                  .filter((link) => link !== ""),
              })
            }
            className="w-full p-2 border rounded h-24 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
            placeholder="Enter useful links (one per line)"
          />

          {/* Buttons */}
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

export default EditPosts;
