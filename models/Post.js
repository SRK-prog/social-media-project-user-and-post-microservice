const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, default: "" },
    description: { type: String, required: true, default: "" },
    photo: { type: String, default: "" },
    likes: { type: Array, default: [] },
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true, default: "" },
    userId: { type: String, required: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
