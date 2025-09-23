import React, { useState, useEffect } from "react";
import axios from "axios";
import EditPosts from "./EditPosts"; // ✅ import the component

function ManagePosts() {
  const [headers, setHeaders] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedHeader, setSelectedHeader] = useState("");
  const [viewPosts, setViewPosts] = useState(false);

  const [postName, setPostName] = useState("");
  const [postDetails, setPostDetails] = useState("");
  const [postIndex, setPostIndex] = useState("");
  const [startDate, setStartDate] = useState("");
  const [lastDate, setLastDate] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [usefulLinks, setUsefulLinks] = useState([""]);

  // ✅ edit modal state
  const [editPostId, setEditPostId] = useState(null);

  // ✅ Fetch headers & posts
  useEffect(() => {
    const fetchHeadersAndPosts = async () => {
      try {
        const [headersRes, postsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/headers"),
          axios.get("http://localhost:5000/api/post"),
        ]);
        setHeaders(headersRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        console.error("❌ Error fetching data:", err.message);
      }
    };
    fetchHeadersAndPosts();
  }, []);

  // ✅ Formatting
  const applyFormat = (format) => {
    const textarea = document.getElementById("postDetails");
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = postDetails.substring(start, end);

    let formattedText = selectedText;
    if (format === "bold") formattedText = `<b>${selectedText}</b>`;
    if (format === "italic") formattedText = `<i>${selectedText}</i>`;
    if (format === "underline") formattedText = `<u>${selectedText}</u>`;

    const newText =
      postDetails.substring(0, start) +
      formattedText +
      postDetails.substring(end);

    setPostDetails(newText);
  };

  // ✅ Add / Remove links
  const handleLinkChange = (index, value) => {
    const newLinks = [...usefulLinks];
    newLinks[index] = value;
    setUsefulLinks(newLinks);
  };

  const addLinkField = () => setUsefulLinks([...usefulLinks, ""]);
  const removeLinkField = (index) => {
    const newLinks = usefulLinks.filter((_, i) => i !== index);
    setUsefulLinks(newLinks.length > 0 ? newLinks : [""]);
  };

  // ✅ Save Post
  const handleSavePost = async () => {
    if (
      !postName ||
      !postDetails ||
      !postIndex ||
      !startDate ||
      !lastDate ||
      !selectedHeader
    ) {
      return alert("⚠️ Please fill all fields and select a header!");
    }

    try {
      const newPost = {
        title: postName,
        category: selectedHeader,
        description: postDetails,
        index: postIndex,
        useful_links: usefulLinks.filter((link) => link.trim() !== ""),
        start_date: startDate,
        last_date: lastDate,
      };

      const res = await axios.post("http://localhost:5000/api/post", newPost);

      setPosts([...posts, res.data.post]);
      setPostName("");
      setPostDetails("");
      setPostIndex("");
      setStartDate("");
      setLastDate("");
      setAttachments([]);
      setUsefulLinks([""]);

      alert("✅ Post saved successfully!");
    } catch (err) {
      console.error("❌ Error saving post:", err.response?.data || err.message);
      alert("Failed to save post");
    }
  };

  // ✅ Delete Post
  const handleDeletePost = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/post/${id}`);
      setPosts(posts.filter((p) => p._id !== id));
    } catch (err) {
      console.error("❌ Error deleting post:", err.message);
    }
  };

  return (
    <section className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 flex flex-col border border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-yellow-300">
        📰 Manage Posts
      </h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setViewPosts(false)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition"
        >
          ➕ Add Post
        </button>
        <button
          onClick={() => setViewPosts(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-800 transition"
        >
          📂 View Posts
        </button>
      </div>

      {/* Add Post Form */}
      {!viewPosts && (
        <div className="space-y-4">
          <select
            value={selectedHeader}
            onChange={(e) => setSelectedHeader(e.target.value)}
            className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Header</option>
            {headers.map((h) => (
              <option key={h._id} value={h.name}>
                {h.index}. {h.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Post Name"
            value={postName}
            onChange={(e) => setPostName(e.target.value)}
            className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="number"
            placeholder="Post Index"
            value={postIndex}
            onChange={(e) => setPostIndex(e.target.value)}
            className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
          />

          {/* Formatting */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => applyFormat("bold")}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 font-bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => applyFormat("italic")}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 italic"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => applyFormat("underline")}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 underline"
            >
              U
            </button>
          </div>

          <textarea
            id="postDetails"
            placeholder="Post Details (max 500 chars)"
            value={postDetails}
            onChange={(e) => setPostDetails(e.target.value)}
            maxLength={500}
            className="w-full p-2 border rounded h-32 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
          ></textarea>

          {/* Links */}
          <div>
            <label className="text-gray-300 mb-2 block">🔗 Useful Links</label>
            {usefulLinks.map((link, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="url"
                  placeholder="Enter useful link"
                  value={link}
                  onChange={(e) => handleLinkChange(index, e.target.value)}
                  className="flex-1 p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeLinkField(index)}
                  className="bg-red-600 text-white px-3 rounded hover:bg-red-800"
                >
                  ✖
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addLinkField}
              className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-800"
            >
              ➕ Add Link
            </button>
          </div>

          {/* Dates */}
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="date"
            value={lastDate}
            onChange={(e) => setLastDate(e.target.value)}
            className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="file"
            multiple
            onChange={(e) => setAttachments(e.target.files)}
            className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={handleSavePost}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition w-full"
          >
            Save Post
          </button>
        </div>
      )}

      {/* View Posts */}
      {viewPosts && (
        <div className="space-y-4">
          <select
            value={selectedHeader}
            onChange={(e) => setSelectedHeader(e.target.value)}
            className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Header</option>
            {headers.map((h) => (
              <option key={h._id} value={h.name}>
                {h.index}. {h.name}
              </option>
            ))}
          </select>

          <ul className="space-y-3">
            {posts.filter((p) => p.category === selectedHeader).length === 0 ? (
              <p className="text-gray-400">No posts for this header.</p>
            ) : (
              posts
                .filter((p) => p.category === selectedHeader)
                .map((p) => (
                  <li
                    key={p._id}
                    className="flex justify-between items-center bg-gray-800 p-3 rounded-lg shadow"
                  >
                    <div>
                      <h3 className="font-bold">{p.title}</h3>
                      <div
                        dangerouslySetInnerHTML={{ __html: p.description }}
                      />
                      {p.useful_links?.length > 0 && (
                        <div className="mt-2 text-sm">
                          <p className="text-gray-300">🔗 Useful Links:</p>
                          <ul className="list-disc list-inside break-words">
                            {p.useful_links.map((link, idx) => (
                              <li key={idx}>
                                <a
                                  href={link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:underline break-all"
                                >
                                  {link}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <p className="text-xs text-gray-400">
                        Index: {p.index} | Start:{" "}
                        {new Date(p.start_date).toLocaleDateString()} | Last:{" "}
                        {new Date(p.last_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditPostId(p._id)}
                        className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(p._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))
            )}
          </ul>
        </div>
      )}

      {/* ✅ Edit Modal */}
      {editPostId && (
        <EditPosts
          postId={editPostId}
          onClose={() => setEditPostId(null)}
          onUpdated={(updatedPost) =>
            setPosts(
              posts.map((p) => (p._id === updatedPost._id ? updatedPost : p))
            )
          }
        />
      )}
    </section>
  );
}

export default ManagePosts;
