import Post from "../models/Post.js";

// ======================== CREATE ========================
// export const createPost = async (req, res) => {
//   try {
//     const {
//       title,
//       category,
//       description,
//       index,
//       useful_links,
//       attachments,
//       start_date,
//       last_date,
//     } = req.body;

//     const newPost = new Post({
//       title,
//       category,
//       description,
//       index,
//       useful_links,
//       attachments,
//       start_date,
//       last_date,
//     });

//     await newPost.save();
//     res
//       .status(201)
//       .json({ message: "✅ Post created successfully", post: newPost });
//   } catch (error) {
//     console.error("❌ Error creating post:", error.message);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// Create Post Controller
export const createPost = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      index,
      useful_links,
      start_date,
      last_date,
    } = req.body;

    // Cloudinary image URL comes from multer
    const attachmentUrl = req.file ? req.file.path : null;

    const newPost = new Post({
      title,
      category,
      description,
      index,
      useful_links,
      attachments: attachmentUrl,
      start_date,
      last_date,
    });

    await newPost.save();

    res.status(201).json({
      message: "Post created successfully",
      post: newPost,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ======================== READ ========================
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

// ======================== UPDATE ========================
export const updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedPost)
      return res.status(404).json({ message: "Post not found" });

    res.json({ message: "✅ Post updated successfully", post: updatedPost });
  } catch (error) {
    console.error("❌ Error updating post:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ======================== DELETE ========================
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

// ======================== FILTER ACTIVE POSTS ========================
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

// ======================== FILTER EXPIRED POSTS ========================
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

// ======================== GET ALL HEADERS ========================
export const getHeaders = async (req, res) => {
  try {
    const headers = await Post.distinct("category"); // unique categories
    res.json(headers);
  } catch (error) {
    console.error(" Error fetching headers:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
