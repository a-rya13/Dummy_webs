// // EditPosts.jsx
// import React, { useState, useEffect, useRef } from "react";
// import ReactDOM from "react-dom";
// import axios from "axios";

// function EditPosts({ postId, onClose, onUpdated, inline = false }) {
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);

//   // New files selected by the user
//   const [newImageFiles, setNewImageFiles] = useState([]); // File[]
//   const [newImagePreviews, setNewImagePreviews] = useState([]); // { url, name }[]
//   const [newPdfFiles, setNewPdfFiles] = useState([]); // File[]
//   const [newPdfNames, setNewPdfNames] = useState([]); // name list for UI

//   // Which existing files are marked for deletion (store the exact URL)
//   const [toDeleteImageUrls, setToDeleteImageUrls] = useState(new Set());
//   const [toDeletePdfUrls, setToDeletePdfUrls] = useState(new Set());

//   // file input refs
//   const imageInputRef = useRef(null);
//   const pdfInputRef = useRef(null);

//   // fetch post on mount / when postId changes
//   useEffect(() => {
//     let mounted = true;
//     const fetchPost = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const res = await axios.get(`http://localhost:5000/api/post/${postId}`);
//         const fetched = res.data?.post ?? res.data;
//         if (mounted) {
//           setPost(fetched);
//           // reset deletion sets & new files
//           setToDeleteImageUrls(new Set());
//           setToDeletePdfUrls(new Set());
//           setNewImageFiles([]);
//           setNewImagePreviews([]);
//           setNewPdfFiles([]);
//           setNewPdfNames([]);
//         }
//       } catch (err) {
//         console.error("Error fetching post:", err);
//         if (mounted) setError("Failed to load post.");
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     };

//     fetchPost();
//     return () => {
//       mounted = false;
//       // revoke object URLs
//       newImagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [postId]);

//   // handle selecting new images (multiple)
//   const handleSelectImages = (e) => {
//     const files = Array.from(e.target.files || []);
//     if (files.length === 0) return;
//     const images = files.filter((f) => f.type.startsWith("image/"));
//     if (images.length === 0) return;

//     // create previews
//     const previews = images.map((f) => ({ url: URL.createObjectURL(f), name: f.name }));
//     // append
//     setNewImageFiles((prev) => [...prev, ...images]);
//     setNewImagePreviews((prev) => [...prev, ...previews]);

//     // clear input so same file can be reselected if needed
//     if (imageInputRef.current) imageInputRef.current.value = "";
//   };

//   // remove a newly added image (by index)
//   const removeNewImageAt = (index) => {
//     setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
//     setNewImagePreviews((prev) => {
//       const toRevoke = prev[index]?.url;
//       if (toRevoke) URL.revokeObjectURL(toRevoke);
//       return prev.filter((_, i) => i !== index);
//     });
//   };

//   // handle selecting new PDFs (multiple)
//   const handleSelectPdfs = (e) => {
//     const files = Array.from(e.target.files || []);
//     if (files.length === 0) return;
//     const pdfs = files.filter((f) => f.type === "application/pdf");
//     if (pdfs.length === 0) return;
//     setNewPdfFiles((prev) => [...prev, ...pdfs]);
//     setNewPdfNames((prev) => [...prev, ...pdfs.map((f) => f.name)]);
//     if (pdfInputRef.current) pdfInputRef.current.value = "";
//   };

//   const removeNewPdfAt = (index) => {
//     setNewPdfFiles((prev) => prev.filter((_, i) => i !== index));
//     setNewPdfNames((prev) => prev.filter((_, i) => i !== index));
//   };

//   // toggle marking an existing image url for deletion
//   const toggleDeleteExistingImage = (url) => {
//     setToDeleteImageUrls((prev) => {
//       const next = new Set(prev);
//       if (next.has(url)) next.delete(url);
//       else next.add(url);
//       return next;
//     });
//   };

//   // toggle marking an existing pdf url for deletion
//   const toggleDeleteExistingPdf = (url) => {
//     setToDeletePdfUrls((prev) => {
//       const next = new Set(prev);
//       if (next.has(url)) next.delete(url);
//       else next.add(url);
//       return next;
//     });
//   };

//   const handleUpdate = async (e) => {
//     e.preventDefault();
//     if (!post) return;
//     setSubmitting(true);
//     setError(null);

