const router = require("express").Router();
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const Token = require("../models/Token");
const Validator = require("../middlewares/validator");
const { resetMessages, DEFAULTS } = require("../constants");
const Responser = require("../utils/responser");
const sendEmail = require("../service/sendEmail");
const resetPasswordHtml = require("../templates/resetPwdEmailHtml");

const { SUCCESS, ERROR } = resetMessages;

router.post("/", Validator.email, async (req, res) => {
  const { body } = req;
  const response = new Responser(res);
  try {
    const user = await User.findOne({ email: body.email }).select(
      DEFAULTS.USER_SELECT
    );
    if (!user) throw { message: ERROR.EMAIL_NOT_EXIST, status: 400 };
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      const newToken = crypto.randomBytes(32).toString("hex");
      token = await new Token({ userId: user._id, token: newToken }).save();
    }

    const siteLink = process.env.WEB_APP_BASE_URL;

    const link = `${siteLink}/reset-password?id=${user._id}&token=${token.token}`;

    const html = resetPasswordHtml({
      username: user.username,
      siteLink,
      recoveryLink: link,
    });

    await sendEmail({ html, to: user.email });
    response.send({ message: SUCCESS.LINK_SENT });
  } catch (e) {
    response.error(e);
  }
});

router.post("/new", Validator.password, async (req, res) => {
  const { userId, token } = req.query;
  const response = new Responser(res);
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) throw { message: "Invalid link or expired", status: 400 };
    const tokenData = await Token.findOne({ userId: user._id, token });
    if (!tokenData) throw { message: "Invalid link or expired", status: 400 };
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt);
    await User.findOneAndUpdate(
      user._id,
      { $set: { password: hashedPass } },
      { new: true }
    );
    await tokenData.delete();
    response.send({ message: "password reset sucessfully." });
  } catch (error) {
    response.error(error);
  }
});

module.exports = router;
