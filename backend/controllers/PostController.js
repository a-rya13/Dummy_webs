import Post from "../models/Post.js";
import sanitizeHtml from "sanitize-html";
import { v2 as cloudinary } from "cloudinary";
import { uploadToCloudinary } from "../middleware/multer.js";
import path from "path";

// // ======================== CREATE ========================
// // export const createPost = async (req, res) => {
// //   try {
// //     const {
// //       title,
// //       category,
// //       description,
// //       index,
// //       useful_links,
// //       attachments,
// //       start_date,
// //       last_date,
// //     } = req.body;

// //     const newPost = new Post({
// //       title,
// //       category,
// //       description,
// //       index,
// //       useful_links,
// //       attachments,
// //       start_date,
// //       last_date,
// //     });

// //     await newPost.save();
// //     res
// //       .status(201)
// //       .json({ message: "✅ Post created successfully", post: newPost });
// //   } catch (error) {
// //     console.error("❌ Error creating post:", error.message);
// //     res.status(500).json({ message: "Server error", error: error.message });
// //   }
// // };

// // Create Post Controller
// export const createPost = async (req, res) => {
//   try {
//     const {
//       title,
//       category,
//       description,
//       index,
//       useful_links,
//       start_date,
//       last_date,
//     } = req.body;

//     // Cloudinary image URL comes from multer
//     const attachmentUrl = req.file ? req.file.path : null;

//     const newPost = new Post({
//       title,
//       category,
//       description,
//       index,
//       useful_links,
//       attachments: attachmentUrl,
//       start_date,
//       last_date,
//     });

//     await newPost.save();