//     try {
//       const formData = new FormData();
//       formData.append("title", post.title ?? "");
//       formData.append("description", post.description ?? "");
//       formData.append("index", post.index ?? 0);
//       if (post.start_date) formData.append("start_date", post.start_date);
//       if (post.last_date) formData.append("last_date", post.last_date);

//       formData.append("useful_links", JSON.stringify(post.useful_links ?? []));

//       // add delete arrays as JSON strings (backend expects deleteImageUrls / deletePdfUrls)
//       if (toDeleteImageUrls.size > 0) {
//         formData.append("deleteImageUrls", JSON.stringify(Array.from(toDeleteImageUrls)));
//       }
//       if (toDeletePdfUrls.size > 0) {
//         formData.append("deletePdfUrls", JSON.stringify(Array.from(toDeletePdfUrls)));
//       }

//       // append all newly selected image files under 'attachments'
//       newImageFiles.forEach((file) => {
//         formData.append("attachments", file);
//       });

//       // append all newly selected pdf files under 'pdfLink'
//       newPdfFiles.forEach((file) => {
//         formData.append("pdfLink", file);
//       });

//       const res = await axios.put(`http://localhost:5000/api/post/${postId}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const updated = res.data?.post ?? res.data;
//       onUpdated && onUpdated(updated);
//       onClose && onClose();
//     } catch (err) {
//       console.error("Error updating post:", err.response?.data ?? err.message);
//       setError("Failed to update post.");
//     } finally {
//       setSubmitting(false);
//       // cleanup previews
//       newImagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
//       setNewImagePreviews([]);
//       setNewImageFiles([]);
//       setNewPdfFiles([]);
//       setNewPdfNames([]);
//     }
//   };

//   if (loading) return <p className="text-gray-400">Loading...</p>;
//   if (error) return <p className="text-red-400">{error}</p>;
//   if (!post) return <p className="text-red-400">Post not found.</p>;

//   const dialog = (
//     <div
//       className={inline ? "" : "fixed inset-0 flex items-center justify-center bg-black/60 z-50"}
//       onClick={!inline ? onClose : undefined}
//     >
//       <div
//         className="bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-2xl border border-gray-700"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h2 className="text-xl font-bold text-yellow-300 mb-4">✏️ Edit Post</h2>

//         <form onSubmit={handleUpdate} className="space-y-4">
//           <input
//             type="text"
//             value={post.title ?? ""}
//             onChange={(e) => setPost({ ...post, title: e.target.value })}
//             className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
//             placeholder="Post Title"
//             required
//           />

//           <textarea
//             value={post.description ?? ""}
//             onChange={(e) => setPost({ ...post, description: e.target.value })}
//             className="w-full p-2 border rounded h-32 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
//             placeholder="Post Description"
//             required
//           />

//           <input
//             type="number"
//             value={post.index ?? 0}
//             onChange={(e) => setPost({ ...post, index: e.target.value })}
//             className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
//             placeholder="Post Index"
//             required
//           />

//           <input
//             type="date"
//             value={post.start_date ? post.start_date.substring(0, 10) : ""}
//             onChange={(e) => setPost({ ...post, start_date: e.target.value })}
//             className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
//             required
//           />

//           <input
//             type="date"
//             value={post.last_date ? post.last_date.substring(0, 10) : ""}
//             onChange={(e) => setPost({ ...post, last_date: e.target.value })}
//             className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
//             required
//           />

//           <textarea
//             value={(post.useful_links && post.useful_links.join("\n")) || ""}
//             onChange={(e) =>
//               setPost({
//                 ...post,
//                 useful_links: e.target.value
//                   .split("\n")
//                   .map((l) => l.trim())
//                   .filter((l) => l !== ""),
//               })
//             }
//             className="w-full p-2 border rounded h-24 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
//             placeholder="Enter useful links (one per line)"
//           />

