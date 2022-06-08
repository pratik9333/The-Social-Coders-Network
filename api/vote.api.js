const router = require("express").Router();

const {
  rateUser,
  getLeaderBoardData,
} = require("../controllers/vote.controller");

const isLoggedIn = require("../middlewares/authenticate.middleware");

//rate friend
router.route("/user/rate/:action/:userId").put(isLoggedIn, rateUser);

// get leaderboard data
router.route("/users/leaderboard").get(isLoggedIn, getLeaderBoardData);

module.exports = router;
