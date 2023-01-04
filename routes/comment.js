const router = require("express").Router();
const CommentModel = require("../models/CommentModel");

router.get("/", async (req, res) => {
  try {
    const comments = await CommentModel.find({ postId: req.query.postId })
      .sort({ createdAt: -1 })
      .populate("user", "username profilepicture email");
    if (!comments.length || !comments)
      return res.status(404).json("No Comments Found!");
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  try {
    const comment = await new CommentModel({
      ...req.body,
      user: req.body.userId,
    }).save();
    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
