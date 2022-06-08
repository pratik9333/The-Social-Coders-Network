const router = require("express").Router();

const { signup, login, logout } = require("../controllers/auth.controller");

const isLoggedIn = require("../middlewares/authenticate.middleware");

//signup route
router.route("/signup").post(signup);

//login route
router.route("/signin").post(login);

//logout route
router.route("/signout").get(isLoggedIn, logout);

module.exports = router;
