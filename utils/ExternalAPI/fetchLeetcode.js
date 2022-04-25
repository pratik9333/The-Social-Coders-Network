const fetch = require("node-fetch");
const leetcodeURL = "https://leetcode.com/graphql";

exports.getLeetCodeUserDetails = async (req) => {
  const query = `query userProfile($username: String!, $limit: Int!) {
    matchedUser(username: $username) {
        username
         profile {
          ranking
        }
        languageProblemCount {
           languageName
          problemsSolved
        }
        submitStats: submitStatsGlobal {
          acSubmissionNum {
              difficulty
              count
              submissions
          }
        }
    }
    recentAcSubmissionList(username: $username, limit: $limit) {
      title
    }
    userContestRanking(username: $username) {
      attendedContestsCount
      globalRanking
      rating
    }
}`;

  const data = JSON.stringify({
    query: query,
    variables: {
      username: req.user.leetcodeProfile,
      limit: 5,
    },
  });

  const response = await fetch(leetcodeURL, {
    method: "POST",
    body: data,
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseData = await response.json();

  return {
    name: "Leetcode",
    user: req.user._id,
    username: req.user.leetcodeProfile,
    userRating: responseData.data.matchedUser.profile.ranking,
    contest: {
      attended: responseData.data.userContests?.attendedContestsCount || 0,
      rating: Math.floor(responseData.data.userContests?.rating || 0),
    },
    noSolvedQuestions:
      responseData.data.matchedUser.submitStats.acSubmissionNum[0].count,
    noOfSubmission:
      responseData.data.matchedUser.submitStats.acSubmissionNum[0].submissions,
    languageUsed: responseData.data.matchedUser.languageProblemCount.map(
      (language) => language.languageName
    ),
  };
};
