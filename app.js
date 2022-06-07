require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const AppError = require("./utils/Errors/customError");

//regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

//cookies and file middleware
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// home route
app.get("/", (req, res) => {
  res.send("<h1> Welcome to our social coding experience api! </h1>");
});

//import all routes here
const user = require("./api/user.api");
const User = require("./models/User.model");

// handling error if any of routes does not match
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// scheduler to remove expired rated users
app.put("/api/task", async (req, res) => {
  try {
    const appkey = req.header("Authorization").split(" ")[1];

    if (appkey !== process.env.APP_KEY) {
      return res.status(400).send(`Unauthenticated`);
    }

    await User.updateMany(
      {},
      {
        $pull: {
          ratedBy: {
            expiryTime: { $lt: new Date().getTime() },
          },
        },
      }
    );
    res.status(200).send("Success");
  } catch (error) {
    res.status(500).send(`${error.message}`);
  }
});

//router middleware
app.use("/api/v1", user);

module.exports = app;
