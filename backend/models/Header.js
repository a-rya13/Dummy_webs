import mongoose from "mongoose";

const headerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  index: {
    type: Number,
    required: true,
    unique: true,
  },
});
const Header = mongoose.model("Header", headerSchema);

export default Header;
