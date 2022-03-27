const router = require("express").Router();

const {
  addLeetcodeProfile,
  addCodeForcesProfile,
} = require("../controllers/platform.controller");

const isLoggedIn = require("../middlewares/authenticate.middleware");

//add leetcode platform
router.route("/platform/leetcode").post(isLoggedIn, addLeetcodeProfile);

//add codeforces platform
router.route("/platform/codeforces").post(isLoggedIn, addCodeForcesProfile);

module.exports = router;
