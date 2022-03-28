const Platform = require("../models/Platform.model");
const fetch = require("node-fetch");
const leetcodeURL = "https://leetcode.com/graphql";
const codechefURL = "https://codeforces.com/api";

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
  if (!leetcodeId) {
    return res.status(401).json({ error: "Please provide leetcode userid" });
  }
  const leetcodeProfileDetails = {
    name: "Leetcode",
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

  Platform.find({ user: req.user._id, name: "Leetcode" })
    .then((data) => {
      user = data;
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
      console.log(err);
    });

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
      }

      Platform.create(leetcodeProfileDetails)
        .then((data) => {
          console.log(data);
          return res.status(200).json({
            success: true,
            platform: data,
            message: "Leetcode platform added",
          });
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

exports.addCodeForcesProfile = async (req, res) => {
  try {
    const { codeforcesId } = req.body;
    if (!codeforcesId) {
      return res
        .status(400)
        .json({ error: "Please provide codeforces user id" });
    }

    const fetchedProfile = await Platform.find({
      user: req.user._id,
      name: "Codeforces",
    });

    if (fetchedProfile.length > 0) {
      await fetchedProfile[0].remove();
    }

    let codeforcesProfile = {
      name: "Codeforces",
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
      `${codechefURL}/user.info?handles=${codeforcesId}`
    );

    let attendedContest = await fetch(
      `${codechefURL}/user.rating?handle=${codeforcesId}`
    );

    let noOfSubmission = await fetch(
      `${codechefURL}/user.status?handle=${codeforcesId}`
    );

    attendedContest = await attendedContest.json();
    userProfile = await userProfile.json();
    noOfSubmission = await noOfSubmission.json();

    codeforcesProfile.rating = userProfile.result[0].rating || 0;

    codeforcesProfile.contest.rating = codeforcesProfile.rating;

    codeforcesProfile.contest.attended = attendedContest.result.length;
    codeforcesProfile.noOfSubmission = noOfSubmission.result.length;

    for (let submission of noOfSubmission.result) {
      if (submission.verdict === "OK") {
        codeforcesProfile.noSolvedQuestions += 1;
      }
      codeforcesProfile.languageUsed.push(submission.programmingLanguage);
    }

    codeforcesProfile.languageUsed = [
      ...new Set(codeforcesProfile.languageUsed),
    ];

    let platform = await Platform.create(codeforcesProfile);
    return res
      .status(200)
      .json({ success: true, message: "Codechef platform added", platform });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: "Server Occured some problem" });
  }
};
