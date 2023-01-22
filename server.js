const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const mailRoute = require("./routes/mails");
const searchRoute = require("./routes/search");
const commentRoute = require("./routes/comment");
const resetPassword = require("./routes/resetPassword");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());
app.use(morgan(":method :url :response-time"));

const PORT = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("connected to mongo"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Microservice Running"));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/mail", mailRoute);
app.use("/api/search", searchRoute);
app.use("/api/comments", commentRoute);
app.use("/api/reset", resetPassword);

app.listen(PORT, () => {
  console.log("server running on ", PORT);

  if (process.env.NODE_ENV === "development") {
    console.log("local: ", `http://localhost:${PORT}/`);
  }
});
