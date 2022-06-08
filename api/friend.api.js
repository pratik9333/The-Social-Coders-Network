const router = require("express").Router();

const {
  sendFriendRequest,
  addFriend,
  removeFriend,
} = require("../controllers/friend.controller");

const isLoggedIn = require("../middlewares/authenticate.middleware");

//send friend request
router.route("/request/:userId").put(isLoggedIn, sendFriendRequest);

//add friend
router.route("/add/:userId").put(isLoggedIn, addFriend);

//remove friend
router.route("/remove/:userId").delete(isLoggedIn, removeFriend);

module.exports = router;
