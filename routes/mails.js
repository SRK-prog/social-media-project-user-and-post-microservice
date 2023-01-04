const router = require("express").Router();
const Mail = require("../models/Mail");

//CREATE POST
router.post("/", async (req, res) => {
  try {
    const result = await new Mail(req.body).save();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
