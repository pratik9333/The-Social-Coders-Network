const router = require("express").Router();

const {
  getUserDashboard,
  updateUserDetails,
  getUsers,
} = require("../controllers/user.controller");

const isLoggedIn = require("../middlewares/authenticate.middleware");

//get user dashboard
router.route("/user/dashboard").get(isLoggedIn, getUserDashboard);

//update user
router.route("/user").put(isLoggedIn, updateUserDetails);

//get users
router.route("/users").get(isLoggedIn, getUsers);

module.exports = router;
