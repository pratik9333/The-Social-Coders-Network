const fetch = require("node-fetch");

const rp = require("request-promise");
const cheerio = require("cheerio");

// urls
const leetcodeURL = "https://leetcode.com/graphql";
const codeForcesURL = "https://codeforces.com/api";
const codeChefURL = "https://www.codechef.com";
const githubAPI = "https://api.github.com/users";

const do_conversion = (s) => {
  let ans = "";
  for (let i = 0; i < s.length; i++) {
    if (s[i] >= 0 && s[i] <= 9) {
      ans += s[i];
    }
  }
  return ans.trim();
};

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

const fetchCodeChef = async (codechefId) => {
  try {
    const options = {
      uri: `${codeChefURL}/users/${codechefId}`,
      transform: function (body) {
        return cheerio.load(body);
      },
    };

    const $ = await rp(options);

    // fetching user's total ranking
    let totalRating = $(
      "body > main > div > div > div > aside > div.widget.pl0.pr0.widget-rating > div > div.rating-header.text-center > div.rating-number"
    ).text();

    // fetching user's division
    let div = $(
      "body > main > div > div > div > aside > div.widget.pl0.pr0.widget-rating > div > div.rating-header.text-center > div:nth-child(2)"
    ).text();

    // fetching user's global rank
    let globalRank = $(
      "body > main > div > div > div > aside > div.widget.pl0.pr0.widget-rating > div > div.rating-ranks > ul > li:nth-child(1) > a > strong"
    ).text();

    // fetching user's country rank
    let countryRank = $(
      "body > main > div > div > div > aside > div.widget.pl0.pr0.widget-rating > div > div.rating-ranks > ul > li:nth-child(2) > a > strong"
    ).text();

    // fetching user's fully solved questions
    let fullySolved = $(
      "body > main > div > div > div > div > div > section.rating-data-section.problems-solved > div > h5:nth-child(1)"
    ).text();

    // fetching user's partially solved questions
    let partiallySolved = $(
      "body > main > div > div > div > div > div > section.rating-data-section.problems-solved > div > h5:nth-child(3)"
    ).text();

    div = parseInt(do_conversion(div), 10);
    totalRating = parseInt(totalRating, 10);
    globalRank = globalRank === "Inactive" ? 0 : parseInt(globalRank, 10);
    countryRank = countryRank === "Inactive" ? 0 : parseInt(countryRank, 10);
    solvedQuestions = parseInt(do_conversion(fullySolved), 10);
    partiallySolved = parseInt(do_conversion(partiallySolved), 10);

    return {
      username: codechefId,
      division: div,
      rating: totalRating,
      globalRank,
      countryRank,
      solvedQuestions,
      partiallySolved,
    };
  } catch (error) {
    return { username: codechefId };
  }
};

const fetchCodeForces = async (codeforcesId) => {
  try {
    let result = {
      username: codeforcesId,
      rating: "",
      contest: {
        attended: 0,
        rating: 0,
      },
      submissions: 0,
      languagesUsed: [],
      solvedQuestions: 0,
    };

    let userProfile = await fetch(
      `${codeForcesURL}/user.info?handles=${codeforcesId}`
    );

    let attendedContest = await fetch(
      `${codeForcesURL}/user.rating?handle=${codeforcesId}`
    );

    let noOfSubmission = await fetch(
      `${codeForcesURL}/user.status?handle=${codeforcesId}`
    );

    attendedContest = await attendedContest.json();
    userProfile = await userProfile.json();
    noOfSubmission = await noOfSubmission.json();

    result.rating = userProfile.result[0].rating || 0;

    result.contest.rating = result.rating;

    result.contest.attended = attendedContest.result.length;
    result.submissions = noOfSubmission.result.length;

    for (let submission of noOfSubmission.result) {
      if (submission.verdict === "OK") {
        result.solvedQuestions += 1;
      }
      result.languagesUsed.push(submission.programmingLanguage);
    }

    result.languagesUsed = [...new Set(result.languagesUsed)];

    return result;
  } catch (error) {
    return { username: codeforcesId };
  }
};

const fetchGithub = async (githubId) => {
  try {
    const response = await fetch(`${githubAPI}/${githubId}`);

    const data = await response.json();

    const { public_repos, followers, following } = data;

    const returnData = {
      username: githubId,
      publicRepos: public_repos,
      followers: followers,
      following: following,
    };

    return returnData;
  } catch (err) {
    return { username: githubId };
  }
};

const fetchLeetcode = async (leetcodeId) => {
  try {
    const data = JSON.stringify({
      query: query,
      variables: {
        username: leetcodeId,
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
      username: leetcodeId,
      rating: responseData.data.matchedUser.profile.ranking,
      contest: {
        attended:
          responseData.data.userContestRanking?.attendedContestsCount || 0,
        rating: Math.floor(responseData.data.userContestRanking?.rating || 0),
      },
      solvedQuestions:
        responseData.data.matchedUser.submitStats.acSubmissionNum[0].count,
      submissions:
        responseData.data.matchedUser.submitStats.acSubmissionNum[0]
          .submissions,
      languagesUsed: responseData.data.matchedUser.languageProblemCount.map(
        (language) => language.languageName
      ),
    };
  } catch (error) {
    return { username: leetcodeId };
  }
};

module.exports = {
  fetchLeetcode,
  fetchCodeForces,
  fetchGithub,
  query,
  fetchCodeChef,
};
