// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import DOMPurify from "dompurify";
// import EditPosts from "./EditPosts";
// import { toast } from "react-toastify";

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

//   const [imageFiles, setImageFiles] = useState([]);
//   const [pdfFiles, setPdfFiles] = useState([]);

//   const [usefulLinks, setUsefulLinks] = useState([""]);

//   const [editPostId, setEditPostId] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [actionLoading, setActionLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const imageInputRef = useRef(null);
//   const pdfInputRef = useRef(null);
//   const postDetailsRef = useRef(null);

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

//     requestAnimationFrame(() => {
//       const pos = start + formattedText.length;
//       textarea.focus();
//       textarea.setSelectionRange(pos, pos);
//     });
//   };

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

//   const onSelectImages = (e) => {
//     const files = Array.from(e.target.files || []);
//     if (files.length === 0) return;
//     const images = files.filter((f) => f.type.startsWith("image/"));
//     setImageFiles((prev) => [...prev, ...images]);
//     if (imageInputRef.current) imageInputRef.current.value = "";
//   };

//   const onSelectPdfs = (e) => {
//     const files = Array.from(e.target.files || []);
//     if (files.length === 0) return;
//     const pdfs = files.filter((f) => f.type === "application/pdf");
//     setPdfFiles((prev) => [...prev, ...pdfs]);
//     if (pdfInputRef.current) pdfInputRef.current.value = "";
//   };

//   const removeImageAt = (index) =>
//     setImageFiles((prev) => prev.filter((_, i) => i !== index));
//   const removePdfAt = (index) => setPdfFiles((prev) => prev.filter((_, i) => i !== index));

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
//       formData.append("category", selectedHeader);
//       formData.append("description", postDetails);
//       formData.append("index", postIndex);
//       formData.append("start_date", startDate);
//       formData.append("last_date", lastDate);

//       const links = usefulLinks.filter((l) => l.trim() !== "");
//       formData.append("useful_links", JSON.stringify(links));

//       imageFiles.forEach((file) => {
//         formData.append("attachments", file);
//       });

//       pdfFiles.forEach((file) => {
//         formData.append("pdfLink", file);
//       });

//       const res = await axios.post("http://localhost:5000/api/post", formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const createdPost = res.data?.post ?? res.data;
//       if (createdPost) {
//         setPosts((prev) => [...prev, createdPost]);
//       } else {
//         const postsRes = await axios.get("http://localhost:5000/api/post");
//         setPosts(postsRes.data || []);
//       }

//       setPostName("");
//       setPostDetails("");
//       setPostIndex("");
//       setStartDate("");
//       setLastDate("");
//       setImageFiles([]);
//       setPdfFiles([]);
//       setUsefulLinks([""]);
//       if (imageInputRef.current) imageInputRef.current.value = "";
//       if (pdfInputRef.current) pdfInputRef.current.value = "";

