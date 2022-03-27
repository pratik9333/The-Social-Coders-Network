const Platform = require("../models/Platform.model");
const fetch = require("node-fetch");
const leetcodeURL = "https://leetcode.com/graphql";

const getLeetCodeUserDetails = async (username) => {
  const query = `query getLeetCodeUserDetails($username: String!) {

        matchedUser(username: $username) {
            username
            languageProblemCount {
                languageName
                problemsSolved
             }
            contributions {
                points
              }
              activeBadge {
                    icon
                  }
            profile { 
                  reputation 
                  ranking 
                }
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
            }
          }
    
           userContestRanking(username: $username) {
                  attendedContestsCount
                  rating   
                  globalRanking
                  totalParticipants
                  topPercentage
                     badge {
                         name
                            }  
                        }
                   userContestRankingHistory(username: $username) {
                    attended
                        trendDirection
                        problemsSolved
                        totalProblems
                        finishTimeInSeconds
                        rating
                        ranking
                        contest {
                            title
                            startTime
                        }  
                    }
                }`;

  const data = JSON.stringify({
    query: query,
    variables: {
      username: username,
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

  return responseData;
};

exports.addLeetcodeProfile = (req, res) => {
  const { leetcodeId } = req.body;
  const leetcodeProfileDetails = {
    name: "Leetcode",
    rating: "",
    contest: {
      attended: 0,
      rating: 0,
      totalParticipants: 0,
      topPercentage: 0,
    },
    noOfSubmission: 0,
    languageUsed: [],
    noSolvedQuestions: 0,
    user: req.user._id,
  };

  Platform.find({ user: req.user._id })
    .then((data) => {
      if (data.length > 0) {
        Platform.deleteOne({ user: req.user._id })
          .then((data) => {})
          .catch((err) => {
            return res
              .status(500)
              .json({ success: false, error: "Server Occured some problem" });
          });
      }
    })
    .catch((err) => {
      console.log(err);
    });

  if (!leetcodeId) {
    return res.status(401).json({ error: "Please provide leetcode userid" });
  }
  getLeetCodeUserDetails(leetcodeId)
    .then((d) => {
      leetcodeProfileDetails.rating = d.data.matchedUser.profile.ranking;

      for (let language of d.data.matchedUser.languageProblemCount) {
        leetcodeProfileDetails.languageUsed.push(language.languageName);
      }

      leetcodeProfileDetails.noOfSubmission =
        d.data.matchedUser.submitStats.acSubmissionNum[0].submissions;

      leetcodeProfileDetails.noSolvedQuestions =
        d.data.matchedUser.submitStats.acSubmissionNum[0].count;

      if (d.data.userContestRanking) {
        leetcodeProfileDetails.contest.attended =
          d.data.userContestRanking.attendedContestsCount;

        leetcodeProfileDetails.contest.rating =
          d.data.userContestRanking.rating;

        leetcodeProfileDetails.contest.totalParticipants =
          d.data.userContestRanking.totalParticipants;

        leetcodeProfileDetails.contest.topPercentage =
          d.data.userContestRanking.topPercentage;
      }

      Platform.create(leetcodeProfileDetails)
        .then((data) => {
          console.log(data);
          return res
            .status(200)
            .json({ success: true, message: "Platform added" });
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(500)
            .json({ success: false, error: "Server Occured some problem" });
        });
    })
    .catch((error) => {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, error: "Server Occured some problem" });
    });
};
