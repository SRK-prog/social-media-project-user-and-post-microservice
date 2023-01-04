const router = require("express").Router();
const Message = require("../models/Message");

// add message

router.post("/", async (req, res) => {
  try {
    const result = await new Message(req.body).save();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get message

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    }).sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
