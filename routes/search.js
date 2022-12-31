const router = require("express").Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  const username = req.query.username;
  try {
    const result = await User.find({
      username: { $regex: username, $options: "$i" },
    }).select("username email profilepicture")
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