//     res.status(201).json({
//       message: "Post created successfully",
//       post: newPost,
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // ======================== READ ========================
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error("❌ Error fetching posts:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    console.error("❌ Error fetching post:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// // ======================== UPDATE ========================
// export const updatePost = async (req, res) => {
//   try {
//     const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     if (!updatedPost)
//       return res.status(404).json({ message: "Post not found" });

//     res.json({ message: "✅ Post updated successfully", post: updatedPost });
//   } catch (error) {
//     console.error("❌ Error updating post:", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // ======================== DELETE ========================
export const deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost)
      return res.status(404).json({ message: "Post not found" });

    res.json({ message: "🗑️ Post deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting post:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// // ======================== FILTER ACTIVE POSTS ========================
export const getActivePosts = async (req, res) => {
  try {
    const today = new Date();
    const posts = await Post.find({ last_date: { $gte: today } }).sort({
      start_date: 1,
    });

    res.json(posts);
  } catch (error) {
    console.error("❌ Error fetching active posts:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// // ======================== FILTER EXPIRED POSTS ========================
export const getExpiredPosts = async (req, res) => {
  try {
    const today = new Date();
    const posts = await Post.find({ last_date: { $lt: today } }).sort({
      last_date: -1,
    });

    res.json(posts);
  } catch (error) {
    console.error("❌ Error fetching expired posts:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// // ======================== GET ALL HEADERS ========================
export const getHeaders = async (req, res) => {
  try {
    const headers = await Post.distinct("category"); // unique categories
    res.json(headers);
  } catch (error) {
    console.error(" Error fetching headers:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// CREATE (single file)//final
// export const createPost = async (req, res) => {
//   try {
//     const {
//       title,
//       category,
//       description,
//       index,
//       useful_links,
//       start_date,
//       last_date,
//     } = req.body;

//     if (!title || !category || !description) {
//       return res.status(400).json({ error: "title, category and description are required." });
//     }

//     // parse useful_links
//     let links = [];
//     if (useful_links) {
//       try {
//         links = JSON.parse(useful_links);
//         if (!Array.isArray(links)) links = [links];
//       } catch {
//         links = typeof useful_links === "string" ? [useful_links] : useful_links;
//       }
//     }

//     // sanitize description
//     const cleanDescription = sanitizeHtml(description, {
//       allowedTags: ["b", "i", "u", "a", "p", "ul", "li", "br", "strong", "em"],
//       allowedAttributes: { a: ["href", "target", "rel"] },
//     });

//     // upload single file (if present)
//     let attachments = [];
//     if (req.file) {
//       const result = await uploadToCloudinary(req.file.buffer, "posts");

//       attachments.push(result.secure_url);
//     }

//     const newPost = await Post.create({
//       title,
//       category,
//       description: cleanDescription,
//       index: Number(index) || 0,
//       useful_links: links,
//       attachments, // array with 0 or 1 item
//       start_date,
//       last_date,
//       createdAt: new Date(),
//     });

//     // optionally populate category if schema refs it
//     if (newPost.populate) await newPost.populate("category").execPopulate?.();

//     return res.status(201).json({ message: "Post created successfully", post: newPost });
//   } catch (error) {
//     console.error("createPost error:", error);
//     return res.status(500).json({ error: error.message || "Server error" });
//   }
// };

// UPDATE (single file — here we replace existing attachment if a new file is sent)

// export const updatePost = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const updates = req.body || {};

//     // parse useful_links if present (frontend sends JSON.stringify([...]) or a string)
//     if (updates.useful_links) {
//       try {
//         updates.useful_links = JSON.parse(updates.useful_links);
//         if (!Array.isArray(updates.useful_links)) updates.useful_links = [updates.useful_links];
//       } catch {
//         updates.useful_links = typeof updates.useful_links === "string"
//           ? [updates.useful_links]
//           : updates.useful_links;
//       }
//     }

//     // sanitize description if present
//     if (updates.description) {
//       updates.description = sanitizeHtml(updates.description, {
//         allowedTags: ["b", "i", "u", "a", "p", "ul", "li", "br", "strong", "em"],
//         allowedAttributes: { a: ["href", "target", "rel"] },
//       });
//     }

//     const post = await Post.findById(id);
//     if (!post) return res.status(404).json({ error: "Post not found" });

//     // Defensive normalization: if attachments stored as string (old/bad docs), convert to array of strings
//     if (post.attachments && typeof post.attachments === "string") {
//       try {
//         const parsed = JSON.parse(post.attachments);
//         if (Array.isArray(parsed)) {
//           // ensure array of strings
//           post.attachments = parsed.map((it) => (typeof it === "string" ? it : (it && it.url ? it.url : String(it))));
//         } else if (typeof parsed === "string") {
//           post.attachments = [parsed];
//         } else {
//           post.attachments = [];
//         }
//       } catch {
//         // not valid json -> treat as single url string
//         post.attachments = [post.attachments];
//       }
//     }

//     // If a new file is uploaded, upload to Cloudinary and replace attachments array with the secure_url
//     if (req.file) {
//       try {
//         const result = await uploadToCloudinary(req.file.buffer, "posts");
//         if (!result || !result.secure_url) {
//           console.error("Cloudinary returned no secure_url:", result);
//           return res.status(500).json({ error: "Cloudinary upload failed or returned no URL" });
//         }

//         // store only the URL string to match current schema ([String])
//         post.attachments = [result.secure_url];

//         // Optional: if you want to remove the old file from Cloudinary, you can do so here using the previous public_id
//         // if (oldPublicId) await cloudinary.uploader.destroy(oldPublicId);
//       } catch (err) {
//         console.error("Cloudinary upload error in updatePost:", err);
//         return res.status(500).json({ error: "Cloudinary upload failed", details: err.message || err });
//       }
//     }

//     // Merge other updates into post (but avoid overwriting attachments via req.body)
//     const skipKeys = new Set(["attachments"]);
//     Object.keys(updates).forEach((k) => {
//       if (skipKeys.has(k)) return;
//       // convert date strings to Date if needed for date fields
//       if ((k === "start_date" || k === "last_date") && updates[k]) {
//         post[k] = new Date(updates[k]);
//       } else {
//         post[k] = updates[k];
//       }
//     });

//     await post.save();
//     // optionally populate category if your schema refs it
//     if (post.populate) await post.populate("category").execPopulate?.();

//     return res.json({ message: "Post updated", post });
//   } catch (error) {
//     console.error("updatePost error:", error);
//     return res.status(500).json({ error: error.message || "Server error" });
//   }
// };
// PostController.js (replace updatePost)

/**
 * Helper: extract Cloudinary public_id from a secure_url.
 * Example:
 *  https://res.cloudinary.com/<cloud>/image/upload/v1758718131/posts/ex4eeqyljqubcvommdlt.jpg
 * Extracted public_id => posts/ex4eeqyljqubcvommdlt
 */
const extractPublicIdFromUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  const re = /\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+(?:\?.*)?$/;
  const m = url.match(re);
  return m && m[1] ? m[1] : null;
};

export const updatePost = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = req.body || {};

    // parse useful_links if present (frontend sends JSON.stringify([...]) or a string)
    if (updates.useful_links) {
      try {
        updates.useful_links = JSON.parse(updates.useful_links);
        if (!Array.isArray(updates.useful_links))
          updates.useful_links = [updates.useful_links];
      } catch {
        updates.useful_links =
          typeof updates.useful_links === "string"
            ? [updates.useful_links]
            : updates.useful_links;
      }
    }

    // sanitize description if present
    if (updates.description) {
      updates.description = sanitizeHtml(updates.description, {
        allowedTags: [
          "b",
          "i",
          "u",
          "a",
          "p",
          "ul",
          "li",
          "br",
          "strong",
          "em",
        ],
        allowedAttributes: { a: ["href", "target", "rel"] },
      });
    }

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Defensive normalization: if attachments stored as string (old/bad docs), convert to array of strings
    if (post.attachments && typeof post.attachments === "string") {
      try {
        const parsed = JSON.parse(post.attachments);
        if (Array.isArray(parsed)) {
          post.attachments = parsed.map((it) =>
            typeof it === "string" ? it : it && it.url ? it.url : String(it)
          );
        } else if (typeof parsed === "string") {
          post.attachments = [parsed];
        } else {
          post.attachments = [];
        }
      } catch {
        post.attachments = [post.attachments];
      }
    }

    // If a new file is uploaded, delete previous image (if any) and upload new one
    if (req.file) {
      // 1) attempt to delete old image if present
      try {
        const oldAttachments = post.attachments || [];
        if (oldAttachments.length > 0) {
          const first = oldAttachments[0];

          // If stored as object with public_id (unlikely in current schema), try that
          if (first && typeof first === "object" && first.public_id) {
            try {
              await cloudinary.uploader.destroy(first.public_id);
              console.log(
                "Deleted old Cloudinary image by public_id:",
                first.public_id
              );
            } catch (delErr) {
              console.warn(
                "Failed to delete old Cloudinary image by stored public_id:",
                delErr?.message ?? delErr
              );
            }
          } else if (typeof first === "string") {
            // attachments stored as URL string — try to extract public_id from URL
            const publicId = extractPublicIdFromUrl(first);
            if (publicId) {
              try {
                await cloudinary.uploader.destroy(publicId);
                console.log(
                  "Deleted old Cloudinary image by extracted public_id:",
                  publicId
                );
              } catch (delErr) {
                console.warn(
                  "Failed to delete old Cloudinary image by extracted public_id:",
                  delErr?.message ?? delErr
                );
              }
            } else {
              console.warn(
                "Could not determine public_id from attachments URL, skipping deletion."
              );
            }
          } else {
            console.warn("Old attachment format unknown — skipping deletion.");
          }
        }
      } catch (err) {
        console.error(
          "Error while attempting to delete old Cloudinary image:",
          err
        );
        // proceed to upload new file even if deletion fails
      }

      // 2) upload new file to Cloudinary
      try {
        const result = await uploadToCloudinary(req.file.buffer, "posts");
        if (!result || !result.secure_url) {
          console.error("Cloudinary returned no secure_url:", result);
          return res
            .status(500)
            .json({ error: "Cloudinary upload failed or returned no URL" });
        }

        // Save only the URL string to match your current schema ([String])
        post.attachments = [result.secure_url];
      } catch (uploadErr) {
        console.error("Cloudinary upload error in updatePost:", uploadErr);
        return res
          .status(500)
          .json({
            error: "Cloudinary upload failed",
            details: uploadErr.message || uploadErr,
          });
      }
    }

    // Merge other updates into post (but avoid overwriting attachments via req.body)
    const skipKeys = new Set(["attachments"]);
    Object.keys(updates).forEach((k) => {
      if (skipKeys.has(k)) return;
      // convert date strings to Date if needed for date fields
      if ((k === "start_date" || k === "last_date") && updates[k]) {
        post[k] = new Date(updates[k]);
      } else {
        post[k] = updates[k];
      }
    });

    await post.save();
    if (post.populate) await post.populate("category").execPopulate?.();

    return res.json({ message: "Post updated", post });
  } catch (error) {
    console.error("updatePost error:", error);
    return res.status(500).json({ error: error.message || "Server error" });
  }
};

// controllers/postController.js

import { v4 as uuidv4 } from "uuid";

// controllers/postController.js
import streamifier from "streamifier";

// Helper: upload buffer to Cloudinary using upload_stream
function uploadBufferToCloudinary(buffer, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(uploadStream);
    } catch (err) {
      reject(err);
    }
  });
}

// Controller: create post and upload files to Cloudinary
export const createPost = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      index,
      start_date,
      last_date,
      useful_links,
    } = req.body;

    if (
      !title ||
      !category ||
      !description ||
      index == null ||
      !start_date ||
      !last_date
    ) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const files = req.files || {};
    const attachmentsFiles = files.attachments || [];
    const pdfFiles = files.pdfLink || [];

    // Prepare upload promises
    const imageUploadPromises = attachmentsFiles.map((file) => {
      const publicId = `posts/images/${uuidv4()}`;
      return uploadBufferToCloudinary(file.buffer, {
        folder: "posts/images",
        resource_type: "image",
        public_id: publicId,
        overwrite: true,
      }).then((result) => result.secure_url || result.url);
    });

    const pdfUploadPromises = pdfFiles.map((file) => {
      // always give it a .pdf extension
      const publicId = `${uuidv4()}.pdf`;

      return uploadBufferToCloudinary(file.buffer, {
        folder: "posts/pdfs", // Cloudinary folder
        resource_type: "raw", // needed for PDFs
        public_id: publicId, // unique filename with .pdf
        overwrite: true,
      }).then((result) => result.secure_url || result.url);
    });

    // Execute uploads in parallel and handle errors with clear messages
    let imageUrls = [];
    let pdfUrls = [];
    try {
      imageUrls = await Promise.all(imageUploadPromises);
    } catch (err) {
      // wrap to make it obvious which type failed
      throw new Error("Image upload failed: " + (err?.message || String(err)));
    }

    try {
      pdfUrls = await Promise.all(pdfUploadPromises);
    } catch (err) {
      throw new Error("PDF upload failed: " + (err?.message || String(err)));
    }

    // parse useful_links if provided (accept JSON array or comma-separated string)
    let usefulLinksArray = [];
    if (useful_links) {
      try {
        usefulLinksArray = JSON.parse(useful_links);
        if (!Array.isArray(usefulLinksArray))
          usefulLinksArray = [usefulLinksArray];
      } catch {
        usefulLinksArray = useful_links
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    // Build the Post document
    const post = new Post({
      title: title.trim(),
      category,
      description,
      index: Number(index),
      useful_links: usefulLinksArray,
      attachments: imageUrls,
      pdfLink: pdfUrls,
      start_date: new Date(start_date),
      last_date: new Date(last_date),
    });

    await post.save();

    return res.status(201).json({ message: "Post created", post });
  } catch (err) {
    console.error("createPost error:", err);

    if (err?.code === 11000) {
      const dupField = Object.keys(err.keyValue || {})[0] || "field";
      return res.status(409).json({ message: `Duplicate ${dupField} value` });
    }

    // Send clearer error messages for upload failures
    return res.status(500).json({ message: err?.message || "Server error" });
  }
};
function extractPublicIdAndTypeFromUrl(url) {
  try {
    const u = new URL(url);
    // path like /<cloud>/raw/upload/v123/... or /<cloud>/image/upload/...
    // We find '/upload/' segment then remove optional version segment 'v\d+'
    const pathname = u.pathname; // e.g. /dndlscolw/raw/upload/v123/posts/pdfs/abcd.pdf
    const parts = pathname.split("/").filter(Boolean); // remove empty
    // find index of 'upload'
    const uploadIdx = parts.findIndex((p) => p === "upload");
    if (uploadIdx === -1) {
      // fallback: try to find 'raw' or 'image' then next parts
      // As last resort return entire path after cloud name
      const fallback = parts.slice(1).join("/");
      return { public_id: fallback, resource_type: "raw" };
    }

    // resource type is the segment before upload (e.g. 'raw' or 'image')
    const resourceType = parts[uploadIdx - 1] || "raw";

    // parts after 'upload'
    let afterUpload = parts.slice(uploadIdx + 1); // may start with v123
    if (afterUpload.length && /^v\d+$/.test(afterUpload[0])) {
      afterUpload = afterUpload.slice(1); // drop version segment
    }

    const publicId = afterUpload.join("/"); // e.g. posts/pdfs/abcd.pdf
    return {
      public_id: publicId,
      resource_type: resourceType === "raw" ? "raw" : "image",
    };
  } catch (err) {
    // on errors, return something that will likely fail server-side
    return { public_id: null, resource_type: "raw" };
  }
}
export const editPost = async (req, res) => {
  try {
    const postId = req.params.id;
    if (!postId) return res.status(400).json({ message: "Missing post id" });

    // Find existing post
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // parse body fields
    const {
      title,
      category,
      description,
      index,
      start_date,
      last_date,
      useful_links,
      deleteImageUrls,
      deletePdfUrls,
    } = req.body;

    // parse delete arrays (can be sent as JSON string or as arrays if client supports)
    let deleteImages = [];
    let deletePdfs = [];
    if (deleteImageUrls) {
      try {
        deleteImages =
          typeof deleteImageUrls === "string"
            ? JSON.parse(deleteImageUrls)
            : deleteImageUrls;
      } catch {
        // if not JSON, assume comma separated
        deleteImages = String(deleteImageUrls)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }
    if (deletePdfUrls) {
      try {
        deletePdfs =
          typeof deletePdfUrls === "string"
            ? JSON.parse(deletePdfUrls)
            : deletePdfUrls;
      } catch {
        deletePdfs = String(deletePdfUrls)
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
    }

    // Delete requested files from Cloudinary and remove their URLs from DB arrays
    // images
    for (const url of deleteImages) {
      const { public_id, resource_type } = extractPublicIdAndTypeFromUrl(url);
      if (!public_id) continue;
      try {
        await cloudinary.uploader.destroy(public_id, {
          resource_type: resource_type,
        });
      } catch (err) {
        console.warn(
          "Failed to destroy image on Cloudinary:",
          public_id,
          err?.message || err
        );
        // continue — still remove from DB
      }
      // remove URL(s) matching this url
      post.attachments = (post.attachments || []).filter((u) => u !== url);
    }

    // pdfs (resource_type raw)
    for (const url of deletePdfs) {
      const { public_id, resource_type } = extractPublicIdAndTypeFromUrl(url);
      if (!public_id) continue;
      try {
        await cloudinary.uploader.destroy(public_id, {
          resource_type: resource_type,
        });
      } catch (err) {
        console.warn(
          "Failed to destroy pdf on Cloudinary:",
          public_id,
          err?.message || err
        );
      }
      post.pdfLink = (post.pdfLink || []).filter((u) => u !== url);
    }

    // Handle newly uploaded files (req.files via multer memoryStorage)
    const files = req.files || {};
    const newImageFiles = files.attachments || [];
    const newPdfFiles = files.pdfLink || [];

    // Upload images (if any)
    if (newImageFiles.length > 0) {
      const imagePromises = newImageFiles.map((file) => {
        // keep original extension if available
        const ext = path.extname(file.originalname) || ".jpg";
        const publicId = `${uuidv4()}${ext}`;
        return uploadBufferToCloudinary(file.buffer, {
          folder: "posts/images",
          resource_type: "image",
          public_id: publicId,
          overwrite: true,
        });
      });

      const uploadedImages = await Promise.allSettled(imagePromises);
      uploadedImages.forEach((r) => {
        if (r.status === "fulfilled" && r.value?.url) {
          post.attachments = [...(post.attachments || []), r.value.url];
        } else {
          console.warn(
            "Image upload failed:",
            r.status === "rejected" ? r.reason : r
          );
        }
      });
    }

    // Upload pdfs (if any)
    if (newPdfFiles.length > 0) {
      const pdfPromises = newPdfFiles.map((file) => {
        // force .pdf extension
        const publicId = `${uuidv4()}.pdf`;
        return uploadBufferToCloudinary(file.buffer, {
          folder: "posts/pdfs",
          resource_type: "raw",
          public_id: publicId,
          overwrite: true,
        });
      });

      const uploadedPdfs = await Promise.allSettled(pdfPromises);
      uploadedPdfs.forEach((r) => {
        if (r.status === "fulfilled" && r.value?.url) {
          post.pdfLink = [...(post.pdfLink || []), r.value.url];
        } else {
          console.warn(
            "PDF upload failed:",
            r.status === "rejected" ? r.reason : r
          );
        }
      });
    }

    // Update other fields (only update those provided)
    if (title !== undefined) post.title = title.trim();
    if (category !== undefined) post.category = category;
    if (description !== undefined) post.description = description;
    if (index !== undefined) post.index = Number(index);
    if (start_date !== undefined) post.start_date = new Date(start_date);
    if (last_date !== undefined) post.last_date = new Date(last_date);

    // parse useful_links if provided
    if (useful_links !== undefined) {
      let usefulLinksArray = [];
      if (useful_links) {
        try {
          usefulLinksArray = JSON.parse(useful_links);
          if (!Array.isArray(usefulLinksArray))
            usefulLinksArray = [usefulLinksArray];
        } catch {
          usefulLinksArray = String(useful_links)
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        }
      }
      post.useful_links = usefulLinksArray;
    }

    // save updated post
    await post.save();

    return res.status(200).json({ message: "Post updated", post });
  } catch (err) {
    console.error("editPost error:", err);
    return res.status(500).json({ message: err?.message || "Server error" });
  }
};
