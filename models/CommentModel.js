const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    postId: { type: String, required: true, default: "" },
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: true, default: "" },
    userId: { type: String, required: true, default: "" },
    comment: { type: String, required: true, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("comment", CommentSchema);