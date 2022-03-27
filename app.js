require("dotenv").config();
const express = require("express");
const app = express();

const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

//regular middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
const user = require("./api/user.api.js");
const platform = require("./api/platform.api");

//router middleware
app.use("/api/v1", user);
app.use("/api/v1", platform);

module.exports = app;
