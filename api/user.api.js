const router = require("express").Router();

const {
  signup,
  login,
  logout,
  getLoggedInUserDetails,
  updateUserDetails,
  addGithubId,
  getUsers,
  sendFriendRequest,
  addFriend,
  rateUser,
  getLeaderBoardData
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

//add github id
router.route("/user/githubId").put(isLoggedIn, addGithubId);

//send friend request
router.route("/user/request/friend/:userId").put(isLoggedIn, sendFriendRequest);

//add friend
router.route("/user/add/friend/:userId").put(isLoggedIn, addFriend);

//rate friend
router.route("/user/rate/:userId").put(isLoggedIn, rateUser);

//get users
router.route("/users").get(getUsers);

// get leaderboard data
router.route("/users/leaderboard").get(isLoggedIn, getLeaderBoardData);

module.exports = router;
