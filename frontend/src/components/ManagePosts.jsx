// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import DOMPurify from "dompurify";
// import EditPosts from "./EditPosts";

// function ManagePosts() {
//   const [headers, setHeaders] = useState([]);
//   const [posts, setPosts] = useState([]);
//   const [selectedHeader, setSelectedHeader] = useState("");
//   const [viewPosts, setViewPosts] = useState(false);

//   const [postName, setPostName] = useState("");
//   const [postDetails, setPostDetails] = useState("");
//   const [postIndex, setPostIndex] = useState("");
//   const [startDate, setStartDate] = useState("");
//   const [lastDate, setLastDate] = useState("");
//   const [attachments, setAttachments] = useState(null); // single File or null
//   const [usefulLinks, setUsefulLinks] = useState([""]);

//   // Edit modal
//   const [editPostId, setEditPostId] = useState(null);

//   // loading & action states
//   const [loading, setLoading] = useState(false); // initial fetch
//   const [actionLoading, setActionLoading] = useState(false); // save/delete/etc
//   const [error, setError] = useState(null);

//   // file input ref to reset after upload
//   const fileInputRef = useRef(null);

//   // textarea ref for possible cursor management later
//   const postDetailsRef = useRef(null);

//   // fetch headers & posts
//   useEffect(() => {
//     const fetchHeadersAndPosts = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const [headersRes, postsRes] = await Promise.all([
//           axios.get("http://localhost:5000/api/headers"),
//           axios.get("http://localhost:5000/api/post"),
//         ]);
//         setHeaders(headersRes.data || []);
//         setPosts(postsRes.data || []);
//       } catch (err) {
//         console.error("Error fetching data:", err);
//         setError("Failed to fetch headers or posts.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchHeadersAndPosts();
//   }, []);

//   // formatting helper: inserts HTML tags around selection in textarea
//   const applyFormat = (format) => {
//     const textarea = postDetailsRef.current;
//     if (!textarea) return;

//     const start = textarea.selectionStart;
//     const end = textarea.selectionEnd;
//     const selectedText = postDetails.substring(start, end);

//     let formattedText = selectedText;
//     if (format === "bold") formattedText = `<b>${selectedText}</b>`;
//     if (format === "italic") formattedText = `<i>${selectedText}</i>`;
//     if (format === "underline") formattedText = `<u>${selectedText}</u>`;

//     const newText =
//       postDetails.substring(0, start) + formattedText + postDetails.substring(end);

//     setPostDetails(newText);

//     // restore cursor after state update (best-effort)
//     requestAnimationFrame(() => {
//       const pos = start + formattedText.length;
//       textarea.focus();
//       textarea.setSelectionRange(pos, pos);
//     });
//   };

//   // links handling
//   const handleLinkChange = (index, value) => {
//     const newLinks = [...usefulLinks];
//     newLinks[index] = value;
//     setUsefulLinks(newLinks);
//   };

//   const addLinkField = () => setUsefulLinks([...usefulLinks, ""]);
//   const removeLinkField = (index) => {
//     const newLinks = usefulLinks.filter((_, i) => i !== index);
//     setUsefulLinks(newLinks.length > 0 ? newLinks : [""]);
//   };

//   // Save Post with FormData (multipart/form-data)
//   const handleSavePost = async () => {
//     if (
//       !postName ||
//       !postDetails ||
//       !postIndex ||
//       !startDate ||
//       !lastDate ||
//       !selectedHeader
//     ) {
//       return alert("⚠️ Please fill all fields and select a header!");
//     }

//     setActionLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append("title", postName);
//       formData.append("category", selectedHeader); // we send header _id
//       formData.append("description", postDetails);
//       formData.append("index", postIndex);
//       formData.append("start_date", startDate);
//       formData.append("last_date", lastDate);

//       const links = usefulLinks.filter((l) => l.trim() !== "");
//       formData.append("useful_links", JSON.stringify(links));

//       // append single file if present
//       const file = fileInputRef.current?.files?.[0];
//       if (file) {
//         formData.append("attachments", file); // single-file field
//       }

//       const res = await axios.post("http://localhost:5000/api/post", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       // add created post to state — adapt if backend returns different shape
//       const createdPost = res.data?.post ?? res.data;
//       if (createdPost) {
//         setPosts((prev) => [...prev, createdPost]);
//       } else {
//         // fallback: re-fetch list
//         const postsRes = await axios.get("http://localhost:5000/api/post");
//         setPosts(postsRes.data || []);
//       }

