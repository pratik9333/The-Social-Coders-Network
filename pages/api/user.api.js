const router = require("express").Router();

const {
  signup,
  login,
  logout,
  getUserDashboard,
  updateUserDetails,
  getUsers,
  sendFriendRequest,
  addFriend,
  rateUser,
  getLeaderBoardData,
} = require("../../controllers/user.controller");

const isLoggedIn = require("../../middlewares/authenticate.middleware");

//signup route
router.route("/signup").post(signup);

//login route
router.route("/signin").post(login);

//logout route
router.route("/signout").get(isLoggedIn, logout);

//get user dashboard
router.route("/user/dashboard").get(isLoggedIn, getUserDashboard);

//update user
router.route("/user").put(isLoggedIn, updateUserDetails);

//send friend request
router.route("/user/request/friend/:userId").put(isLoggedIn, sendFriendRequest);

//add friend
router.route("/user/add/friend/:userId").put(isLoggedIn, addFriend);

//rate friend
router.route("/user/rate/:action/:userId").put(isLoggedIn, rateUser);

//get users
router.route("/users").get(isLoggedIn, getUsers);

// get leaderboard data
router.route("/users/leaderboard").get(isLoggedIn, getLeaderBoardData);

module.exports = router;
