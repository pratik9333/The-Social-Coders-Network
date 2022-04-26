const puppeteer = require("puppeteer");

const do_conversion = (s) => {
  let ans = "";
  for (let i = 0; i < s.length; i++) {
    if (s[i] >= 0 && s[i] <= 9) {
      ans += s[i];
    }
  }
  return ans.trim();
};

exports.fetchCodeChef = async (req) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
    });

    const url = "https://www.codechef.com/users/" + req.user.codechefProfile;
    const page = await browser.newPage();

    await page.goto(url);

    //   wait for submission
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
        userRating: parseInt(total_rating),
        division: div,
        globalRank: global_rank === "Inactive" ? 0 : global_rank,
        noOfSubmission: parseInt(submissions.split("<")[0]),
        countryRank: country_rank === "Inactive" ? 0 : country_rank,
        noSolvedQuestions: fully_solved,
        partiallySolved: partially_solved,
      };
    });

    await page.close();

    data.username = req.user.codechefProfile;
    data.noSolvedQuestions = parseInt(do_conversion(data.noSolvedQuestions));
    data.partiallySolved = parseInt(do_conversion(data.partiallySolved));
    data.division = parseInt(do_conversion(data.division));
    data.user = req.user._id;
    data.name = "Codechef";

    return data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