//       // reset fields
//       setPostName("");
//       setPostDetails("");
//       setPostIndex("");
//       setStartDate("");
//       setLastDate("");
//       setAttachments(null);
//       setUsefulLinks([""]);
//       if (fileInputRef.current) fileInputRef.current.value = "";

//       alert("✅ Post saved successfully!");
//     } catch (err) {
//       console.error("Error saving post:", err.response?.data ?? err.message);
//       alert("❌ Failed to save post");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // Delete post
//   const handleDeletePost = async (id) => {
//     if (!window.confirm("Delete this post?")) return;
//     setActionLoading(true);
//     try {
//       await axios.delete(`http://localhost:5000/api/post/${id}`);
//       setPosts((prev) => prev.filter((p) => p._id !== id));
//     } catch (err) {
//       console.error("Error deleting post:", err.message);
//       alert("❌ Failed to delete post");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   // helper to safely get display value for header option label
//   const headerLabel = (h) => `${h.index ?? ""}. ${h.name ?? "Unnamed"}`;

//   // filter helper: handle category stored as id, string, or object
//   const postMatchesHeader = (p, headerId) => {
//     if (!headerId) return true;
//     if (!p) return false;
//     if (typeof p.category === "string") return p.category === headerId;
//     if (typeof p.category === "object" && p.category !== null) {
//       return p.category._id === headerId || p.category === headerId;
//     }
//     return false;
//   };

//   return (
//     <section className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 flex flex-col border border-gray-700">
//       <h2 className="text-lg font-semibold mb-4 text-yellow-300">📰 Manage Posts</h2>

//       <div className="flex gap-4 mb-6">
//         <button
//           onClick={() => setViewPosts(false)}
//           className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition"
//           type="button"
//           aria-pressed={!viewPosts}
//         >
//           ➕ Add Post
//         </button>
//         <button
//           onClick={() => setViewPosts(true)}
//           className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-800 transition"
//           type="button"
//           aria-pressed={viewPosts}
//         >
//           📂 View Posts
//         </button>
//       </div>

//       {loading ? (
//         <p className="text-gray-400">Loading...</p>
//       ) : error ? (
//         <p className="text-red-400">{error}</p>
//       ) : null}

//       {/* Add Post Form */}
//       {!viewPosts && (
//         <div className="space-y-4">
//           <select
//             value={selectedHeader}
//             onChange={(e) => setSelectedHeader(e.target.value)}
//             className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
//             aria-label="Select Header"
//           >
//             <option value="">Select Header</option>
//             {headers.map((h) => (
//               <option key={h._id} value={h._id}>
//                 {headerLabel(h)}
//               </option>
//             ))}
//           </select>

//           <input
//             type="text"
//             placeholder="Post Name"
//             value={postName}
//             onChange={(e) => setPostName(e.target.value)}
//             className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
//           />

//           <input
//             type="number"
//             placeholder="Post Index"
//             value={postIndex}
//             onChange={(e) => setPostIndex(e.target.value)}
//             className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
//           />

//           {/* Formatting */}
//           <div className="flex gap-2">
//             <button
//               type="button"
//               onClick={() => applyFormat("bold")}
//               className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 font-bold"
//               aria-label="Bold"
//             >
//               B
//             </button>
//             <button
//               type="button"
//               onClick={() => applyFormat("italic")}
//               className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 italic"
//               aria-label="Italic"
//             >
//               I
//             </button>
//             <button
//               type="button"
//               onClick={() => applyFormat("underline")}
//               className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 underline"
//               aria-label="Underline"
//             >
//               U
//             </button>
//           </div>

//           <textarea
//             id="postDetails"
//             ref={postDetailsRef}
//             placeholder="Post Details (max 500 chars)"
//             value={postDetails}
//             onChange={(e) => setPostDetails(e.target.value)}
//             maxLength={500}
//             className="w-full p-2 border rounded h-32 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
//           />

//           {/* Links */}
//           <div>
//             <label className="text-gray-300 mb-2 block">🔗 Useful Links</label>
//             {usefulLinks.map((link, index) => (
//               <div key={index} className="flex gap-2 mb-2">
//                 <input
//                   type="url"
//                   placeholder="Enter useful link"
//                   value={link}
//                   onChange={(e) => handleLinkChange(index, e.target.value)}
//                   className="flex-1 p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => removeLinkField(index)}
//                   className="bg-red-600 text-white px-3 rounded hover:bg-red-800"
//                   aria-label={`Remove link ${index + 1}`}
//                 >
//                   ✖
//                 </button>
//               </div>
//             ))}
//             <button
//               type="button"
//               onClick={addLinkField}
//               className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-800"
//             >
//               ➕ Add Link
//             </button>
//           </div>

