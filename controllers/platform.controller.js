const Platform = require("../models/Platform.model");

const { fetchCodeChef } = require("../utils/ExternalAPI/fetchCodeChef");
const {
  getCodeForcesProfileDetails,
} = require("../utils/ExternalAPI/fetchCodeForces");
const { addGithubProfileDetails } = require("../utils/ExternalAPI/fetchGithub");
const {
  getLeetCodeUserDetails,
} = require("../utils/ExternalAPI/fetchLeetcode");

exports.addLeetcodeProfile = async (req, res) => {
  try {
    const findExistingPlatform = await Platform.find({
      user: req.user._id,
      name: "Leetcode",
    });

    if (findExistingPlatform.length > 0)
      await Platform.deleteOne({ user: req.user._id, name: "Leetcode" });

    const leetcodeProfile = await getLeetCodeUserDetails(req);

    return await Platform.create(leetcodeProfile);
  } catch (error) {
    return res.status(500).json({
      error:
        "Error while fetching leetcode data, please check username and try again",
    });
  }
};

exports.addCodeForcesProfile = async (req, res) => {
  try {
    const fetchedProfile = await Platform.find({
      user: req.user._id,
      name: "Codeforces",
    });

    if (fetchedProfile.length > 0) {
      await fetchedProfile[0].remove();
    }

    const codeforcesProfile = await getCodeForcesProfileDetails(req);

    return await Platform.create(codeforcesProfile);
  } catch (error) {
    return res.status(500).json({
      error:
        "Error while fetching Codeforces data, please check username and try again",
    });
  }
};

exports.addGithubProfile = async (req, res) => {
  try {
    const fetchedProfile = await Platform.find({
      user: req.user._id,
      name: "Github",
    });

    if (fetchedProfile.length > 0) {
      await fetchedProfile[0].remove();
    }

    const GithubProfile = await addGithubProfileDetails(req);

    return await Platform.create(GithubProfile);
  } catch (error) {
    return res.status(500).json({
      error:
        "Error while fetching github data, please check username and try again",
    });
  }
};

exports.addCodeChefProfile = async (req, res) => {
  try {
    const fetchedProfile = await Platform.find({
      user: req.user._id,
      name: "Codechef",
    });

    if (fetchedProfile.length > 0) {
      await fetchedProfile[0].remove();
    }

    const codechefProfile = await fetchCodeChef(req);

    return await Platform.create(codechefProfile);
  } catch (error) {
    return res.status(500).json({
      error:
        "Error while fetching codechef data, please check username and try again",
    });
  }
};
