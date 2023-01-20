class Parser {
  static userData(user, obj = {}) {
    return {
      _id: user._id,
      userId: user._id,
      username: user.username,
      email: user.email,
      profilepicture: user.profilepicture,
      city: user.city,
      lastSeen: user.lastSeen,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      ...obj,
    };
  }
}

module.exports = Parser;
