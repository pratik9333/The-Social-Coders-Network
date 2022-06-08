const router = require("express").Router();

const {
  getUserDashboard,
  updateUserDetails,
  getUsers,
  getLeaderBoardData,
} = require("../controllers/user.controller");

const isLoggedIn = require("../middlewares/authenticate.middleware");

//get user dashboard
router.route("/dashboard").get(isLoggedIn, getUserDashboard);

//update user
router.route("/").put(isLoggedIn, updateUserDetails);

//get users
router.route("/").get(isLoggedIn, getUsers);

// get leaderboard data
router.route("/leaderboard").get(isLoggedIn, getLeaderBoardData);

module.exports = router;
