const mongoose = require("mongoose");
const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, default: "" },
    description: { type: String, required: true, default: "" },
    photo: { type: String, default: "" },
    username: { type: String, required: true, default: "" },
    likes: { type: Array, default: [] },
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true, default: "" },
    userId: { type: String, required: true, default: "" },
    comments: [{ comment: String, userId: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
