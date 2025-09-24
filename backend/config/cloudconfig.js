// cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config(); // loads .env file

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
// check-cloudinary-raw.js


const publicId = "posts/pdfs/3da10c42-515f-4a54-9ba3-1a3fd8343abb.pdf";

try {
  const info = await cloudinary.api.resource(publicId, { resource_type: "raw" });
  console.log({
    public_id: info.public_id,
    resource_type: info.resource_type, // should be 'raw'
    type: info.type,                   // <-- must be 'upload' for public delivery
    access_mode: info.access_mode,     // 'public' or 'authenticated'
    access_control: info.access_control, // ACL rules array if present
    url: info.secure_url,
  });
} catch (e) {
  console.error("Admin API error:", e?.error || e);
}

console.log("✅ Cloudinary setup successfully");
export default cloudinary;
