const router = require("express").Router();

const { rateUser } = require("../controllers/vote.controller");

const isLoggedIn = require("../middlewares/authenticate.middleware");

//rate friend
router.route("/user/:action/:userId").post(isLoggedIn, rateUser);

module.exports = router;
