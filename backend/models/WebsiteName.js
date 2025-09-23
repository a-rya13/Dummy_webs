import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const websiteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const Website = mongoose.model("Website", websiteSchema);

export default Website;
