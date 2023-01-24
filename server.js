const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./connections/connectDB")

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());
const isDev = process.env.NODE_ENV === "development";
const logFormat = isDev
  ? "dev"
  : '":method :url HTTP/:http-version" :status ":referrer" ":user-agent" [:date]';

app.use(morgan(logFormat));

async function listen() {
  const PORT = process.env.PORT || 8080;
  try {
    require("./routes")(app);
    await Promise.all([connectDB()]);
    app.listen(PORT, () => {
      if (isDev) console.log("local: ", `http://localhost:${PORT}/`);
    });
    console.log("Server start on port: ", PORT);
  } catch (error) {
    console.log("Failed to start server: ", error);
  }
}

listen();
