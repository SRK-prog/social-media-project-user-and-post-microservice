const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const mailRoute = require("./routes/mails");
const searchRoute = require("./routes/search");
const commentRoute = require("./routes/comment");
const resetPassword = require("./routes/resetPassword");

module.exports = (app) => {
  app.get("/", (req, res) => res.send("Microservice Running"));
  app.use("/auth", authRoute);
  app.use("/users", userRoute);
  app.use("/posts", postRoute);
  app.use("/mail", mailRoute);
  app.use("/search", searchRoute);
  app.use("/comments", commentRoute);
  app.use("/reset", resetPassword);
};
