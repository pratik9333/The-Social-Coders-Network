const router = require("express").Router();

const { addLeetcodeProfile } = require("../controllers/platform.controller");

const isLoggedIn = require("../middlewares/authenticate.middleware");

//add leetcode platform
router.route("/platform/leetcode").post(isLoggedIn, addLeetcodeProfile);

//add hackerrank platform
//router.route("platform/hackerrank").get(isLoggedIn, addHackerrankPlatform);

module.exports = router;
