import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// ================= REGISTER =================
export const registerAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingAdmin = await Admin.findOne({ username });
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

// ================= LOGIN =================
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ✅ Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      admin: { username: admin.username },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= CHANGE PASSWORD =================
export const changePassword = async (req, res) => {
  try {
    const { username, oldPassword, newPassword, confirmPassword } = req.body;

    // ✅ Check new passwords match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match ❌" });
    }

    // ✅ Find admin
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // ✅ Verify old password
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect ❌" });
    }

    // ✅ Hash and save new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.json({ message: "Password changed successfully ✅" });
  } catch (error) {
    console.error("❌ Error changing password:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
