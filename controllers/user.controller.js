const User = require("../models/User.model");
const cloudinary = require("cloudinary");
const Query = require("../utils/query");

const {
  fetchCodeChef,
  fetchGithub,
  fetchLeetcode,
  fetchCodeForces,
} = require("../utils/ExternalAPI/fetchCodeData");

// 1 min = 60,000 milliseconds
const oneMinToMilli = 60_000;
const updateCycleOfDashboard = 30 * oneMinToMilli;

exports.getUserDashboard = async (req, res) => {
  try {
    let loggedUser = await User.findById(req.user._id);

    const currTime = new Date().getTime();
    const nextUpdateCycle = loggedUser.nextUpdateCycle;

    if (currTime >= nextUpdateCycle) {
      //

      // adding user profile details coding profile details
      const codechefData = await fetchCodeChef(loggedUser);
      const codeforcesData = await fetchCodeForces(loggedUser);
      const githubData = await fetchGithub(loggedUser);
      const leetcodeData = await fetchLeetcode(loggedUser);

      // updating coding handles
      if (githubData) loggedUser.social.githubProfile = githubData;
      if (codechefData) loggedUser.social.codechefProfile = codechefData;
      if (codeforcesData) loggedUser.social.codeforcesProfile = codeforcesData;
      if (leetcodeData) loggedUser.social.leetcodeProfile = leetcodeData;

      //updating next update cycle
      loggedUser.nextUpdateCycle =
        new Date().getTime() + updateCycleOfDashboard;

      loggedUser = await loggedUser.save();

      //
    }

    return res.status(200).json({ success: true, loggedUser });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error while getting user dashboard, please try again" });
  }
};

exports.updateUserDetails = async (req, res) => {
  try {
    let updateUser = {
      name: req.body.name ? req.body.name : req.user.name,
      email: req.body.email ? req.body.email : req.user.email,
    };

    if (req.files) {
      const imageId = req.user.photo.id;

      //delete photo on cloudinary
      await cloudinary.v2.uploader.destroy(imageId);

      //uploading file to cloudinary
      const result = await cloudinary.v2.uploader.upload(
        req.files.photo.tempFilePath,
        {
          folder: "users",
          width: 150,
          crop: "scale",
        }
      );
      updateUser = {
        ...updateUser,
        photo: {
          id: result.public_id,
          url: result.secure_url,
        },
      };
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, updateUser, {
      new: true,
    });

    updatedUser.password = undefined;
    updatedUser.createdAt = undefined;
    updatedUser.__v = undefined;

    res
      .status(200)
      .json({ success: true, message: "User profile is updated", updatedUser });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Server has occured some problem, please try again" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const resultPerPage = 6;

    //creating object from our custom class and passing base = User.find(), bigQ = req.query
    const userObj = new Query(User.find(), req.query, req.user._id.toString());

    userObj.search();
    userObj.pager(resultPerPage);

    let Users = await userObj.base;
    let filteredUsers = Users.length;

    //update users set status = expired where currentdate - ratedAt <= 10

    await res.status(200).json({
      success: true,
      Users,
      totalUsersCount: usersCount - 1,
      filteredUsers: filteredUsers,
    });
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
