// middleware/uploadMiddleware.js
import multer from "multer";

// Memory storage so we can upload buffers to Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB per file (adjust if needed)
  },
  fileFilter: (req, file, cb) => {
    // Accept images for attachments and PDFs for pdfLink
    const imagesMime = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const pdfMime = ["application/pdf"];

    // multer doesn't know the field name by default; check fieldname
    if (file.fieldname === "attachments") {
      if (imagesMime.includes(file.mimetype)) return cb(null, true);
      return cb(new Error("Only image files are allowed for 'attachments'"));
    }

    if (file.fieldname === "pdfLink") {
      if (pdfMime.includes(file.mimetype)) return cb(null, true);
      return cb(new Error("Only PDF files are allowed for 'pdfLink'"));
    }

    // reject any unexpected field
    return cb(new Error("Unexpected file field"));
  },
});

// Export middleware that expects both fields (each may be empty)
export const uploadFiles = upload.fields([
  { name: "attachments", maxCount: 20 },
  { name: "pdfLink", maxCount: 20 },
]);

export default uploadFiles;
