const router = require("express").Router();

const { rateUser, getRatedLogs } = require("../controllers/vote.controller");

const isLoggedIn = require("../middlewares/authenticate.middleware");

//rate friend
router.route("/user/:action/:userId").post(isLoggedIn, rateUser);

// get rated logs
router.route("/").get(isLoggedIn, getRatedLogs);

module.exports = router;
