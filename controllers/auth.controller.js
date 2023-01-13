const User = require("../models/User.model");
const getCookieToken = require("../utils/cookieToken");
const cloudinary = require("cloudinary");
const bcrypt = require("bcryptjs");

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const findExistingEmail = await User.findOne({ email });

    if (findExistingEmail) {
      return res.status(400).json({
        error:
          "Email is already registered, please try again with another email",
      });
    }

    //creating user
    const user = await User.create({
      name,
      email,
      password,
    });

    const token = user.getJwtToken();
    res.cookie("token", token, { maxAge: 900000, httpOnly: true });

    res.status(200).json({
      success: true,
      token: token,
      user,
    });
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
    const user = await User.findOne({ email }).select("+password -social");

    if (!user) {
      return res.status(401).json({ error: "email is incorrect" });
    }

    const result = bcrypt.compare(password, user.password);

    if (!result) {
      return res.status(401).json({ error: "password is incorrect" });
    }

    const token = user.getJwtToken();
    res.cookie("token", token, { maxAge: 900000, httpOnly: true });

    res.status(200).json({
      success: true,
      token: token,
      user,
    });
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