//           {/* Existing attachments (images) */}
//           <div>
//             <label className="text-gray-300 mb-2 block">🖼️ Current Images</label>
//             <div className="flex gap-2 flex-wrap">
//               {(post.attachments || []).length === 0 && (
//                 <p className="text-sm text-gray-400">No images</p>
//               )}
//               {(post.attachments || []).map((url, idx) => {
//                 const marked = toDeleteImageUrls.has(url);
//                 return (
//                   <div key={idx} className="relative">
//                     <img
//                       src={url}
//                       alt={`attachment-${idx}`}
//                       className={`w-28 h-20 object-cover rounded border ${marked ? "opacity-30" : ""}`}
//                     />
//                     <div className="mt-1 flex justify-center gap-2">
//                       <button
//                         type="button"
//                         onClick={() => window.open(url, "_blank", "noopener")}
//                         className="text-xs text-blue-400 underline"
//                       >
//                         View
//                       </button>
//                       <button
//                         type="button"
//                         onClick={() => toggleDeleteExistingImage(url)}
//                         className={`text-xs px-2 py-1 rounded ${marked ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
//                       >
//                         {marked ? "Undo Remove" : "Remove"}
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* Existing PDFs */}
//           <div className="mt-3">
//             <label className="text-gray-300 mb-2 block">📄 Current PDFs</label>
//             <div className="space-y-2">
//               {(post.pdfLink || []).length === 0 && (
//                 <p className="text-sm text-gray-400">No PDFs</p>
//               )}
//               {(post.pdfLink || []).map((url, idx) => {
//                 const marked = toDeletePdfUrls.has(url);
//                 return (
//                   <div key={idx} className="flex items-center justify-between bg-gray-800 p-2 rounded">
//                     <div className="truncate max-w-[70%]">
//                       <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
//                         {url.split("/").pop() || `pdf-${idx + 1}`}
//                       </a>
//                     </div>
//                     <div className="flex gap-2">
//                       <button
//                         type="button"
//                         onClick={() => toggleDeleteExistingPdf(url)}
//                         className={`text-xs px-2 py-1 rounded ${marked ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
//                       >
//                         {marked ? "Undo Remove" : "Remove"}
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>

//           {/* New images */}
//           <div className="mt-3">
//             <label className="text-gray-300 mb-2 block">🖼️ Add Images (you can pick multiple)</label>
//             <input
//               type="file"
//               accept="image/*"
//               multiple
//               ref={imageInputRef}
//               onChange={handleSelectImages}
//               className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
//             />

//             {newImagePreviews.length > 0 && (
//               <div className="mt-2 grid grid-cols-4 gap-2">
//                 {newImagePreviews.map((p, i) => (
//                   <div key={i} className="relative">
//                     <img src={p.url} alt={p.name} className="w-full h-20 object-cover rounded" />
//                     <div className="mt-1 flex justify-between items-center gap-2">
//                       <div className="text-xs truncate">{p.name}</div>
//                       <button
//                         type="button"
//                         onClick={() => removeNewImageAt(i)}
//                         className="text-xs bg-red-600 text-white px-2 py-0.5 rounded"
//                       >
//                         Remove
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* New PDFs */}
//           <div className="mt-3">
//             <label className="text-gray-300 mb-2 block">📄 Add PDFs (you can pick multiple)</label>
//             <input
//               type="file"
//               accept="application/pdf"
//               multiple
//               ref={pdfInputRef}
//               onChange={handleSelectPdfs}
//               className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
//             />

//             {newPdfNames.length > 0 && (
//               <div className="mt-2 space-y-1">
//                 {newPdfNames.map((n, i) => (
//                   <div key={i} className="flex items-center justify-between bg-gray-800 p-2 rounded">
//                     <div className="text-sm truncate max-w-[75%]">{n}</div>
//                     <div className="flex gap-2">
//                       <button
//                         type="button"
//                         onClick={() => removeNewPdfAt(i)}
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

//           <div className="flex justify-between mt-4">
//             <button
//               type="button"
//               onClick={() => {
//                 // cleanup previews
//                 newImagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
//                 setNewImagePreviews([]);
//                 setNewImageFiles([]);
//                 setNewPdfFiles([]);
//                 setNewPdfNames([]);
//                 onClose && onClose();
//               }}
//               className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
//               disabled={submitting}
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition"
//               disabled={submitting}
//             >
//               {submitting ? "Saving..." : "Save Changes"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );

//   if (inline) return dialog;
//   return ReactDOM.createPortal(dialog, document.body);
// }

// export default EditPosts;

// EditPosts.jsx
import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

