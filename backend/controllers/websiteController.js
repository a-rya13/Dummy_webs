import Website from "../models/WebsiteName.js";

// ======================== SET / UPDATE TITLE ========================
export const setWebsiteTitle = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title)
      return res.status(400).json({ message: "⚠️ Title is required" });

    // Delete all old records (ensures only one title exists)
    await Website.deleteMany({});

    // Create a new title
    const website = new Website({ title });
    await website.save();

    res.status(201).json({ message: "✅ Website title updated", website });
  } catch (error) {
    console.error("❌ Error setting website title:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ======================== GET TITLE ========================
export const getWebsiteTitle = async (req, res) => {
  try {
    const website = await Website.findOne();
    if (!website)
      return res.status(404).json({ message: "⚠️ No website found" });

    res.json(website);
  } catch (error) {
    console.error("❌ Error fetching website title:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
