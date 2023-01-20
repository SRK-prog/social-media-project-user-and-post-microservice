const router = require("express").Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Validator = require("../middlewares/validator");
const { errorMessages, userMessages } = require("../constants");
const Parser = require("../utils/parser");
const Responser = require("../utils/responser");

const { ACCOUNT_NOT_FOUND, INCORRECT_PASSWORD } = errorMessages;
const { SUCCESS } = userMessages;

//sign up
router.post("/signup", Validator.signup, async (req, res) => {
  const { body } = req;
  const response = new Responser(res);
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(body.password, salt);
    const _id = new mongoose.Types.ObjectId();
    const newUser = new User({
      _id,
      userId: _id,
      ...body,
      password: hashedPass,
    });
    const user = await newUser.save();
    const { username, email } = user;
    response.send({ message: SUCCESS.CREATED, response: { username, email } });
  } catch (err) {
    if (err.code && err.code === 11000) {
      err = {
        message:
          Object.values(err.keyValue || {}).join(", ") + " is already exist!",
        status: 409,
      };
    }
    response.error(err);
  }
});

// Login
router.post("/login", async (req, res) => {
  const response = new Responser(res);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) throw { message: ACCOUNT_NOT_FOUND, status: 400 };
    const validated = await bcrypt.compare(req.body.password, user.password);
    if (!validated) throw { message: INCORRECT_PASSWORD, status: 400 };

    const parsedData = Parser.userData(user._doc);
    const accessToken = await signJwt(parsedData);
    response.send({
      message: SUCCESS.LOGIN,
      response: { ...parsedData, accessToken },
    });
  } catch (err) {
    response.error(err);
  }
});

const signJwt = (data) => {
  return new Promise((resolve, reject) =>
    jwt.sign(
      data,
      process.env.JWT_SECRET_TOKEN,
      { expiresIn: "30d" },
      (err, token) => {
        if (err) return reject(err);
        resolve(token);
      }
    )
  );
};

module.exports = router;
