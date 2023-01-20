const User = require("../models/User.model");
const Friend = require("../models/Friends.model");

exports.sendFriendRequest = async (req, res) => {
  // USER A - The one who is sending the friend request
  // USER B - The one who is getting the friend request

  try {
    if (!req.params.userId) {
      return res.status(400).json({ error: "Please provide friend's user id" });
    }

    if (req.params.userId.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    // fetching friend req status details
    const checkStatus = await Friend.find({
      requester: req.user._id,
      recipient: req.params.userId,
    });

    // checking status. Res array will be empty on sending request first time
    if (checkStatus.length !== 0) {
      if (checkStatus[0].status === 1)
        return res
          .status(400)
          .json({ error: "You already sent friend request!" });

      if (checkStatus[0].status === 2)
        return res
          .status(400)
          .json({ error: "User had already sent you friend request" });

      if (checkStatus[0].status === 3)
        return res.status(400).json({ error: "Already friends!" });
    }

    // creating friend req status model having requester - USER A, recipient - USER B
    // with status = 1 i.e USER A already sent friend request to USER B and cannot send again

    const statusFriendA = await Friend.create({
      requester: req.user._id,
      recipient: req.params.userId,
      status: 1,
    });

    // creating friend req status model having requester - USER B, recipient - USER A
    // with status = 2 i.e USER B already got friend request from USER A thus USER B...
    // cannot send again to USER A

    const statusFriendB = await Friend.create({
      requester: req.params.userId,
      recipient: req.user._id,
      status: 2,
    });

    //update user A
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $addToSet: { friends: statusFriendA._id },
      },
      { new: true }
    );

    //update user B
    await User.findByIdAndUpdate(
      req.params.userId,
      {
        $addToSet: { friends: statusFriendB._id },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Friend request was sent successfully`,
    });
  } catch (error) {
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

    if (!friend1 || !friend2) {
      return res.status(400).json({ error: "User not found or invalid ID" });
    }

    // removing friend from array
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { friends: friend1._id },
    });

    await User.findByIdAndUpdate(req.params.userId, {
      $pull: { friends: friend2._id },
    });

    res
      .status(200)
      .json({ success: true, message: "Friend removed from list!" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Server has occured some problem, please try again" });
  }
};

exports.getFriendsLogs = async (req, res) => {
  try {
    let user = await Friend.find({ requester: req.user._id }).populate(
      "recipient"
    );

    return res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ error: error, message: "server error" });
  }
};
