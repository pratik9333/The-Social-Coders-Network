const router = require("express").Router();

const {
  rateUser,
  getLeaderBoardData,
} = require("../controllers/vote.controller");

const isLoggedIn = require("../middlewares/authenticate.middleware");

//rate friend
router.route("/user/:action/:userId").put(isLoggedIn, rateUser);

module.exports = router;
