const User = require("../models/User.model");

exports.sendFriendRequest = async (req, res) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({ error: "Please provide friend's user id" });
    }

    const user = await User.findById(req.params.userId);

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    //first test case
    for (let friend of req.user.friendRequests) {
      if (friend.toString() === req.params.userId) {
        return res
          .status(400)
          .json({ error: "User had already sent you friend request" });
      }
    }

    //second test case
    for (let friend of user.friendRequests) {
      if (friend.toString() === req.user._id.toString()) {
        return res
          .status(400)
          .json({ error: "Friend request was already sent" });
      }
    }

    // third test case
    for (let friend of user.friends) {
      if (friend.toString() === req.user._id.toString()) {
        return res.status(400).json({ error: "User is already friend" });
      }
    }

    user.friendRequests.push(req.user._id);

    await user.save();

    res.status(200).json({ success: true, message: "Friend request is sent" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Server has occured some problem, please try again" });
  }
};

exports.addFriend = async (req, res) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({ error: "Please provide friend user id" });
    }

    const currrentUser = await User.findById(req.user._id);
    const usersFriend = await User.findById(req.params.userId);

    let lengthFriendRequests = currrentUser.friendRequests.length;

    let filteredFriendRequest = currrentUser.friendRequests.filter(
      (friend) => friend._id.toString() !== usersFriend._id.toString()
    );

    //test case 1
    for (let friend of usersFriend.friends) {
      if (friend._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ error: "User is already friend" });
      }
    }

    //test case 2
    if (lengthFriendRequests === filteredFriendRequest.length) {
      return res.status(400).json({ error: "Invalid Id" });
    }

    currrentUser.friendRequests = filteredFriendRequest.slice(0);

    currrentUser.friends.push(usersFriend._id);
    usersFriend.friends.push(currrentUser._id);

    await currrentUser.save();
    await usersFriend.save();

    res.status(200).json({ success: true, message: "Friend added" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Server has occured some problem, please try again" });
  }
};
