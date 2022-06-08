const User = require("../models/User.model");
const Friend = require("../models/Friends.model");

exports.sendFriendRequest = async (req, res) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({ error: "Please provide friend's user id" });
    }

    if (req.params.userId.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const check = await Friend.find({
      requester: req.user._id,
      recipient: req.params.userId,
    });

    if (check.length !== 0) {
      if (check[0].status === 1)
        return res
          .status(400)
          .json({ error: "You already sent friend request!" });

      if (check[0].status === 2)
        return res
          .status(400)
          .json({ error: "User had already sent you friend request" });

      if (check[0].status === 3)
        return res.status(400).json({ error: "Already friends!" });
    }

    const statusFriendA = await Friend.create({
      requester: req.user._id,
      recipient: req.params.userId,
      status: 1,
    });

    const statusFriendB = await Friend.create({
      requester: req.params.userId,
      recipient: req.user._id,
      status: 2,
    });

    //update user A
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { friends: statusFriendA._id },
    });

    //update user A
    await User.findByIdAndUpdate(req.params.userId, {
      $addToSet: { friends: statusFriendB._id },
    });

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

    const check = await Friend.find({
      requester: req.user._id,
      recipient: req.params.userId,
    });

    if (check.length === 0) {
      return res.status(403).json({ error: "User not found in list" });
    }

    if (check[0].status === 3)
      return res.status(400).json({ error: "Already friends!" });

    if (check[0].status === 1)
      return res.status(400).json({ error: "Already send friend request!" });

    // updating status of friend 1
    await Friend.findOneAndUpdate(
      { requester: req.user._id, recipient: req.params.userId },
      { $set: { status: 3 } }
    );

    // updating status of friend 2
    await Friend.findOneAndUpdate(
      { requester: req.params.userId, recipient: req.user._id },
      { $set: { status: 3 } }
    );

    res.status(200).json({ success: true, message: "Friend added to list!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Server has occured some problem, please try again" });
  }
};

exports.removeFriend = async (req, res) => {
  try {
    if (!req.params.userId) {
      return res.status(400).json({ error: "Please provide friend user id" });
    }

    const friend1 = await Friend.findOneAndDelete({
      requester: req.user._id,
      recipient: req.params.userId,
    });

    const friend2 = await Friend.findOneAndDelete({
      recipient: req.user._id,
      requester: req.params.userId,
    });

    // removing friend from array

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { friends: friend1._id },
    });

    await User.findByIdAndUpdate(req.params.userId, {
      $pull: { friends: friend2._id },
    });

    res.status(200).json({ success: true, message: "Friend added to list!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Server has occured some problem, please try again" });
  }
};
