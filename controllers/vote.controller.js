const User = require("../models/User.model");
const Votes = require("../models/Votes.model");

// 1 min = 60,000 milliseconds
const oneMinToMilli = 60_000;
const updateExpiryTimeForRating = 2 * oneMinToMilli;

exports.rateUser = async (req, res) => {
  try {
    let { userId, action } = req.params;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ error: "Cannot vote yourself!" });
    }

    if (!userId || !action) {
      return res
        .status(400)
        .json({ error: "Please provide userId and vote(-1 or 1) in params" });
    }

    const user = await User.findById(userId).select("+upvotes +downvotes");

    if (!user) {
      return res.status(400).json({
        error: `user not found`,
      });
    }

    action = parseInt(action);
    const Vote = await Votes.findOne({ user: userId, voter: req.user._id });
    const currTime = new Date().getTime();

    if (Vote && currTime <= Vote.expiryTime) {
      return res.status(400).json({
        error: `you already had rated ${user.name}, you can revote after sometime`,
      });
    }

    if (action === 2) {
      user.downvotes += 1;
    } else {
      user.upvotes += 1;
    }

    user.rating = (user.upvotes / (user.upvotes + user.downvotes || 1)) * 100;

    if (!Vote) {
      await Votes.create({
        user: userId,
        voter: req.user._id,
        status: action,
        expiryTime: currTime + updateExpiryTimeForRating,
      });
    } else {
      Vote.expiryTime = currTime + updateExpiryTimeForRating;
      Vote.status = action;
      await Vote.save();
    }

    await user.save();
    res.status(200).json({
      success: true,
      message: `${user.name} was rated successfully`,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Server has occured some problem, please try again" });
  }
};

exports.getRatedLogs = async (req, res) => {
  try {
    const ratingUsers = await Votes.find({
      user: req.user._id,
    }).populate("voter", "name rating");

    res.status(200).json({
      success: true,
      ratingUsers,
    });
  } catch (error) {
    res.status(500).json({ error: "Cannot able to fetch users" });
  }
};
