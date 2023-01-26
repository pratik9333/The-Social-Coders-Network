const codeChefURL = "https://www.codechef.com";
const rp = require("request-promise");
const cheerio = require("cheerio");

const do_conversion = (s) => {
  let ans = "";
  for (let i = 0; i < s.length; i++) {
    if (s[i] >= 0 && s[i] <= 9) {
      ans += s[i];
    }
  }
  return ans.trim();
};

const fetchCodeChef = async () => {
  const options = {
    uri: `${codeChefURL}/users/gennady.korotkevich`,
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

  console.log(totalRating);
  console.log(div);
  console.log(globalRank);
  console.log(countryRank);
  console.log(solvedQuestions);
  console.log(partiallySolved);
};

fetchCodeChef();
