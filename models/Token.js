const mongoose = require("mongoose");

const TokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },
  expire_at: { type: Date, default: Date.now, expires: 3600 },
});

module.exports = mongoose.model("reset-token", TokenSchema);