//           {/* Dates */}
//           <input
//             type="date"
//             value={startDate}
//             onChange={(e) => setStartDate(e.target.value)}
//             className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
//           />

//           <input
//             type="date"
//             value={lastDate}
//             onChange={(e) => setLastDate(e.target.value)}
//             className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
//           />

//           <input
//             type="file"
//             ref={fileInputRef}
//             onChange={(e) => {
//               const f = e.target.files && e.target.files[0];
//               setAttachments(f || null);
//             }}
//             className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
//             aria-label="Attachment"
//           />

//           <button
//             onClick={handleSavePost}
//             className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition w-full ${
//               actionLoading ? "opacity-70 cursor-wait" : ""
//             }`}
//             type="button"
//             disabled={actionLoading}
//           >
//             {actionLoading ? "Saving..." : "Save Post"}
//           </button>
//         </div>
//       )}

//       {/* View Posts */}
//       {viewPosts && (
//         <div className="space-y-4">
//           <select
//             value={selectedHeader}
//             onChange={(e) => setSelectedHeader(e.target.value)}
//             className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
//             aria-label="Select header to filter posts"
//           >
//             <option value="">Select Header</option>
//             {headers.map((h) => (
//               <option key={h._id} value={h._id}>
//                 {headerLabel(h)}
//               </option>
//             ))}
//           </select>

//           <ul className="space-y-3">
//             {posts.filter((p) => postMatchesHeader(p, selectedHeader)).length ===
//             0 ? (
//               <p className="text-gray-400">No posts for this header.</p>
//             ) : (
//               posts
//                 .filter((p) => postMatchesHeader(p, selectedHeader))
//                 .map((p) => (
//                   <li
//                     key={p._id}
//                     className="flex justify-between items-center bg-gray-800 p-3 rounded-lg shadow"
//                   >
//                     <div className="max-w-[75%]">
//                       <h3 className="font-bold">{p.title}</h3>

//                       {/* sanitize before dangerouslySetInnerHTML */}
//                       <div
//                         dangerouslySetInnerHTML={{
//                           __html: DOMPurify.sanitize(p.description || ""),
//                         }}
//                       />

//                       {p.useful_links?.length > 0 && (
//                         <div className="mt-2 text-sm">
//                           <p className="text-gray-300">🔗 Useful Links:</p>
//                           <ul className="list-disc list-inside break-words">
//                             {p.useful_links.map((link, idx) => (
//                               <li key={idx}>
//                                 <a
//                                   href={link}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="text-blue-400 hover:underline break-all"
//                                 >
//                                   {link}
//                                 </a>
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       )}

//                       <p className="text-xs text-gray-400 mt-2">
//                         Index: {p.index} | Start:{" "}
//                         {p.start_date ? new Date(p.start_date).toLocaleDateString() : "N/A"}{" "}
//                         | Last:{" "}
//                         {p.last_date ? new Date(p.last_date).toLocaleDateString() : "N/A"}
//                       </p>
//                     </div>

//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => setEditPostId(p._id)}
//                         className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600"
//                         type="button"
//                         aria-label={`Edit ${p.title}`}
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDeletePost(p._id)}
//                         className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
//                         type="button"
//                         aria-label={`Delete ${p.title}`}
//                         disabled={actionLoading}
//                       >
//                         {actionLoading ? "Working..." : "Delete"}
//                       </button>
//                     </div>
//                   </li>
//                 ))
//             )}
//           </ul>
//         </div>
//       )}

//       {/* Edit Modal */}
//       {editPostId && (
//         <EditPosts
//           postId={editPostId}
//           onClose={() => setEditPostId(null)}
//           onUpdated={(updatedPost) =>
//             setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)))
//           }
//         />
//       )}
//     </section>
//   );
// }

// export default ManagePosts;


