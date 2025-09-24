// middleware/multer.js
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

// Multer will store files in memory (as buffer)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper function to upload to Cloudinary
export const uploadToCloudinary = async (fileBuffer, folder = "uploads") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder }, // target folder in Cloudinary
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

export default upload;

