const puppeteer = require("puppeteer");
const fetch = require("node-fetch");

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

exports.fetchCodeChef = async (user) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });

    const url = `${codeChefURL}/users/${user.social.codechefProfile.username}`;
    console.log(url);

    const page = await browser.newPage();

    await page.goto(url);

    // wait for submission
    await page.waitForSelector("body > main");

    let data = await page.evaluate(() => {
      const total_rating = document.querySelector(
        "body > main > div > div > div > aside > div.widget.pl0.pr0.widget-rating > div > div.rating-header.text-center > div.rating-number"
      ).innerHTML;
      let div = document.querySelector(
        "body > main > div > div > div > aside > div.widget.pl0.pr0.widget-rating > div > div.rating-header.text-center > div:nth-child(2)"
      ).innerHTML;
      const global_rank = document.querySelector(
        "body > main > div > div > div > aside > div.widget.pl0.pr0.widget-rating > div > div.rating-ranks > ul > li:nth-child(1) > a > strong"
      ).innerHTML;
      const country_rank = document.querySelector(
        "body > main > div > div > div > aside > div.widget.pl0.pr0.widget-rating > div > div.rating-ranks > ul > li:nth-child(2) > a > strong"
      ).innerHTML;
      const submissions = document.querySelector(
        "body > main > div > div > div > div > div > section.rating-data-section.submissions > div > div > div > svg > g > g.highcharts-data-label-color-5 > text > tspan"
      ).innerHTML;
      const fully_solved = document.querySelector(
        "body > main > div > div > div > div > div > section.rating-data-section.problems-solved > div > h5:nth-child(1)"
      ).innerText;
      const partially_solved = document.querySelector(
        "body > main > div > div > div > div > div > section.rating-data-section.problems-solved > div > h5:nth-child(3)"
      ).innerHTML;
      return {
        username: user.social.codechefProfile.username,
        rating: parseInt(total_rating),
        division: div,
        globalRank: global_rank === "Inactive" ? 0 : global_rank,
        submissions: parseInt(submissions.split("<")[0]),
        countryRank: country_rank === "Inactive" ? 0 : country_rank,
        solvedQuestions: fully_solved,
        partiallySolved: partially_solved,
      };
    });

    await page.close();

    data.solvedQuestions = parseInt(do_conversion(data.solvedQuestions));
    data.partiallySolved = parseInt(do_conversion(data.partiallySolved));
    data.division = parseInt(do_conversion(data.division));

    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

exports.fetchCodeForces = async (user) => {
  try {
    let result = {
      username: user.social.codeforcesProfile.username,
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
      `${codeForcesURL}/user.info?handles=${user.social.codeforcesProfile.username}`
    );

    let attendedContest = await fetch(
      `${codeForcesURL}/user.rating?handle=${user.social.codeforcesProfile.username}`
    );

    let noOfSubmission = await fetch(
      `${codeForcesURL}/user.status?handle=${user.social.codeforcesProfile.username}`
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
    return null;
  }
};

exports.fetchGithub = async (user) => {
  try {
    const response = await fetch(
      `${githubAPI}/${user.social.githubProfile.username}`
    );

    const data = await response.json();

    const { public_repos, followers, following } = data;

    return {
      username: user.social.githubProfile.username,
      publicRepos: public_repos,
      followers: followers,
      following: following,
    };
  } catch (err) {
    return null;
  }
};

exports.fetchLeetcode = async (user) => {
  try {
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
        username: user.social.leetcodeProfile.username,
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
      username: user.social.leetcodeProfile.username,
      rating: responseData.data.matchedUser.profile.ranking,
      contest: {
        attended: responseData.data.userContests?.attendedContestsCount || 0,
        rating: Math.floor(responseData.data.userContests?.rating || 0),
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
    return null;
  }
};
