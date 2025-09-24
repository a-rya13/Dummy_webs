import Header from "../models/Header.js";
import Post from "../models/Post.js"; // ✅ Import Post model

// ======================== CREATE ========================
export const createHeader = async (req, res) => {
  try {
    const { name, index } = req.body;

    // check duplicates
    const existing = await Header.findOne({ $or: [{ name }, { index }] });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Header name or index already exists" });
    }

    const newHeader = new Header({ name, index });
    await newHeader.save();

    res
      .status(201)
      .json({ message: "✅ Header created successfully", header: newHeader });
  } catch (error) {
    console.error("❌ Error creating header:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ======================== GET ALL ========================
export const getHeaders = async (req, res) => {
  try {
    const headers = await Header.find().sort({ index: 1 });
    res.json(headers);
  } catch (error) {
    console.error("❌ Error fetching headers:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ======================== GET ONE ========================
export const getHeaderById = async (req, res) => {
  try {
    const { id } = req.params;
    const header = await Header.findById(id);
    if (!header) return res.status(404).json({ message: "Header not found" });
    res.json(header);
  } catch (error) {
    console.error("❌ Error fetching header:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ======================== UPDATE ========================
export const updateHeader = async (req, res) => {
  try {
    const { id } = req.params; // ✅ find by _id
    const { name, index } = req.body;

    const header = await Header.findById(id);
    if (!header) return res.status(404).json({ message: "Header not found" });

    const prevName = header.name;

    // update header
    header.name = name || header.name;
    header.index = index || header.index;
    await header.save();

    // ✅ Cascade update in posts if name changed
    if (name && name !== prevName) {
      await Post.updateMany({ category: prevName }, { category: name });
    }

    res.json({ message: "✅ Header updated successfully", header });
  } catch (error) {
    console.error("❌ Error updating header:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ======================== DELETE ========================
export const deleteHeader = async (req, res) => {
  try {
    const { id } = req.params;

    const header = await Header.findById(id);
    if (!header) return res.status(404).json({ message: "Header not found" });

    // delete header
    await header.deleteOne();

    // ✅ Cascade delete posts under this header
    await Post.deleteMany({ category: header.name });

    res.json({
      message: `🗑️ Header '${header.name}' and all related posts deleted successfully`,
    });
  } catch (error) {
    console.error("❌ Error deleting header:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
