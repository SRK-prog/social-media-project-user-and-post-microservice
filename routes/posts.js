const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const verifyToken = require("../middlewares/verifyToken");
const Responser = require("../utils/responser");
const { postMessages, DEFAULTS } = require("../constants");

const { SUCCESS, ERROR } = postMessages;

//CREATE POST
router.post("/", verifyToken, async (req, res) => {
  const { user, ...rest } = req.body;
  const userId = user._id;
  const response = new Responser(res);
  try {
    const result = await new Post({ ...rest, user: userId, userId }).save();
    response.send({ message: SUCCESS.CREATED, response: result });
  } catch (error) {
    response.error({ message: ERROR.CREATING, error });
  }
});

//UPDATE POST
router.put("/", verifyToken, async (req, res) => {
  const { user, postId, ...postData } = req.body;
  const userId = user.userId;
  const response = new Responser(res);
  try {
    const post = await Post.findById(postId);
    if (userId !== post.userId) {
      const message = ERROR.UPDATE_YOURS;
      throw { message, status: 401, error: message };
    }

    const result = await Post.findByIdAndUpdate(
      postId,
      { $set: postData },
      { new: true }
    );
    response.send({ message: SUCCESS.UPDATED, response: result });
  } catch (err) {
    response.error(err);
  }
});

//DELETE POST
router.delete("/", verifyToken, async (req, res) => {
  const { user, postId } = req.body;
  const userId = user.userId;
  const response = new Responser(res);
  try {
    const post = await Post.findById(postId);
    if (userId !== post.userId) {
      const message = ERROR.DELETE_YOURS;
      throw { message, status: 401, error: message };
    }

    await post.delete();
    response.send({ message: SUCCESS.DELETED });
  } catch (err) {
    response.error(err);
  }
});

// //GET POST
router.get("/", async (req, res) => {
  const response = new Responser(res);
  try {
    const post = await Post.findById(req.query.postId).populate(
      "user",
      DEFAULTS.USER_SELECT
    );

    if (!post) throw { message: "No Post Found!", status: 404 };
    response.send({ message: SUCCESS.FETCHED, response: post });
  } catch (err) {
    response.error(err);
  }
});

// //GET ALL POSTS
router.get("/get-all", async (req, res) => {
  let reqData = {};
  const response = new Responser(res);

  const username = req.query.user;
  if (username) reqData.username = username;
  try {
    const posts = await Post.find(reqData)
      .sort({ createdAt: -1 })
      .populate("user", DEFAULTS.USER_SELECT);
    if (!posts.length) throw { message: "No Posts Found!", status: 404 };
    response.send({ message: SUCCESS.FETCHED, response: posts });
  } catch (err) {
    response.error(err);
  }
});

//like
router.put("/like", verifyToken, async (req, res) => {
  const { user, postId } = req.body;
  const response = new Responser(res);
  try {
    const post = await Post.findById(postId);
    if (!post.likes.includes(user.userId)) {
      await post.updateOne({ $push: { likes: user.userId } });
      return response.send({ message: SUCCESS.LIKE });
    }
    await post.updateOne({ $pull: { likes: user.userId } });
    response.send({ message: SUCCESS.UNLIKE });
  } catch (err) {
    response.error(err);
  }
});

//get friends posts
router.get("/timeline", verifyToken, async (req, res) => {
  const { user } = req.body;
  const response = new Responser(res);
  try {
    const currentUser = await User.findById(user.userId);
    const results = await Post.find({
      userId: { $in: currentUser.followings },
    })
      .sort({ createdAt: -1 })
      .populate("user", DEFAULTS.USER_SELECT);
    if (!results.length) throw { message: "No Posts Found!", status: 404 };
    response.send({ message: SUCCESS.FETCHED, response: results });
  } catch (err) {
    response.error(err);
  }
});

//get user all posts
router.get("/profile", async (req, res) => {
  const { userId } = req.query;
  const response = new Responser(res);

  try {
    const posts = await Post.find({ userId })
      .sort({ createdAt: -1 })
      .populate("user", DEFAULTS.USER_SELECT);
    if (!posts.length) throw { message: "No Posts Found!", status: 404 };
    response.send({ message: SUCCESS.FETCHED, response: posts });
  } catch (err) {
    response.error(err);
  }
});

module.exports = router;