import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import DOMPurify from "dompurify";
import EditPosts from "./EditPosts";

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

  // Now hold arrays for files
  const [imageFiles, setImageFiles] = useState([]); // images to upload
  const [pdfFiles, setPdfFiles] = useState([]); // pdfs to upload

  const [usefulLinks, setUsefulLinks] = useState([""]);

  // Edit modal
  const [editPostId, setEditPostId] = useState(null);

  // loading & action states
  const [loading, setLoading] = useState(false); // initial fetch
  const [actionLoading, setActionLoading] = useState(false); // save/delete/etc
  const [error, setError] = useState(null);

  // refs
  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const postDetailsRef = useRef(null);

  // fetch headers & posts
  useEffect(() => {
    const fetchHeadersAndPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const [headersRes, postsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/headers"),
          axios.get("http://localhost:5000/api/post"),
        ]);
        setHeaders(headersRes.data || []);
        setPosts(postsRes.data || []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch headers or posts.");
      } finally {
        setLoading(false);
      }
    };

    fetchHeadersAndPosts();
  }, []);

  // formatting helper: inserts HTML tags around selection in textarea
  const applyFormat = (format) => {
    const textarea = postDetailsRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = postDetails.substring(start, end);

    let formattedText = selectedText;
    if (format === "bold") formattedText = `<b>${selectedText}</b>`;
    if (format === "italic") formattedText = `<i>${selectedText}</i>`;
    if (format === "underline") formattedText = `<u>${selectedText}</u>`;

    const newText =
      postDetails.substring(0, start) + formattedText + postDetails.substring(end);

    setPostDetails(newText);

    // restore cursor after state update (best-effort)
    requestAnimationFrame(() => {
      const pos = start + formattedText.length;
      textarea.focus();
      textarea.setSelectionRange(pos, pos);
    });
  };

  // links handling
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

  // Files: add / remove handlers
  const onSelectImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    // optionally filter images only
    const images = files.filter((f) => f.type.startsWith("image/"));
    setImageFiles((prev) => [...prev, ...images]);
    // clear the input so same file can be reselected if needed
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const onSelectPdfs = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const pdfs = files.filter((f) => f.type === "application/pdf");
    setPdfFiles((prev) => [...prev, ...pdfs]);
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  };

  const removeImageAt = (index) =>
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  const removePdfAt = (index) => setPdfFiles((prev) => prev.filter((_, i) => i !== index));

  // Save Post with FormData (multipart/form-data)
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

    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", postName);
      formData.append("category", selectedHeader); // we send header _id
      formData.append("description", postDetails);
      formData.append("index", postIndex);
      formData.append("start_date", startDate);
      formData.append("last_date", lastDate);

      const links = usefulLinks.filter((l) => l.trim() !== "");
      formData.append("useful_links", JSON.stringify(links));

      // append multiple image files (field name: attachments)
      imageFiles.forEach((file) => {
        formData.append("attachments", file);
      });

      // append multiple pdf files (field name: pdfLink)
      pdfFiles.forEach((file) => {
        formData.append("pdfLink", file);
      });

      const res = await axios.post("http://localhost:5000/api/post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // add created post to state — adapt if backend returns different shape
      const createdPost = res.data?.post ?? res.data;
      if (createdPost) {
        setPosts((prev) => [...prev, createdPost]);
      } else {
        // fallback: re-fetch list
        const postsRes = await axios.get("http://localhost:5000/api/post");
        setPosts(postsRes.data || []);
      }

      // reset fields
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

      alert("✅ Post saved successfully!");
    } catch (err) {
      console.error("Error saving post:", err.response?.data ?? err.message);
      alert("❌ Failed to save post");
    } finally {
      setActionLoading(false);
    }
  };

  // Delete post
  const handleDeletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    setActionLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/post/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting post:", err.message);
      alert("❌ Failed to delete post");
    } finally {
      setActionLoading(false);
    }
  };

  // helper to safely get display value for header option label
  const headerLabel = (h) => `${h.index ?? ""}. ${h.name ?? "Unnamed"}`;

  // filter helper: handle category stored as id, string, or object
  const postMatchesHeader = (p, headerId) => {
    if (!headerId) return true;
    if (!p) return false;
    if (typeof p.category === "string") return p.category === headerId;
    if (typeof p.category === "object" && p.category !== null) {
      return p.category._id === headerId || p.category === headerId;
    }
    return false;
  };

  return (
    <section className="bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-6 flex flex-col border border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-yellow-300">📰 Manage Posts</h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setViewPosts(false)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition"
          type="button"
          aria-pressed={!viewPosts}
        >
          ➕ Add Post
        </button>
        <button
          onClick={() => setViewPosts(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-800 transition"
          type="button"
          aria-pressed={viewPosts}
        >
          📂 View Posts
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : null}

      {/* Add Post Form */}
      {!viewPosts && (
        <div className="space-y-4">
          <select
            value={selectedHeader}
            onChange={(e) => setSelectedHeader(e.target.value)}
            className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
            aria-label="Select Header"
          >
            <option value="">Select Header</option>
            {headers.map((h) => (
              <option key={h._id} value={h._id}>
                {headerLabel(h)}
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
              aria-label="Bold"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => applyFormat("italic")}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 italic"
              aria-label="Italic"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => applyFormat("underline")}
              className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 underline"
              aria-label="Underline"
            >
              U
            </button>
          </div>

          <textarea
            id="postDetails"
            ref={postDetailsRef}
            placeholder="Post Details (max 500 chars)"
            value={postDetails}
            onChange={(e) => setPostDetails(e.target.value)}
            maxLength={500}
            className="w-full p-2 border rounded h-32 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
          />

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
                  aria-label={`Remove link ${index + 1}`}
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

          {/* Images input (multiple) */}
          <div>
            <label className="text-gray-300 mb-2 block">🖼️ Attach Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={imageInputRef}
              onChange={onSelectImages}
              className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
              aria-label="attachments"
            />

            {/* previews */}
            {imageFiles.length > 0 && (
              <div className="mt-2 grid grid-cols-4 gap-2">
                {imageFiles.map((file, idx) => {
                  const objectUrl = URL.createObjectURL(file);
                  return (
                    <div key={idx} className="relative">
                      <img
                        src={objectUrl}
                        alt={file.name}
                        className="w-full h-20 object-cover rounded"
                        onLoad={() => URL.revokeObjectURL(objectUrl)}
                      />
                      <button
                        type="button"
                        onClick={() => removeImageAt(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        aria-label={`Remove image ${file.name}`}
                      >
                        ✖
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* PDFs input (multiple) */}
          <div>
            <label className="text-gray-300 mb-2 block">📄 Attach PDFs</label>
            <input
              type="file"
              accept="application/pdf"
              multiple
              ref={pdfInputRef}
              onChange={onSelectPdfs}
              className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
              aria-label="pdfLink"
            />

            {pdfFiles.length > 0 && (
              <div className="mt-2 space-y-1">
                {pdfFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-800 p-2 rounded"
                  >
                    <div className="text-sm truncate max-w-[75%]">{file.name}</div>
                    <div className="flex gap-2">
                      <a
                        href={URL.createObjectURL(file)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 underline text-sm"
                        onClick={(e) => {
                          // revoke after some time — best-effort
                          setTimeout(() => URL.revokeObjectURL(URL.createObjectURL(file)), 5000);
                        }}
                      >
                        Preview
                      </a>
                      <button
                        type="button"
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
            className={`bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition w-full ${
              actionLoading ? "opacity-70 cursor-wait" : ""
            }`}
            type="button"
            disabled={actionLoading}
          >
            {actionLoading ? "Saving..." : "Save Post"}
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
            aria-label="Select header to filter posts"
          >
            <option value="">Select Header</option>
            {headers.map((h) => (
              <option key={h._id} value={h._id}>
                {headerLabel(h)}
              </option>
            ))}
          </select>

          <ul className="space-y-3">
            {posts.filter((p) => postMatchesHeader(p, selectedHeader)).length === 0 ? (
              <p className="text-gray-400">No posts for this header.</p>
            ) : (
              posts
                .filter((p) => postMatchesHeader(p, selectedHeader))
                .map((p) => (
                  <li
                    key={p._id}
                    className="flex justify-between items-center bg-gray-800 p-3 rounded-lg shadow"
                  >
                    <div className="max-w-[75%]">
                      <h3 className="font-bold">{p.title}</h3>

                      {/* sanitize before dangerouslySetInnerHTML */}
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(p.description || ""),
                        }}
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

                      {/* attachments previews if any */}
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
                          <ul className="list-disc list-inside break-words">
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
                        {p.start_date ? new Date(p.start_date).toLocaleDateString() : "N/A"} | Last:{" "}
                        {p.last_date ? new Date(p.last_date).toLocaleDateString() : "N/A"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditPostId(p._id)}
                        className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600"
                        type="button"
                        aria-label={`Edit ${p.title}`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePost(p._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
                        type="button"
                        aria-label={`Delete ${p.title}`}
                        disabled={actionLoading}
                      >
                        {actionLoading ? "Working..." : "Delete"}
                      </button>
                    </div>
                  </li>
                ))
            )}
          </ul>
        </div>
      )}

      {/* Edit Modal */}
      {editPostId && (
        <EditPosts
          postId={editPostId}
          onClose={() => setEditPostId(null)}
          onUpdated={(updatedPost) =>
            setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)))
          }
        />
      )}
    </section>
  );
}

export default ManagePosts;