//       alert("✅ Post saved successfully!");
//     } catch (err) {
//       console.error("Error saving post:", err.response?.data ?? err.message);
//       alert("❌ Failed to save post");
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const handleDeletePost = async (id) => {
//     if (!window.confirm("Delete this post?")) return;
//     setActionLoading(true);
//     try {
//       await axios.delete(`http://localhost:5000/api/post/${id}`);
//       setPosts((prev) => prev.filter((p) => p._id !== id));
//       toast.success("Post deleted Succesfully")
//     } catch (err) {
//       console.error("Error deleting post:", err.message);
//       toast.error("Failed to Delete Post")
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const headerLabel = (h) => `${h.index ?? ""}. ${h.name ?? "Unnamed"}`;

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
//     <section className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col border border-gray-700">
//       <h2 className="text-lg sm:text-xl font-semibold mb-4 text-yellow-300">📰 Manage Posts</h2>

//       <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
//         <button
//           onClick={() => setViewPosts(false)}
//           className={`w-full sm:w-auto flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition text-sm sm:text-base`}
//           type="button"
//           aria-pressed={!viewPosts}
//         >
//           ➕ Add Post
//         </button>
//         <button
//           onClick={() => setViewPosts(true)}
//           className={`w-full sm:w-auto flex-1 sm:flex-none bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-800 transition text-sm sm:text-base`}
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

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <input
//               type="text"
//               placeholder="Post Name"
//               value={postName}
//               onChange={(e) => setPostName(e.target.value)}
//               className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
//             />

//             <input
//               type="number"
//               placeholder="Post Index"
//               value={postIndex}
//               onChange={(e) => setPostIndex(e.target.value)}
//               className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
//             />

//             <div className="flex gap-2">
//               <button
//                 type="button"
//                 onClick={() => applyFormat("bold")}
//                 className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 font-bold"
//                 aria-label="Bold"
//               >
//                 B
//               </button>
//               <button
//                 type="button"
//                 onClick={() => applyFormat("italic")}
//                 className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 italic"
//                 aria-label="Italic"
//               >
//                 I
//               </button>
//               <button
//                 type="button"
//                 onClick={() => applyFormat("underline")}
//                 className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 underline"
//                 aria-label="Underline"
//               >
//                 U
//               </button>
//             </div>

//             <textarea
//               id="postDetails"
//               ref={postDetailsRef}
//               placeholder="Post Details (max 500 chars)"
//               value={postDetails}
//               onChange={(e) => setPostDetails(e.target.value)}
//               maxLength={500}
//               className="w-full p-2 border rounded h-40 sm:h-32 md:h-40 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 col-span-1 sm:col-span-2"
//             />
//           </div>

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

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <input
//               type="date"
//               value={startDate}
//               onChange={(e) => setStartDate(e.target.value)}
//               className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
//             />

//             <input
//               type="date"
//               value={lastDate}
//               onChange={(e) => setLastDate(e.target.value)}
//               className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <label className="text-gray-300 mb-2 block">🖼️ Attach Images</label>
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               ref={imageInputRef}
//               onChange={onSelectImages}
//               className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
//               aria-label="attachments"
//             />

//             {imageFiles.length > 0 && (
//               <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
//                 {imageFiles.map((file, idx) => {
//                   const objectUrl = URL.createObjectURL(file);
//                   return (
//                     <div key={idx} className="relative">
//                       <img
//                         src={objectUrl}
//                         alt={file.name}
//                         className="w-full h-20 object-cover rounded"
//                         onLoad={() => URL.revokeObjectURL(objectUrl)}
//                       />
//                       <button
//                         type="button"
//                         onClick={() => removeImageAt(idx)}
//                         className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
//                         aria-label={`Remove image ${file.name}`}
//                       >
//                         ✖
//                       </button>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           <div>
//             <label className="text-gray-300 mb-2 block">📄 Attach PDFs</label>
//             <input
//               type="file"
//               accept="application/pdf"
//               multiple
//               ref={pdfInputRef}
//               onChange={onSelectPdfs}
//               className="w-full p-2 border rounded bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
//               aria-label="pdfLink"
//             />

//             {pdfFiles.length > 0 && (
//               <div className="mt-2 space-y-1">
//                 {pdfFiles.map((file, idx) => (
//                   <div
//                     key={idx}
//                     className="flex items-center justify-between bg-gray-800 p-2 rounded"
//                   >
//                     <div className="text-sm truncate max-w-[60%]">{file.name}</div>
//                     <div className="flex gap-2">
//                       <a
//                         href={URL.createObjectURL(file)}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="text-blue-400 underline text-sm"
//                         onClick={(e) => {
//                           setTimeout(() => URL.revokeObjectURL(URL.createObjectURL(file)), 5000);
//                         }}
//                       >
//                         Preview
//                       </a>
//                       <button
//                         type="button"
//                         onClick={() => removePdfAt(idx)}
//                         className="bg-red-600 text-white px-2 py-1 rounded"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

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

//           <ul className="space-y-3 max-h-[60vh] overflow-auto">
//             {posts.filter((p) => postMatchesHeader(p, selectedHeader)).length === 0 ? (
//               <p className="text-gray-400">No posts for this header.</p>
//             ) : (
//               posts
//                 .filter((p) => postMatchesHeader(p, selectedHeader))
//                 .map((p) => (
//                   <li
//                     key={p._id}
//                     className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-800 p-3 rounded-lg shadow"
//                   >
//                     <div className="w-full md:w-3/4">
//                       <h3 className="font-bold text-sm md:text-base">{p.title}</h3>

//                       <div
//                         className="mt-1 text-sm text-gray-200"
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

//                       {p.attachments?.length > 0 && (
//                         <div className="mt-2 flex gap-2 flex-wrap">
//                           {p.attachments.map((url, i) => (
//                             <img
//                               key={i}
//                               src={url}
//                               alt={`attachment-${i}`}
//                               className="w-20 h-20 object-cover rounded"
//                             />
//                           ))}
//                         </div>
//                       )}

//                       {p.pdfLink?.length > 0 && (
//                         <div className="mt-2 text-sm">
//                           <p className="text-gray-300">📄 PDFs:</p>
//                           <ul className="list-disc list-inside break-words">
//                             {p.pdfLink.map((url, idx) => (
//                               <li key={idx}>
//                                 <a
//                                   href={url}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="text-blue-400 hover:underline break-all"
//                                 >
//                                   {url.split("/").pop() || `pdf-${idx + 1}`}
//                                 </a>
//                               </li>
//                             ))}
//                           </ul>
//                         </div>
//                       )}

//                       <p className="text-xs text-gray-400 mt-2">
//                         Index: {p.index} | Start: {p.start_date ? new Date(p.start_date).toLocaleDateString() : "N/A"} | Last: {p.last_date ? new Date(p.last_date).toLocaleDateString() : "N/A"}
//                       </p>
//                     </div>

//                     <div className="mt-3 md:mt-0 flex gap-2 md:flex-col md:items-end">
//                       <div className="flex gap-2">
//                         <button
//                           onClick={() => setEditPostId(p._id)}
//                           className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600 text-sm"
//                           type="button"
//                           aria-label={`Edit ${p.title}`}
//                         >
//                           Edit
//                         </button>
//                         <button
//                           onClick={() => handleDeletePost(p._id)}
//                           className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800 text-sm"
//                           type="button"
//                           aria-label={`Delete ${p.title}`}
//                           disabled={actionLoading}
//                         >
//                           {actionLoading ? "Working..." : "Delete"}
//                         </button>
//                       </div>
//                     </div>
//                   </li>
//                 ))
//             )}
//           </ul>
//         </div>
//       )}

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
import { toast } from "react-toastify";

/**
 * ManagePosts (caret/jump fix)
 *
 * Key fix: avoid writing editable.innerHTML from React while the editable has focus.
 * - track isFocused via ref
 * - only sync innerHTML from state when not focused
 * - read from editable.innerHTML onInput and update state
 */

function ManagePosts() {
  const [headers, setHeaders] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedHeader, setSelectedHeader] = useState("");
  const [viewPosts, setViewPosts] = useState(false);

  const [postName, setPostName] = useState("");
  const [postDetails, setPostDetails] = useState(""); // sanitized HTML
  const [postIndex, setPostIndex] = useState("");
  const [startDate, setStartDate] = useState("");
  const [lastDate, setLastDate] = useState("");

  const [imageFiles, setImageFiles] = useState([]);
  const [pdfFiles, setPdfFiles] = useState([]);

  const [usefulLinks, setUsefulLinks] = useState([""]);

  const [editPostId, setEditPostId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // WYSIWYG specifics
  const postDetailsRef = useRef(null); // contentEditable element
  const isFocusedRef = useRef(false); // track focus to avoid rewrites that reset caret
  const [charCount, setCharCount] = useState(0);
  const CHAR_LIMIT = 500;

  // file input refs
  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);

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

  // IMPORTANT: Do not set innerHTML from React while the editable is focused.
  // This effect will sync DOM -> state initially and whenever postDetails changes
  // but only write to DOM when NOT focused.
  useEffect(() => {
    const editable = postDetailsRef.current;
    if (!editable) return;
    if (!isFocusedRef.current) {
      // Only write innerHTML when not focused (prevents caret jump)
      const sanitized = DOMPurify.sanitize(postDetails || "");
      // update DOM only if different to avoid useless writes
      if (editable.innerHTML !== sanitized) {
        editable.innerHTML = sanitized;
        // update char count
        setCharCount(editable.textContent?.length ?? 0);
      }
    }
  }, [postDetails]);

  // ---------- WYSIWYG / Formatting ----------
  // applyFormat: use execCommand and then read innerHTML from the DOM
  const applyFormat = (format) => {
    if (!document) return;
    if (!postDetailsRef.current) return;

    // execCommand toggles formatting at the current selection
    if (format === "bold") document.execCommand("bold");
    else if (format === "italic") document.execCommand("italic");
    else if (format === "underline") document.execCommand("underline");

    // read and sanitize from the DOM (do NOT set innerHTML here)
    const editable = postDetailsRef.current;
    const sanitized = DOMPurify.sanitize(editable.innerHTML);
    // update state, but note: writing postDetails won't immediately rewrite DOM because isFocusedRef is true
    setPostDetails(sanitized);
    setCharCount(editable.textContent?.length ?? 0);
    // keep focus (execCommand preserves selection usually)
    editable.focus();
  };

  // handle input inside the contentEditable div
  const handleEditableInput = (e) => {
    const editable = e.currentTarget;
    // measure plain-text length
    const plain = editable.textContent ?? "";
    if (plain.length > CHAR_LIMIT) {
      // trim the plain text to the limit and set content to that trimmed plain text.
      // This will remove markup when limit exceeded, but it's simple and avoids complex trimming of HTML.
      const trimmed = plain.slice(0, CHAR_LIMIT);
      // Replace content with trimmed plain text at caret end
      // Save selection position, replace content, then restore caret at end.
      // Simpler: set textContent (removes markup) and place caret at end.
      editable.textContent = trimmed;
      // move caret to end
      placeCaretAtEnd(editable);
    }
    const sanitized = DOMPurify.sanitize(editable.innerHTML);
    setPostDetails(sanitized);
    setCharCount(editable.textContent?.length ?? 0);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text");
    // Insert as plain text to avoid external markup
    document.execCommand("insertText", false, text);
  };

  // helper to place caret at end of contentEditable
  function placeCaretAtEnd(el) {
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
  }

  // ---------- Links handling ----------
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

  // ---------- Files ----------
  const onSelectImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const images = files.filter((f) => f.type.startsWith("image/"));
    setImageFiles((prev) => [...prev, ...images]);
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
  const removePdfAt = (index) =>
    setPdfFiles((prev) => prev.filter((_, i) => i !== index));

  // ---------- Save Post ----------
  const handleSavePost = async () => {
    const plainTextLength = postDetailsRef.current?.textContent?.length ?? 0;
    if (
      !postName ||
      !postDetails ||
      !postIndex ||
      !startDate ||
      !lastDate ||
      !selectedHeader
    ) {
      toast.error("Please fill all fields and select a header!");
      return;
    }
    if (plainTextLength > CHAR_LIMIT) {
      toast.error(`Post details exceed ${CHAR_LIMIT} characters.`);
      return;
    }

    setActionLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", postName);
      formData.append("category", selectedHeader);
      formData.append("description", DOMPurify.sanitize(postDetails));
      formData.append("index", postIndex);
      formData.append("start_date", startDate);
      formData.append("last_date", lastDate);

      const links = usefulLinks.filter((l) => l.trim() !== "");
      formData.append("useful_links", JSON.stringify(links));

      imageFiles.forEach((file) => formData.append("attachments", file));
      pdfFiles.forEach((file) => formData.append("pdfLink", file));

      const res = await axios.post("http://localhost:5000/api/post", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const createdPost = res.data?.post ?? res.data;
      if (createdPost) {
        setPosts((prev) => [...prev, createdPost]);
      } else {
        const postsRes = await axios.get("http://localhost:5000/api/post");
        setPosts(postsRes.data || []);
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

      toast.success("Post saved successfully!");
    } catch (err) {
      console.error("Error saving post:", err.response?.data ?? err.message);
      toast.error("Failed to save post");
    } finally {
      setActionLoading(false);
    }
  };

  // ---------- Delete Post ----------
  const handleDeletePost = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    setActionLoading(true);
    try {
      await axios.delete(`http://localhost:5000/api/post/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Post deleted successfully");
    } catch (err) {
      console.error("Error deleting post:", err.message);
      toast.error("Failed to delete post");
    } finally {
      setActionLoading(false);
    }
  };

  // ---------- Helpers ----------
  const headerLabel = (h) => `${h.index ?? ""}. ${h.name ?? "Unnamed"}`;

  const postMatchesHeader = (p, headerId) => {
    if (!headerId) return true;
    if (!p) return false;
    if (typeof p.category === "string") return p.category === headerId;
    if (typeof p.category === "object" && p.category !== null) {
      return p.category._id === headerId || p.category === headerId;
    }
    return false;
  };

  // ---------- Render ----------
  return (
    <section className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col border border-gray-700">
      {/* ====== Only CSS changes below (scoped to .posts-scroll) ======
          - makes the scrollbar slimmer, rounded, colored to match UI
          - adds right padding so boxes don't get overlapped by the scrollbar
          - uses both webkit and firefox rules
       */}
      <style>{`
        /* apply to the posts list only */
        .posts-scroll {
          padding-right: 12px; /* keep some spacing from scrollbar */
          box-sizing: border-box;
          scrollbar-width: thin; /* firefox */
          scrollbar-color: #4b5563 #0b1220; /* thumb track (firefox) */
        }

        /* Webkit browsers */
        .posts-scroll::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        .posts-scroll::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 999px;
        }
        .posts-scroll::-webkit-scrollbar-thumb {
          background-color: #374151; /* gray-700 */
          border-radius: 999px;
          border: 2px solid rgba(15, 23, 42, 0.6); /* slight inset look */
        }
        .posts-scroll::-webkit-scrollbar-thumb:hover {
          background-color: #4b5563; /* gray-600 */
        }

        /* make sure long links break nicely inside the box */
        .posts-scroll .break-all {
          word-break: break-word;
          overflow-wrap: anywhere;
        }
      `}</style>

      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-yellow-300">
        📰 Manage Posts
      </h2>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-4">
        <button
          onClick={() => setViewPosts(false)}
          className={`w-full sm:w-auto flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition text-sm sm:text-base`}
          type="button"
          aria-pressed={!viewPosts}
        >
          ➕ Add Post
        </button>
        <button
          onClick={() => setViewPosts(true)}
          className={`w-full sm:w-auto flex-1 sm:flex-none bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-800 transition text-sm sm:text-base`}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

            {/* Formatting toolbar */}
            <div className="flex gap-2">
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFormat("bold")}
                className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 font-bold"
                aria-label="Bold"
              >
                B
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFormat("italic")}
                className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 italic"
                aria-label="Italic"
              >
                I
              </button>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFormat("underline")}
                className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600 underline"
                aria-label="Underline"
              >
                U
              </button>
              <div className="ml-auto text-xs text-gray-300 self-center">
                {charCount}/{CHAR_LIMIT}
              </div>
            </div>

            {/* contentEditable editor */}
            <div
              id="postDetails"
              ref={postDetailsRef}
              contentEditable
              role="textbox"
              aria-multiline="true"
              suppressContentEditableWarning={true}
              onInput={handleEditableInput}
              onPaste={handlePaste}
              onFocus={() => {
                isFocusedRef.current = true;
              }}
              onBlur={() => {
                isFocusedRef.current = false;
                // when blurred, ensure state and DOM are synced
                const sanitized = DOMPurify.sanitize(
                  postDetailsRef.current?.innerHTML ?? ""
                );
                setPostDetails(sanitized);
                setCharCount(postDetailsRef.current?.textContent?.length ?? 0);
              }}
              className="w-full p-2 border rounded h-40 sm:h-32 md:h-40 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500 col-span-1 sm:col-span-2 overflow-auto"
            />
          </div>

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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          </div>

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

            {imageFiles.length > 0 && (
              <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
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
                    <div className="text-sm truncate max-w-[60%]">
                      {file.name}
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={URL.createObjectURL(file)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 underline text-sm"
                        onClick={() => {
                          // revoke after a bit
                          setTimeout(
                            () =>
                              URL.revokeObjectURL(URL.createObjectURL(file)),
                            5000
                          );
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
                        {p.start_date
                          ? new Date(p.start_date).toLocaleDateString()
                          : "N/A"}{" "}
                        | Last:{" "}
                        {p.last_date
                          ? new Date(p.last_date).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>

                    <div className="mt-3 md:mt-0 flex gap-2 md:flex-col md:items-end">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEditPostId(p._id)}
                          className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-600 text-sm"
                          type="button"
                          aria-label={`Edit ${p.title}`}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(p._id)}
                          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800 text-sm"
                          type="button"
                          aria-label={`Delete ${p.title}`}
                          disabled={actionLoading}
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

      {/* Edit Modal */}
      {editPostId && (
        <EditPosts
          postId={editPostId}
          onClose={() => setEditPostId(null)}
          onUpdated={(updatedPost) =>
            setPosts((prev) =>
              prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
            )
          }
        />
      )}
    </section>
  );
}

export default ManagePosts;
