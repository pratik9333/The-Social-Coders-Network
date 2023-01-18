const User = require("../models/User.model");
const cloudinary = require("cloudinary");
const Query = require("../utils/query");

const {
  fetchGithub,
  fetchLeetcode,
  fetchCodeForces,
} = require("../utils/ExternalAPI/fetchCodeData");

// 1 min = 60,000 milliseconds
const oneMinToMilli = 60_000;
const updateCycleOfDashboard = 30 * oneMinToMilli;

exports.getUserDashboard = async (req, res) => {
  try {
    let loggedUser = await User.findById(req.user._id).select(
      "+nextUpdateCycle +friends"
    );

    const currTime = new Date().getTime();
    const nextUpdateCycle = loggedUser.nextUpdateCycle;

    if (currTime >= nextUpdateCycle) {
      //

      // adding user profile details coding profile details
      if (loggedUser.social.codeforcesProfile.username) {
        const codeforcesData = await fetchCodeForces(
          loggedUser.social.codeforcesProfile.username
        );
        loggedUser.social.codeforcesProfile = codeforcesData;
      }

      if (loggedUser.social.githubProfile.username) {
        const githubData = await fetchGithub(
          loggedUser.social.githubProfile.username
        );
        loggedUser.social.githubProfile = githubData;
      }

      if (loggedUser.social.leetcodeProfile.username) {
        const leetcodeData = await fetchLeetcode(
          loggedUser.social.leetcodeProfile.username
        );
        loggedUser.social.leetcodeProfile = leetcodeData;
      }

      //updating next update cycle
      loggedUser.nextUpdateCycle =
        new Date().getTime() + updateCycleOfDashboard;

      loggedUser = await loggedUser.save();

      //
    }

    return res.status(200).json({
      success: true,
      loggedUser,
    });
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
      social: {
        githubProfile: {
          username: null,
        },
        leetcodeProfile: {
          username: null,
        },
        codeforcesProfile: {
          username: null,
        },
        codechefProfile: {
          username: null,
        },
      },
    };

    if (req.files) {
      if (req.user.photo.id) {
        const imageId = req.user.photo.id;

        //delete photo on cloudinary
        await cloudinary.v2.uploader.destroy(imageId);
      }

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

    if (req.body.githubId) {
      const githubData = await fetchGithub(req.body.githubId);
      updateUser.social.githubProfile = githubData;
    }
    if (req.body.leetcodeId) {
      const leetcodeData = await fetchLeetcode(req.body.leetcodeId);
      updateUser.social.leetcodeProfile = leetcodeData;
    }
    if (req.body.codeforcesId) {
      const codeforcesData = await fetchCodeForces(req.body.codeforcesId);
      updateUser.social.codeforcesProfile = codeforcesData;
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
    const userObj = new Query(User.find(), req.query);

    userObj.search();
    userObj.pager(resultPerPage);

    let Users = await userObj.base;
    let filteredUsers = Users.length;

    await res.status(200).json({
      success: true,
      Users,
      totalUsersCount: usersCount,
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
    const resultPerPage = 6;

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
