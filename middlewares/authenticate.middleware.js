const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/User.model");

const isLoggedIn = async (req, res, next) => {
  try {
    let token = req.cookies.token;

    if (!token && req.header("Authorization")) {
      token = req.header("Authorization").replace("Bearer ", "");
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    req.user.password = undefined;
    req.user.__v = undefined;
    req.user.createdAt = undefined;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
};

module.exports = isLoggedIn;