function EditPosts({ postId, onClose, onUpdated, inline = false }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const [newPdfFiles, setNewPdfFiles] = useState([]);
  const [newPdfNames, setNewPdfNames] = useState([]);

  const [toDeleteImageUrls, setToDeleteImageUrls] = useState(new Set());
  const [toDeletePdfUrls, setToDeletePdfUrls] = useState(new Set());

  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    const fetchPost = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/post/${postId}`);
        const fetched = res.data?.post ?? res.data;
        if (mounted) {
          setPost(fetched);
          setToDeleteImageUrls(new Set());
          setToDeletePdfUrls(new Set());
          setNewImageFiles([]);
          setNewImagePreviews([]);
          setNewPdfFiles([]);
          setNewPdfNames([]);
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        if (mounted) setError("Failed to load post.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPost();
    return () => {
      mounted = false;
      newImagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [postId]);

  const handleSelectImages = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (images.length === 0) return;

    const previews = images.map((f) => ({
      url: URL.createObjectURL(f),
      name: f.name,
    }));
    setNewImageFiles((prev) => [...prev, ...images]);
    setNewImagePreviews((prev) => [...prev, ...previews]);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const removeNewImageAt = (index) => {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index));
    setNewImagePreviews((prev) => {
      const toRevoke = prev[index]?.url;
      if (toRevoke) URL.revokeObjectURL(toRevoke);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSelectPdfs = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const pdfs = files.filter((f) => f.type === "application/pdf");
    if (pdfs.length === 0) return;
    setNewPdfFiles((prev) => [...prev, ...pdfs]);
    setNewPdfNames((prev) => [...prev, ...pdfs.map((f) => f.name)]);
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  };

  const removeNewPdfAt = (index) => {
    setNewPdfFiles((prev) => prev.filter((_, i) => i !== index));
    setNewPdfNames((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleDeleteExistingImage = (url) => {
    setToDeleteImageUrls((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  };

  const toggleDeleteExistingPdf = (url) => {
    setToDeletePdfUrls((prev) => {
      const next = new Set(prev);
      if (next.has(url)) next.delete(url);
      else next.add(url);
      return next;
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!post) return;
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", post.title ?? "");
      formData.append("description", post.description ?? "");
      formData.append("index", post.index ?? 0);
      if (post.start_date) formData.append("start_date", post.start_date);
      if (post.last_date) formData.append("last_date", post.last_date);

      formData.append("useful_links", JSON.stringify(post.useful_links ?? []));

      if (toDeleteImageUrls.size > 0) {
        formData.append(
          "deleteImageUrls",
          JSON.stringify(Array.from(toDeleteImageUrls))
        );
      }
      if (toDeletePdfUrls.size > 0) {
        formData.append(
          "deletePdfUrls",
          JSON.stringify(Array.from(toDeletePdfUrls))
        );
      }

      newImageFiles.forEach((file) => formData.append("attachments", file));
      newPdfFiles.forEach((file) => formData.append("pdfLink", file));

      const res = await axios.put(
        `${API_BASE_URL}/api/post/${postId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const updated = res.data?.post ?? res.data;
      onUpdated && onUpdated(updated);
      onClose && onClose();
    } catch (err) {
      console.error("Error updating post:", err.response?.data ?? err.message);
      setError("Failed to update post.");
    } finally {
      setSubmitting(false);
      newImagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
      setNewImagePreviews([]);
      setNewImageFiles([]);
      setNewPdfFiles([]);
      setNewPdfNames([]);
    }
  };

  if (loading) return <p className="text-gray-400">Loading...</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (!post) return <p className="text-red-400">Post not found.</p>;

  const dialog = (
    <div
      className={
        inline
          ? ""
          : "fixed inset-0 flex items-center justify-center bg-black/60 z-50 p-4"
      }
      onClick={!inline ? onClose : undefined}
    >
      <div
        className="bg-gray-900 rounded-xl shadow-lg w-full max-w-3xl border border-gray-700 overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-yellow-300 mb-3">
            ✏️ Edit Post
          </h2>

          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                value={post.title ?? ""}
                onChange={(e) => setPost({ ...post, title: e.target.value })}
                className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Post Title"
                required
              />

              <input
                type="number"
                value={post.index ?? 0}
                onChange={(e) => setPost({ ...post, index: e.target.value })}
                className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
                placeholder="Post Index"
                required
              />
            </div>

            <textarea
              value={post.description ?? ""}
              onChange={(e) =>
                setPost({ ...post, description: e.target.value })
              }
              className="w-full p-2 border rounded h-28 sm:h-32 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Post Description"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="date"
                value={post.start_date ? post.start_date.substring(0, 10) : ""}
                onChange={(e) =>
                  setPost({ ...post, start_date: e.target.value })
                }
                className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
                required
              />

              <input
                type="date"
                value={post.last_date ? post.last_date.substring(0, 10) : ""}
                onChange={(e) =>
                  setPost({ ...post, last_date: e.target.value })
                }
                className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <textarea
              value={(post.useful_links && post.useful_links.join("\n")) || ""}
              onChange={(e) =>
                setPost({
                  ...post,
                  useful_links: e.target.value
                    .split("\n")
                    .map((l) => l.trim())
                    .filter((l) => l !== ""),
                })
              }
              className="w-full p-2 border rounded h-20 bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
              placeholder="Enter useful links (one per line)"
            />

            {/* Existing images */}
            <div>
              <label className="text-gray-300 mb-2 block">
                🖼️ Current Images
              </label>
              <div className="flex gap-2 flex-wrap">
                {(post.attachments || []).length === 0 && (
                  <p className="text-sm text-gray-400">No images</p>
                )}
                {(post.attachments || []).map((url, idx) => {
                  const marked = toDeleteImageUrls.has(url);
                  return (
                    <div key={idx} className="relative w-28">
                      <img
                        src={url}
                        alt={`attachment-${idx}`}
                        className={`w-full h-20 object-cover rounded border ${
                          marked ? "opacity-30" : ""
                        }`}
                      />
                      <div className="mt-1 flex justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => window.open(url, "_blank", "noopener")}
                          className="text-xs text-blue-400 underline"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleDeleteExistingImage(url)}
                          className={`text-xs px-2 py-1 rounded ${
                            marked
                              ? "bg-green-600 text-white"
                              : "bg-red-600 text-white"
                          }`}
                        >
                          {marked ? "Undo" : "Remove"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Existing PDFs */}
            <div>
              <label className="text-gray-300 mb-2 block">
                📄 Current PDFs
              </label>
              <div className="space-y-2">
                {(post.pdfLink || []).length === 0 && (
                  <p className="text-sm text-gray-400">No PDFs</p>
                )}
                {(post.pdfLink || []).map((url, idx) => {
                  const marked = toDeletePdfUrls.has(url);
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-gray-800 p-2 rounded"
                    >
                      <div className="truncate max-w-[70%]">
                        <a
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
                        >
                          {url.split("/").pop() || `pdf-${idx + 1}`}
                        </a>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => toggleDeleteExistingPdf(url)}
                          className={`text-xs px-2 py-1 rounded ${
                            marked
                              ? "bg-green-600 text-white"
                              : "bg-red-600 text-white"
                          }`}
                        >
                          {marked ? "Undo" : "Remove"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* New images */}
            <div>
              <label className="text-gray-300 mb-2 block">
                🖼️ Add Images (you can pick multiple)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                ref={imageInputRef}
                onChange={handleSelectImages}
                className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
              />

              {newImagePreviews.length > 0 && (
                <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {newImagePreviews.map((p, i) => (
                    <div key={i} className="relative">
                      <img
                        src={p.url}
                        alt={p.name}
                        className="w-full h-20 object-cover rounded"
                      />
                      <div className="mt-1 flex justify-between items-center gap-2">
                        <div className="text-xs truncate max-w-[60%]">
                          {p.name}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeNewImageAt(i)}
                          className="text-xs bg-red-600 text-white px-2 py-0.5 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* New PDFs */}
            <div>
              <label className="text-gray-300 mb-2 block">
                📄 Add PDFs (you can pick multiple)
              </label>
              <input
                type="file"
                accept="application/pdf"
                multiple
                ref={pdfInputRef}
                onChange={handleSelectPdfs}
                className="w-full p-2 border rounded bg-gray-800 text-white focus:ring-2 focus:ring-blue-500"
              />

              {newPdfNames.length > 0 && (
                <div className="mt-2 space-y-1">
                  {newPdfNames.map((n, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-gray-800 p-2 rounded"
                    >
                      <div className="text-sm truncate max-w-[70%]">{n}</div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => removeNewPdfAt(i)}
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

            <div className="flex flex-col sm:flex-row gap-3 justify-between mt-4">
              <button
                type="button"
                onClick={() => {
                  newImagePreviews.forEach((p) => URL.revokeObjectURL(p.url));
                  setNewImagePreviews([]);
                  setNewImageFiles([]);
                  setNewPdfFiles([]);
                  setNewPdfNames([]);
                  onClose && onClose();
                }}
                className="w-full sm:w-auto bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition"
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-800 transition"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  if (inline) return dialog;
  return ReactDOM.createPortal(dialog, document.body);
}

export default EditPosts;
