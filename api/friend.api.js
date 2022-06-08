const router = require("express").Router();

const {
  sendFriendRequest,
  addFriend,
  removeFriend,
  getFriendsLogs,
} = require("../controllers/friend.controller");

const isLoggedIn = require("../middlewares/authenticate.middleware");

//send friend request
router.route("/:userId").post(isLoggedIn, sendFriendRequest);

//add friend
router.route("/:userId").put(isLoggedIn, addFriend);

//remove friend
router.route("/:userId").delete(isLoggedIn, removeFriend);

//get friends log
router.route("/").get(isLoggedIn, getFriendsLogs);

module.exports = router;
