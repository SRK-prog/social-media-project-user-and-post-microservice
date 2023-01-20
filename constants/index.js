const DEFAULTS = {
  USER_SELECT: "username email profilepicture createdAt lastSeen",
};

const errorMessages = {
  ACCOUNT_NOT_FOUND:
    "The email address you entered isn't connected to an account.",
  INCORRECT_PASSWORD: "The password that you've entered is incorrect.",
};

const postMessages = {
  SUCCESS: {
    CREATED: "Post created successfully",
    UPDATED: "Post has been updated",
    DELETED: "Post has been deleted...",
    FETCHED: "Posts fetched successfully",
    LIKE: "Liked successfully",
    UNLIKE: "Unliked successfully",
  },
  ERROR: {
    CREATING: "An error occured while creating a post",
    UPDATE_YOURS: "You can update only your post!",
    DELETE_YOURS: "You can delete only your post!",
    UPDATING: "An error occured while updating a post",
    DELETING: "An error occured while deleting a post",
  },
};

const userMessages = {
  SUCCESS: {
    CREATED: "Account created successfully",
    UPDATED: "Account has been updated",
    DELETED: "Account has been deleted",
    FETCHED: "Account fetched successfully",
    FOLLOWED: "Followed successfully",
    UNFOLLOWED: "Unfollowed successfully",
    FOLLOWING_FETCHED: "Followings fetched successfully",
    FOLLOWERS_FETCHED: "Followers fetched successfully",
    LOGIN: "logged in successfully",
  },
  ERROR: {
    CREATING: "An error occured while creating a account",
    UPDATE_YOURS: "You can update only your account!",
    DELETE_YOURS: "You can delete only your account!",
    UPDATING: "An error occured while updating a account",
    DELETING: "An error occured while deleting a account",
    CANT_FOLLOW_YOUR: "You can't follow yourself",
    ACC_PROFILE_MISS: "profile or your account is not available"
  },
};

module.exports = {
  errorMessages,
  postMessages,
  userMessages,
  DEFAULTS,
};
