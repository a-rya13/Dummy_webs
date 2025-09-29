import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import EditPosts from "./EditPosts";
import { toast } from "react-toastify";

/**
 * ManagePosts.jsx
 * - single activeTab ("add" | "view" | "expired")
 * - caret-safe contentEditable syncing
 * - useful link normalization so anchors open externally (not as localhost routes)
 * - minimal changes from your last version — only tab logic replaced
 */

export default function ManagePosts() {
  const [headers, setHeaders] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedHeader, setSelectedHeader] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Single tab control: "add" | "view" | "expired"
  const [activeTab, setActiveTab] = useState("add");

  // Add form state
  const [postName, setPostName] = useState("");
  const [postDetails, setPostDetails] = useState(""); // sanitized HTML
  const [postIndex, setPostIndex] = useState("");
  const [startDate, setStartDate] = useState("");
  const [lastDate, setLastDate] = useState("");

  // files and links
  const [imageFiles, setImageFiles] = useState([]);
  const [pdfFiles, setPdfFiles] = useState([]);
  const [usefulLinks, setUsefulLinks] = useState([""]);

  const [editPostId, setEditPostId] = useState(null);

  // loading & errors
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // contentEditable caret handling
  const postDetailsRef = useRef(null);
  const isFocusedRef = useRef(false);
  const [charCount, setCharCount] = useState(0);
  const CHAR_LIMIT = 500;

  // file input refs for clearing
  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  // ---------- fetch headers & posts ----------
  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      try {
        const [hRes, pRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/headers`),
          axios.get(`${API_BASE_URL}/api/post`),
        ]);
        if (!mounted) return;
        setHeaders(Array.isArray(hRes.data) ? hRes.data : []);
        setPosts(Array.isArray(pRes.data) ? pRes.data : []);
      } catch (err) {
        console.error("Failed to fetch headers/posts:", err);
        setError("Failed to fetch headers or posts.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => {
      mounted = false;
    };
  }, []);

  // Keep DOM contentEditable in sync (but only when not focused)
  useEffect(() => {
    const el = postDetailsRef.current;
    if (!el) return;
    if (!isFocusedRef.current) {
      const sanitized = DOMPurify.sanitize(postDetails || "");
      if (el.innerHTML !== sanitized) {
        el.innerHTML = sanitized;
        setCharCount(el.textContent?.length ?? 0);
      }
    }
  }, [postDetails]);

  // ---------- WYSIWYG formatting helpers ----------
  const applyFormat = (format) => {
    if (!postDetailsRef.current) return;
    if (format === "bold") document.execCommand("bold");
    if (format === "italic") document.execCommand("italic");
    if (format === "underline") document.execCommand("underline");

    const html = postDetailsRef.current.innerHTML;
    setPostDetails(DOMPurify.sanitize(html));
    setCharCount(postDetailsRef.current.textContent?.length ?? 0);
    postDetailsRef.current.focus();
  };

  const placeCaretAtEnd = (el) => {
    el.focus();
    if (
      typeof window.getSelection !== "undefined" &&
      typeof document.createRange !== "undefined"
    ) {
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    }
  };

  const handleEditableInput = (e) => {
    const el = e.currentTarget;
    const plain = el.textContent ?? "";
    if (plain.length > CHAR_LIMIT) {
      const trimmed = plain.slice(0, CHAR_LIMIT);
      el.textContent = trimmed;
      placeCaretAtEnd(el);
    }
    const sanitized = DOMPurify.sanitize(el.innerHTML);
    setPostDetails(sanitized);
    setCharCount(el.textContent?.length ?? 0);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text");
    document.execCommand("insertText", false, text);
  };

  // ---------- useful links handling ----------
  const handleLinkChange = (index, value) => {
    const arr = [...usefulLinks];
    arr[index] = value;
    setUsefulLinks(arr);
  };
  const addLinkField = () => setUsefulLinks((s) => [...s, ""]);
  const removeLinkField = (index) => {
    const arr = usefulLinks.filter((_, i) => i !== index);
    setUsefulLinks(arr.length ? arr : [""]);
  };

  // Normalize URL for anchors so they don't open relative to localhost
  const normalizeUrl = (url) => {
    if (!url) return "";
    const trimmed = url.trim();
    // If already has protocol or is mailto/tel, return as-is
    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)) return trimmed;
    // Otherwise add https://
    return `https://${trimmed}`;
  };

  // ---------- file handling ----------
  const onSelectImages = (e) => {
    const files = Array.from(e.target.files || []);
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (images.length) setImageFiles((s) => [...s, ...images]);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const onSelectPdfs = (e) => {
    const files = Array.from(e.target.files || []);
    const pdfs = files.filter((f) => f.type === "application/pdf");
    if (pdfs.length) setPdfFiles((s) => [...s, ...pdfs]);
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  };

  const removeImageAt = (index) =>
    setImageFiles((s) => s.filter((_, i) => i !== index));
  const removePdfAt = (index) =>
    setPdfFiles((s) => s.filter((_, i) => i !== index));

  // ---------- save post ----------
  const handleSavePost = async () => {
    const plainLen = postDetailsRef.current?.textContent?.length ?? 0;
    if (
      !postName ||
      !postDetails ||
      !postIndex ||
      !startDate ||
      !lastDate ||
      !selectedHeader
    ) {
      toast.error("Please fill all required fields and select a header.");
      return;
    }
    if (plainLen > CHAR_LIMIT) {
      toast.error(`Post content exceeds ${CHAR_LIMIT} characters.`);
      return;
    }

    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", postName);
      formData.append("category", selectedHeader); // backend expects id or name, keep your usage consistent
      formData.append("description", DOMPurify.sanitize(postDetails));
      formData.append("index", postIndex);
      formData.append("start_date", startDate);
      formData.append("last_date", lastDate);

      const links = usefulLinks.filter((l) => l.trim() !== "");
      formData.append("useful_links", JSON.stringify(links));

      imageFiles.forEach((f) => formData.append("attachments", f));
      pdfFiles.forEach((f) => formData.append("pdfLink", f));

      const res = await axios.post(`${API_BASE_URL}/api/post`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const created = res.data?.post ?? res.data;
      if (created) {
        setPosts((s) => [...s, created]);
      } else {
        const postsRes = await axios.get(`${API_BASE_URL}/api/post`);
        setPosts(Array.isArray(postsRes.data) ? postsRes.data : []);
      }

      // reset
      setPostName("");
      setPostDetails("");
      setPostIndex("");
      setStartDate("");
      setLastDate("");
      setImageFiles([]);
      setPdfFiles([]);
      setUsefulLinks([""]);
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (pdfInputRef.current) pdfInputRef.current.value = "";
      if (postDetailsRef.current) postDetailsRef.current.innerHTML = "";
      setCharCount(0);

      toast.success("Post saved successfully");
    } catch (err) {
      console.error("Save post error:", err?.response?.data ?? err.message);
      toast.error(err?.response?.data?.message || "Failed to save post");
    } finally {
      setActionLoading(false);
    }
  };

  // ---------- delete post ----------
  const handleDeletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    setActionLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/api/post/${id}`);
      setPosts((s) => s.filter((p) => p._id !== id));
      toast.success("Post deleted");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete post");
    } finally {
      setActionLoading(false);
    }
  };

  // helpers
  const headerLabel = (h) => `${h?.index ?? ""}. ${h?.name ?? "Unnamed"}`;

  const postMatchesHeader = (p, headerId) => {
    if (!headerId) return true;
    if (!p) return false;
    if (typeof p.category === "string") return p.category === headerId;
    if (p.category && typeof p.category === "object") {
      return p.category._id === headerId || p.category === headerId;
    }
    return false;
  };

  return (
    <section className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col border border-gray-700">
      {/* Scoped CSS for scrollbar + link wrapping */}
      <style>{`
        .posts-scroll {
          padding-right: 12px;
          box-sizing: border-box;
          scrollbar-width: thin;
          scrollbar-color: #374151 transparent;
        }
        .posts-scroll::-webkit-scrollbar { width: 10px; height:10px; }
        .posts-scroll::-webkit-scrollbar-track { background: transparent; border-radius: 999px; }
        .posts-scroll::-webkit-scrollbar-thumb { background-color: #374151; border-radius: 999px; border: 2px solid rgba(15,23,42,0.6); }
        .posts-scroll::-webkit-scrollbar-thumb:hover { background-color: #4b5563; }
        .break-all { word-break: break-word; overflow-wrap: anywhere; }
        .highlight-date { background: rgba(250,215,75,0.06); padding: 0.125rem 0.5rem; border-radius: 0.375rem; color: #f59e0b; display:inline-block; font-size:0.85rem; }
      `}</style>

      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-yellow-300">
        📰 Manage Posts
      </h2>

      {/* ---------- Buttons Row ---------- */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <button
          onClick={() => setActiveTab("add")}
          className={`flex-1 px-4 py-2 rounded-md text-sm sm:text-base transition ${
            activeTab === "add"
              ? "bg-blue-700 text-white"
              : "bg-blue-600 text-white hover:bg-blue-800"
          }`}
        >
          ➕ Add Post
        </button>

        <button
          onClick={() => setActiveTab("view")}
          className={`flex-1 px-4 py-2 rounded-md text-sm sm:text-base transition ${
            activeTab === "view"
              ? "bg-green-700 text-white"
              : "bg-green-600 text-white hover:bg-green-800"
          }`}
        >
          📂 View Posts
        </button>

        <button
          onClick={() => setActiveTab("expired")}
          className={`flex-1 px-4 py-2 rounded-md text-sm sm:text-base transition ${
            activeTab === "expired"
              ? "bg-red-700 text-white"
              : "bg-red-600 text-white hover:bg-red-800"
          }`}
        >
          ⏳ Expired Posts
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : null}

      {/* ---------- Add Post ---------- */}
      {activeTab === "add" && (
        <div className="space-y-4">
          <select
            value={selectedHeader}
            onChange={(e) => setSelectedHeader(e.target.value)}
            className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Header</option>
            {headers.map((h) => (
              <option key={h._id} value={h._id}>
                {headerLabel(h)}
              </option>
            ))}
          </select>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              value={postName}
              onChange={(e) => setPostName(e.target.value)}
              placeholder="Post Name"
              className="w-full p-2 border rounded bg-gray-900 text-white"
            />
            <input
              value={postIndex}
              onChange={(e) => setPostIndex(e.target.value)}
              placeholder="Post Index"
              type="number"
              className="w-full p-2 border rounded bg-gray-900 text-white"
            />

            <div className="flex gap-2 items-center sm:col-span-2">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFormat("bold")}
                className="px-3 py-1 bg-gray-700 rounded"
              >
                B
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFormat("italic")}
                className="px-3 py-1 bg-gray-700 rounded"
              >
                I
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFormat("underline")}
                className="px-3 py-1 bg-gray-700 rounded"
              >
                U
              </button>
              <div className="ml-auto text-xs text-gray-300">
                {charCount}/{CHAR_LIMIT}
              </div>
            </div>

            <div
              ref={postDetailsRef}
              id="postDetails"
              contentEditable
              suppressContentEditableWarning
              onInput={handleEditableInput}
              onPaste={handlePaste}
              onFocus={() => (isFocusedRef.current = true)}
              onBlur={() => {
                isFocusedRef.current = false;
                const sanitized = DOMPurify.sanitize(
                  postDetailsRef.current?.innerHTML ?? ""
                );
                setPostDetails(sanitized);
                setCharCount(postDetailsRef.current?.textContent?.length ?? 0);
              }}
              className="w-full p-2 border rounded h-40 sm:h-32 md:h-40 bg-gray-900 text-white col-span-1 sm:col-span-2 overflow-auto"
            />
          </div>

          <div>
            <label className="text-gray-300 mb-2 block">🔗 Useful Links</label>
            {usefulLinks.map((link, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => handleLinkChange(i, e.target.value)}
                  placeholder="https://example.com"
                  className="flex-1 p-2 border rounded bg-gray-900 text-white"
                />
                <button
                  type="button"
                  onClick={() => removeLinkField(i)}
                  className="bg-red-600 text-white px-3 rounded"
                >
                  ✖
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addLinkField}
              className="bg-green-600 text-white px-4 py-1 rounded"
            >
              ➕ Add Link
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded bg-gray-900 text-white"
            />
            <input
              type="date"
              value={lastDate}
              onChange={(e) => setLastDate(e.target.value)}
              className="w-full p-2 border rounded bg-gray-900 text-white"
            />
          </div>

          <div>
            <label className="text-gray-300 mb-2 block">🖼️ Attach Images</label>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={onSelectImages}
              className="w-full p-2 border rounded bg-gray-900 text-white"
            />
            {imageFiles.length > 0 && (
              <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {imageFiles.map((f, idx) => {
                  const url = URL.createObjectURL(f);
                  return (
                    <div key={idx} className="relative">
                      <img
                        src={url}
                        alt={f.name}
                        className="w-full h-20 object-cover rounded"
                        onLoad={() => URL.revokeObjectURL(url)}
                      />
                      <button
                        onClick={() => removeImageAt(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6"
                      >
                        ✖
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label className="text-gray-300 mb-2 block">📄 Attach PDFs</label>
            <input
              ref={pdfInputRef}
              type="file"
              accept="application/pdf"
              multiple
              onChange={onSelectPdfs}
              className="w-full p-2 border rounded bg-gray-900 text-white"
            />
            {pdfFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {pdfFiles.map((f, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-800 p-2 rounded"
                  >
                    <div className="text-sm truncate max-w-[60%]">{f.name}</div>
                    <div className="flex gap-2">
                      <a
                        href={URL.createObjectURL(f)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 underline text-sm"
                      >
                        Preview
                      </a>
                      <button
                        onClick={() => removePdfAt(idx)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleSavePost}
            disabled={actionLoading}
            className={`bg-blue-600 text-white px-4 py-2 rounded-md w-full ${
              actionLoading ? "opacity-70 cursor-wait" : ""
            }`}
          >
            {actionLoading ? "Saving..." : "Save Post"}
          </button>
        </div>
      )}

      {/* ---------- View Posts ---------- */}
      {activeTab === "view" && (
        <div className="space-y-4">
          <select
            value={selectedHeader}
            onChange={(e) => setSelectedHeader(e.target.value)}
            className="w-full p-2 border rounded bg-gray-900 text-white"
          >
            <option value="">Select Header</option>
            {headers.map((h) => (
              <option key={h._id} value={h._id}>
                {headerLabel(h)}
              </option>
            ))}
          </select>

          <ul className="space-y-3 max-h-[60vh] overflow-auto posts-scroll">
            {posts.filter((p) => postMatchesHeader(p, selectedHeader))
              .length === 0 ? (
              <p className="text-gray-400">No posts for this header.</p>
            ) : (
              posts
                .filter((p) => postMatchesHeader(p, selectedHeader))
                .map((p) => (
                  <li
                    key={p._id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-800 p-3 rounded-lg shadow"
                  >
                    <div className="w-full md:w-3/4">
                      <h3 className="font-bold text-sm md:text-base">
                        {p.title}
                      </h3>

                      <div
                        className="mt-1 text-sm text-gray-200"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(p.description || ""),
                        }}
                      />

                      {p.useful_links?.length > 0 && (
                        <div className="mt-2 text-sm">
                          <p className="text-gray-300">🔗 Useful Links:</p>
                          <ul className="list-disc list-inside">
                            {p.useful_links.map((link, idx) => {
                              const href = normalizeUrl(link);
                              return (
                                <li key={idx}>
                                  <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-400 hover:underline break-all"
                                  >
                                    {link}
                                  </a>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}

                      {p.attachments?.length > 0 && (
                        <div className="mt-2 flex gap-2 flex-wrap">
                          {p.attachments.map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt={`attachment-${i}`}
                              className="w-20 h-20 object-cover rounded"
                            />
                          ))}
                        </div>
                      )}

                      {p.pdfLink?.length > 0 && (
                        <div className="mt-2 text-sm">
                          <p className="text-gray-300">📄 PDFs:</p>
                          <ul className="list-disc list-inside">
                            {p.pdfLink.map((url, idx) => (
                              <li key={idx}>
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-400 hover:underline break-all"
                                >
                                  {url.split("/").pop() || `pdf-${idx + 1}`}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <p className="text-xs text-gray-400 mt-2">
                        Index: {p.index} | Start:{" "}
                        <span className="highlight-date">
                          {p.start_date
                            ? new Date(p.start_date).toLocaleDateString()
                            : "N/A"}
                        </span>{" "}
                        | Last:{" "}
                        <span className="highlight-date">
                          {p.last_date
                            ? new Date(p.last_date).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </p>
                    </div>

                    <div className="mt-3 md:mt-0 flex gap-2 md:flex-col md:items-end">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditPostId(p._id)}
                          className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(p._id)}
                          disabled={actionLoading}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800 text-sm"
                        >
                          {actionLoading ? "Working..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </li>
                ))
            )}
          </ul>
        </div>
      )}

      {/* ---------- Expired Posts ---------- */}
      {activeTab === "expired" && (
        <div className="mt-4 space-y-4">
          <select
            value={selectedHeader}
            onChange={(e) => setSelectedHeader(e.target.value)}
            className="w-full p-2 border rounded bg-gray-900 text-white"
          >
            <option value="">Select Header</option>
            {headers.map((h) => (
              <option key={h._id} value={h._id}>
                {headerLabel(h)}
              </option>
            ))}
          </select>

          <ul className="space-y-3 max-h-[60vh] overflow-auto posts-scroll">
            {posts.filter(
              (p) =>
                new Date(p.last_date) < new Date() &&
                (!selectedHeader || postMatchesHeader(p, selectedHeader))
            ).length === 0 ? (
              <p className="text-gray-400">No expired posts for this header.</p>
            ) : (
              posts
                .filter(
                  (p) =>
                    new Date(p.last_date) < new Date() &&
                    (!selectedHeader || postMatchesHeader(p, selectedHeader))
                )
                .map((p) => (
                  <li
                    key={p._id}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-800 p-3 rounded-lg shadow"
                  >
                    <div className="w-full md:w-3/4">
                      <h3 className="font-bold text-sm md:text-base">
                        {p.title}
                      </h3>
                      <div
                        className="mt-1 text-sm text-gray-200"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(p.description || ""),
                        }}
                      />
                      {p.useful_links?.length > 0 && (
                        <div className="mt-2 text-sm">
                          <p className="text-gray-300">🔗 Useful Links:</p>
                          <ul className="list-disc list-inside">
                            {p.useful_links.map((link, idx) => (
                              <li key={idx}>
                                <a
                                  href={normalizeUrl(link)}
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
                      <p className="text-xs text-gray-400 mt-2">
                        Index: {p.index} | Start:{" "}
                        <span className="highlight-date">
                          {p.start_date
                            ? new Date(p.start_date).toLocaleDateString()
                            : "N/A"}
                        </span>{" "}
                        | Last:{" "}
                        <span className="highlight-date">
                          {p.last_date
                            ? new Date(p.last_date).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </p>
                    </div>
                  </li>
                ))
            )}
          </ul>
        </div>
      )}

      {/* Edit modal */}
      {editPostId && (
        <EditPosts
          postId={editPostId}
          onClose={() => setEditPostId(null)}
          onUpdated={(updated) =>
            setPosts((prev) =>
              prev.map((p) => (p._id === updated._id ? updated : p))
            )
          }
        />
      )}
    </section>
  );
}
