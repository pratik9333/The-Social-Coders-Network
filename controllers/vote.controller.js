const Query = require("../utils/query");
const User = require("../models/User.model");

const updateExpiryTimeForRating = 2 * oneMinToMilli;

exports.rateUser = async (req, res) => {
  try {
    const { userId, action } = req.params;
    let flag = 0;

    if (!userId) {
      return res.status(400).json({ error: "Please provide user id" });
    }

    let user = await User.findById(userId);
    const currTime = new Date().getTime();

    for (let ratingUser of user.ratedBy) {
      if (ratingUser.user.toString() === req.user._id.toString()) {
        if (currTime <= ratingUser.expiryTime) {
          return res
            .status(400)
            .json({ error: "You have already rated this user" });
        }
        if (currTime >= ratingUser.expiryTime) {
          flag = 1;
          ratingUser.expiryTime =
            new Date().getTime() + updateExpiryTimeForRating;
        }
      }
    }

    if (flag === 0) {
      user.ratedBy.push({
        user: req.user._id,
        expiryTime: new Date().getTime() + updateExpiryTimeForRating,
      });
    }

    if (action === "upvote") {
      user.upvotes += 1;
    } else {
      user.downvotes += 1;
    }

    user.votes += 1;
    user.rating = (user.upvotes / (user.upvotes + user.downvotes || 1)) * 100;

    await user.save();

    res
      .status(200)
      .json({ success: true, message: `${user.name} was rated successfully` });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Server has occured some problem, please try again" });
  }
};

exports.getLeaderBoardData = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const resultPerPage = 10;

    const userObj = new Query(User.find(), req.query);

    userObj.sort();

    userObj.pager(resultPerPage);

    let Users = await userObj.base;
    let filteredUsers = Users.length;

    return res.status(200).json({
      success: true,
      data: Users,
      filteredUsers,
      usersCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      data: error.message,
    });
  }
};
