import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import headerRoutes from "./routes/headerRoutes.js";
import websiteRoutes from "./routes/websiteRoutes.js";
import "./config/cloudconfig.js";
dotenv.config();

// Connect Database
connectDB();

const app = express();

// ✅ Enable CORS so frontend (5173) can call backend (5000)
app.use(
  cors({
    origin: ["http://localhost:5173", process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);
app.use("/api/headers", headerRoutes);
app.use("/api/website", websiteRoutes);
// Test Route
app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

// Start Server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
