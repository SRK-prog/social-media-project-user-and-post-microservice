const router = require("express").Router();
const Mail = require("../models/Mail");
const Responser = require("../utils/responser");

//SAVE EMAIL
router.post("/", async (req, res) => {
  const response = new Responser(res);
  try {
    await new Mail(req.body).save();
    response.send({ message: "Message sent successfully" });
  } catch (err) {
    response.error(err);
  }
});

module.exports = router;
