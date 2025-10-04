import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Resend } from "resend";

// ================== Resend Setup ==================
// if (!process.env.RESEND_API_KEY) {
//   throw new Error("RESEND_API_KEY is missing in your .env file!");
// }
let resend;

export const getResendInstance = () => {
  if (!resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) throw new Error("RESEND_API_KEY is missing!");
    resend = new Resend(apiKey);
  }
  return resend;
};
// ================= REGISTER =================
export const registerAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin exists by username or email
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }],
    });
    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin with this username or email already exists ❌",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({ username, email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully ✅" });
  } catch (error) {
    console.error("❌ Register error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= LOGIN =================
export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin)
      return res.status(400).json({ message: "Invalid credentials ❌" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials ❌" });

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful ✅",
      token,
      admin: { username: admin.username, email: admin.email },
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= CHANGE PASSWORD =================
export const changePassword = async (req, res) => {
  try {
    const { username, oldPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "New passwords do not match ❌" });
    }

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ message: "Admin not found ❌" });

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect ❌" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.json({ message: "Password changed successfully ✅" });
  } catch (error) {
    console.error("❌ Change password error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= FORGOT PASSWORD =================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found ❌" });

    // Generate reset token (expires in 15 minutes)
    const resetToken = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "15m" }
    );

    // Frontend URL for password reset
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetLink = `${frontendUrl}/reset-password/${resetToken}`;

    // Send email using Resend
    const resend = getResendInstance();
    await resend.emails.send({
      from: "Admin Panel <onboarding@resend.dev>",
      to: email,
      subject: "Password Reset Request",
      html: `<p>Hello ${admin.username},</p>
             <p>You requested a password reset. Click below to reset:</p>
             <a href="${resetLink}" target="_blank">${resetLink}</a>
             <p>This link expires in 15 minutes.</p>`,
    });

    res.json({ message: "Password reset link sent to email ✅" });
  } catch (error) {
    console.error("❌ Forgot password error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= RESET PASSWORD =================
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match ❌" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "defaultsecret"
    );

    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(404).json({ message: "Admin not found ❌" });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.json({ message: "Password reset successful ✅" });
  } catch (error) {
    console.error("❌ Reset password error:", error.message);
    res.status(500).json({ message: "Invalid or expired token ❌" });
  }
};
