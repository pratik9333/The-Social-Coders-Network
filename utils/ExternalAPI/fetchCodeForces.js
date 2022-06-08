const { json } = require("express");
const fetch = require("node-fetch");
const codechefURL = "https://codeforces.com/api";

exports.getCodeForcesProfileDetails = async (req) => {
  let result = {
    name: "Codeforces",
    username: req.user.codeforcesProfile,
    rating: "",
    contest: {
      attended: 0,
      rating: 0,
    },
    noOfSubmission: 0,
    languageUsed: [],
    noSolvedQuestions: 0,
    user: req.user._id,
  };

  let userProfile = await fetch(
    `${codechefURL}/user.info?handles=${req.user.codeforcesProfile}`
  );

  let attendedContest = await fetch(
    `${codechefURL}/user.rating?handle=${req.user.codeforcesProfile}`
  );

  let noOfSubmission = await fetch(
    `${codechefURL}/user.status?handle=${req.user.codeforcesProfile}`
  );

  attendedContest = await attendedContest.json();
  userProfile = await userProfile.json();
  noOfSubmission = await noOfSubmission.json();

  result.rating = userProfile.result[0].rating || 0;

  result.contest.rating = result.rating;

  result.contest.attended = attendedContest.result.length;
  result.noOfSubmission = noOfSubmission.result.length;

  for (let submission of noOfSubmission.result) {
    if (submission.verdict === "OK") {
      result.noSolvedQuestions += 1;
    }
    result.languageUsed.push(submission.programmingLanguage);
  }

  result.languageUsed = [...new Set(result.languageUsed)];

  return result;
};
