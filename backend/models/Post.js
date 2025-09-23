import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    category: {
      type: String, // You may later reference headers: { type: mongoose.Schema.Types.ObjectId, ref: "Header" }
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    index: {
      type: Number, // better as Number since it's an ordering index
      required: true,
      unique: true,
    },
    useful_links: [
      {
        type: String, // allow multiple links
        trim: true,
      },
    ],
    attachments: [
      {
        type: String, // store file URLs or file paths
      },
    ],
    start_date: {
      type: Date,
      required: true,
    },
    last_date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;
