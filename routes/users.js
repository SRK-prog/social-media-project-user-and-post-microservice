const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Conversation = require("../models/Conversation");

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

router.put("/profile/follow", async (req, res) => {
  const { requesterId, profileId } = req.body;
  if (requesterId === profileId)
    return res.status(403).json("You can't follow yourself");
  try {
    const [requester, profile] = await Promise.all([
      User.findById(requesterId),
      User.findById(profileId),
    ]);

    if (!requester || !profile)
      return res.status(404).json("profile or your account is not available");

    if (!profile.followers.includes(requesterId)) {
      await Promise.all([
        profile.updateOne({ $push: { followers: requesterId } }),
        requester.updateOne({ $push: { followings: profileId } }),
        addConversation(requester, profileId),
      ]);
      res.status(200).json("followed");
    } else {
      await Promise.all([
        profile.updateOne({ $pull: { followers: requesterId } }),
        requester.updateOne({ $pull: { followings: profileId } }),
        removeConversation(requester, profileId),
      ]);
      res.status(200).json("unfollowed");
    }
  } catch (error) {
    res.status(500).json(error);
  }
});

async function addConversation(user, profileId) {
  if (!user.followers.includes(profileId)) {
    await new Conversation({ members: [user._id.toString(), profileId] }).save();
  }
}

async function removeConversation(user, profileId) {
  if (!user.followers.includes(profileId)) {
    await Conversation.findOneAndDelete({
      members: { $all: [user._id.toString(), profileId] },
    });
  }
}

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
