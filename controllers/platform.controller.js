const User = require("../models/User.model");
const Platform = require("../models/Platform.model");
const fetch = require("node-fetch");

exports.addGithubPlatform = async (req, res) => {
  try {
    const { githubId } = req.body;
    if (!githubId) {
      res.status(400).json({ error: "Please provide github id" });
    }
    fetch("https://api.github.com/users/github");
  } catch (error) {
    res
      .status(500)
      .json({ error: "Server has occured some problem, please try again" });
  }
};

/*
let solved = $('div[class="mdl-cell mdl-cell--6-col mdl-cell--12-col-phone textBold"]').text().trim().split(':')[1].trim()
let y = solved.split('P')
*/
