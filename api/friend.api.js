const router = require("express").Router();

const {
  sendFriendRequest,
  addFriend,
} = require("../controllers/friend.controller");

const isLoggedIn = require("../middlewares/authenticate.middleware");

//send friend request
router.route("/request/:userId").put(isLoggedIn, sendFriendRequest);

//add friend
router.route("/add/:userId").put(isLoggedIn, addFriend);

module.exports = router;
