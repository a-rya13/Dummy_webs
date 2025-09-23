import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Register Admin (for first setup)
export const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingAdmin = await Admin.findOne({ username });
    console.log(existingAdmin);

    if (existingAdmin) {
      return res.status(400).json({ message: "Admin already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({ username, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully ✅" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login Admin (plain text check only)

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("🔵 Login request received:", req.body);

    // ✅ Find admin
    const admin = await Admin.findOne({ username });
    console.log(admin);

    if (!admin) {
      console.log("❌ Admin not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Compare password with bcrypt
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.log("❌ Wrong password");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || "defaultsecret", // fallback if no secret in .env
      { expiresIn: "1h" } // token valid for 1 hour
    );

    console.log("✅ Login successful");
    res.json({
      message: "Login successful ✅",
      token, // send token to frontend
      admin: { username: admin.username },
    });
  } catch (error) {
    console.error("🔴 Server error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
