const router = require("express").Router();

const {
  sendFriendRequest,
  addFriend,
} = require("../controllers/friend.controller");

const isLoggedIn = require("../middlewares/authenticate.middleware");

//send friend request
router.route("/user/request/friend/:userId").put(isLoggedIn, sendFriendRequest);

//add friend
router.route("/user/add/friend/:userId").put(isLoggedIn, addFriend);

module.exports = router;
