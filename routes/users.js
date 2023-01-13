const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//ProfileUpdate
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );
      const { password, ...others } = user._doc;
      res.status(200).json(others);
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});

//DeleteProfile

router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

//GetProfile

router.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const { password, updatedAt, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  const query = userId ? { _id: userId } : { username };
  if (!query) {
    return res.status(400).json("userId/username missing!");
  }
  try {
    const user = await User.findOne(query).select(
      "username email profilepicture createdAt lastSeen"
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//follow

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await Promise.all([
          user.updateOne({ $push: { followers: req.body.userId } }),
          currentUser.updateOne({ $push: { followings: req.params.id } }),
        ]);
        res.status(200).json("followed");
      } else {
        await Promise.all([
          user.updateOne({ $pull: { followers: req.body.userId } }),
          currentUser.updateOne({ $pull: { followings: req.params.id } }),
        ]);
        res.status(200).json("unfollowed");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//get friends
router.get("/followingfrnds/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followings.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let friendList = [];
    friends.map((friend) => {
      const { _id, username, profilepicture } = friend;
      friendList.push({ _id, username, profilepicture });
    });
    res.status(200).json(friendList);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/followerfrnds/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    const friends = await Promise.all(
      user.followers.map((friendId) => {
        return User.findById(friendId);
      })
    );
    let FollowersList = [];
    friends.map((friend) => {
      const { _id, username, profilepicture } = friend;
      FollowersList.push({ _id, username, profilepicture });
    });
    res.status(200).json(FollowersList);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
