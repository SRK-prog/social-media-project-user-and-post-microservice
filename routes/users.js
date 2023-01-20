const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const verifyToken = require("../middlewares/verifyToken");
const Responser = require("../utils/responser");
const Parser = require("../utils/parser");
const { userMessages, DEFAULTS } = require("../constants");

const { SUCCESS, ERROR } = userMessages;

//ProfileUpdate
router.put("/", verifyToken, async (req, res) => {
  const { user } = req.body;
  const userId = user.userId;
  const response = new Responser(res);
  try {
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const data = await User.findByIdAndUpdate(
      userId,
      { $set: req.body },
      { new: true }
    );
    const result = Parser.userData(data._doc);
    response.send({ message: SUCCESS.UPDATED, response: result });
  } catch (err) {
    response.error(err);
  }
});

//Delete Profile
router.delete("/", verifyToken, async (req, res) => {
  const { user } = req.body;
  const userId = user._id;
  const response = new Responser(res);
  try {
    await User.findByIdAndDelete(userId);
    response.send({ message: SUCCESS.DELETED });
  } catch (err) {
    response.error(err);
  }
});

// get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  const response = new Responser(res);
  const select = req.query.select || DEFAULTS.USER_SELECT;
  const query = userId ? { _id: userId } : { username };

  if (!query) throw { message: "Invalid request!", status: 400 };
  try {
    const user = await User.findOne(query).select(select);
    if (!user) throw { message: "No account Found!", status: 404 };
    response.send({ message: SUCCESS.FETCHED, response: user });
  } catch (err) {
    response.error(err);
  }
});

//follow
router.put("/profile/follow", verifyToken, async (req, res) => {
  const { user, profileId } = req.body;
  const requesterId = user.userId;
  const response = new Responser(res);

  if (requesterId === profileId)
    throw { message: ERROR.CANT_FOLLOW_YOUR, status: 403 };
  try {
    const [requester, profile] = await Promise.all([
      User.findById(requesterId),
      User.findById(profileId),
    ]);

    if (!requester || !profile)
      throw { message: ERROR.ACC_PROFILE_MISS, status: 404 };

    if (!profile.followers.includes(requesterId)) {
      await Promise.all([
        profile.updateOne({ $push: { followers: requesterId } }),
        requester.updateOne({ $push: { followings: profileId } }),
        addConversation(requester, profileId),
      ]);
      return response.send({ message: SUCCESS.FOLLOWED });
    }

    await Promise.all([
      profile.updateOne({ $pull: { followers: requesterId } }),
      requester.updateOne({ $pull: { followings: profileId } }),
      removeConversation(requester, profileId),
    ]);
    response.send({ message: SUCCESS.UNFOLLOWED });
  } catch (error) {
    response.error(error);
  }
});

async function addConversation(user, profileId) {
  if (!user.followers.includes(profileId)) {
    await new Conversation({
      members: [user._id.toString(), profileId],
    }).save();
  }
}

async function removeConversation(user, profileId) {
  if (!user.followers.includes(profileId)) {
    const convData = await Conversation.findOneAndDelete({
      members: { $all: [user._id.toString(), profileId] },
    });
    await Message.deleteMany({ conversationId: convData._id.toString() });
  }
}

//get followings
router.get("/get-followings", async (req, res) => {
  const { userId } = req.query;
  const response = new Responser(res);
  try {
    const { followings } = await User.findById(userId);
    if (!followings.length)
      throw { message: "No following found!", status: 404 };

    const result = await User.find({ _id: { $in: followings } }).select(
      DEFAULTS.USER_SELECT
    );

    response.send({ message: SUCCESS.FOLLOWING_FETCHED, response: result });
  } catch (err) {
    response.error(err);
  }
});

router.get("/get-followers", async (req, res) => {
  const { userId } = req.query;
  const response = new Responser(res);
  try {
    const { followers } = await User.findById(userId);
    if (!followers.length)
      throw { message: "No following found!", status: 404 };

    const result = await User.find({ _id: { $in: followers } }).select(
      DEFAULTS.USER_SELECT
    );

    response.send({ message: SUCCESS.FOLLOWERS_FETCHED, response: result });
  } catch (err) {
    response.error(err);
  }
});

module.exports = router;
