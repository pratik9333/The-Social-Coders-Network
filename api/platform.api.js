const router = require("express").Router();

const {} = require("../controllers/platform.controller");

const isLoggedIn = require("../middlewares/authenticate.middleware");

//add github platform
router.route("/github").post(isLoggedIn, addGithubPlatform);

//add leetcode platform
router.route("/leetcode").post(isLoggedIn, addLeetcodePlatform);

//add hackerrank platform
router.route("/hackerrank").get(isLoggedIn, addHackerrankPlatform);

module.exports = router;
