const User = require("../models/User.model");
const getCookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  const {
    name,
    email,
    password,
    leetcodeId,
    codeforcesId,
    codechefId,
    githubId,
  } = req.body;

  try {
    if (!req.files) {
      return res.status(400).json({ error: "Photo is required to signup" });
    }

    if (
      !name ||
      !email ||
      !password ||
      !leetcodeId ||
      !githubId ||
      !codeforcesId ||
      !codechefId
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const findExistingEmail = await User.findOne({ email });

    if (findExistingEmail) {
      return res.status(400).json({
        error:
          "Email is already registered, please try again with another email",
      });
    }

    const file = req.files.photo;

    //uploading file to cloudinary
    const result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
      folder: "users",
      width: 150,
      crop: "scale",
    });

    //creating user
    const user = await User.create({
      name,
      email,
      password,
      social: {
        githubProfile: { username: githubId },
        leetcodeProfile: { username: leetcodeId },
        codeforcesProfile: { username: codeforcesId },
        codechefProfile: { username: codechefId },
      },
      photo: {
        id: result.public_id,
        url: result.secure_url,
      },
      nextUpdateCycle: new Date().getTime(),
    });

    //this will create token, store in cookie and will send response to frontend
    getCookieToken(user, res);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Server has occured some problem, please try again" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "please provide email and password" });
  }

  try {
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ error: "email is incorrect" });
    }

    const result = bcrypt.compare(password, user.password);

    if (!result) {
      return res.status(401).json({ error: "password is incorrect" });
    }

    getCookieToken(user, res, req);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Server has occured some problem, please try again" });
  }
};

exports.logout = async (req, res) => {
  const options = {
    expires: new Date(Date.now()),
    httpOnly: true,
  };

  res.status(200).cookie("token", null, options).json({
    success: true,
    message: "Logout Success",
  });
};
