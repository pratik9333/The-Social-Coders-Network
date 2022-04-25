const fetch = require("node-fetch");

const githubApi = "https://api.github.com/users";

exports.addGithubProfileDetails = async (req) => {
  try {
    const response = await fetch(`${githubApi}/${req.user.githubProfile}`);
    const data = await response.json();

    const { public_repos, followers, following } = data;

    return {
      username: req.user.githubProfile,
      name: "Github",
      publicRepos: public_repos,
      followers: followers,
      following: following,
      user: req.user._id,
    };
  } catch (err) {
    console.log(err);
    return null;
  }
};
