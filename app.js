require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

//regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({credentials:true,origin:'http://localhost:3000'}));
//cookies and file middleware
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

//morgan middleware
app.use(morgan("tiny"));

//import all routes here
const user = require("./api/user.api");
const platform = require("./api/platform.api");

app.get("/", (req, res) => {
  res.json({ success: true, message: "Greetings from our api" });
});

//router middleware
app.use("/api/v1", user);
app.use("/api/v1", platform);

module.exports = app;
