const router = require("express").Router();

const {
  signup,
  login,
  logout,
  getLoggedInUserDetails,
  updateUserDetails,
} = require("../controllers/user.controller");

const isLoggedIn = require("../middlewares/authenticate.middleware");

//signup route
router.route("/signup").post(signup);

//login route
router.route("/signin").post(login);

//logout route
router.route("/signout").get(isLoggedIn, logout);

//logged in user details
router.route("/user").get(isLoggedIn, getLoggedInUserDetails);

//update user
router.route("/user").put(isLoggedIn, updateUserDetails);

//get users with coding profiles
router.route("/users").get(getUserProfiles);

module.exports = router;
