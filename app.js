require("dotenv").config();
const cors = require("cors");
const express = require("express");
const app = express();
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
//app.use(morgan("tiny"));

//import all routes here
const user = require("./api/user.api");
const platform = require("./api/platform.api");

// Access-Control-Allow-Origin: https://foo.example
// Access-Control-Allow-Methods: POST, GET, OPTIONS
// Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
// Access-Control-Max-Age: 86400

app.use((req, res, next) => {
  next();
});

//router middleware
app.use("/api/v1", user);
app.use("/api/v1", platform);

module.exports = app;
