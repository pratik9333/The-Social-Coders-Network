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

{
  /* <g
  class="highcharts-data-labels highcharts-series-0 highcharts-pie-series highcharts-tracker"
  data-z-index="6"
  opacity="1"
  transform="translate(10,10) scale(1 1)"
  style="cursor: pointer;"
>
  <path
    fill="none"
    class="highcharts-data-label-connector highcharts-color-0"
    stroke="#d6ba22"
    stroke-width="1"
    d="M 309.9786532760134 12 C 304.9786532760134 12 301.9812148828916 31.843070901806627 300.9820687518511 37.759294951724506 L 299.9829226208106 43.675519001642385"
    opacity="1"
  ></path>
  <path
    fill="none"
    class="highcharts-data-label-connector highcharts-color-1"
    stroke="#6F6D6D"
    stroke-width="1"
    d="M 364.81854421122955 35 C 359.81854421122955 35 329.7765191028583 39.74494633757351 327.5139500527284 45.301994231320165 L 325.25138100259846 50.85904212506682"
    opacity="1"
  ></path>
  <path
    fill="none"
    class="highcharts-data-label-connector highcharts-color-2"
    stroke="#8B572A"
    stroke-width="1"
    d="M 393.09255293497324 58 C 388.09255293497324 58 347.76287939826216 48.72073369033244 344.68274851652296 53.86979124986278 L 341.60261763478377 59.01884880939312"
    opacity="1"
  ></path>
  <path
    fill="none"
    class="highcharts-data-label-connector highcharts-color-3"
    stroke="#F7750F"
    stroke-width="1"
    d="M 411.24975247500487 81 C 406.24975247500487 81 384.28542038971534 81.07688158418304 379.54517400836465 84.75520514853835 L 374.80492762701397 88.43352871289366"
    opacity="1"
  ></path>
  <path
    fill="none"
    class="highcharts-data-label-connector highcharts-color-4"
    stroke="#E56255"
    stroke-width="1"
    d="M 390.96738669608067 268.16455602885225 C 385.96738669608067 268.16455602885225 373.251300292551 255.42480930539 369.01260482470775 251.1782270642359 L 364.7739093568645 246.9316448230818"
    opacity="1"
  ></path>
  <path
    fill="none"
    class="highcharts-data-label-connector highcharts-color-5"
    stroke="#1C8C0E"
    stroke-width="1"
    d="M 127.848307925602 132.90739750999316 C 132.848307925602 132.90739750999316 150.50651097452976 136.398509808794 156.39257865750568 137.56221390839426 L 162.2786463404816 138.72591800799452"
    opacity="1"
  ></path>
  <g
    class="highcharts-label highcharts-data-label highcharts-data-label-color-0"
    data-z-index="1"
    transform="translate(315,2)"
    style="cursor: pointer;"
    opacity="1"
  >
    <text
      x="5"
      data-z-index="1"
      y="16"
      style="color: rgb(0, 0, 0); font-size: 11px; font-weight: bold; fill: rgb(0, 0, 0);"
    >
      <tspan
        class="highcharts-text-outline"
        fill="#FFFFFF"
        stroke="#FFFFFF"
        stroke-width="2px"
        stroke-linejoin="round"
        style=""
      >
        45
        <tspan x="5" y="16">
          ​
        </tspan>
      </tspan>
      45
    </text>
  </g>
  <g
    class="highcharts-label highcharts-data-label highcharts-data-label-color-1"
    data-z-index="1"
    transform="translate(370,25)"
    style="cursor: pointer;"
    opacity="1"
  >
    <text
      x="5"
      data-z-index="1"
      y="16"
      style="color: rgb(0, 0, 0); font-size: 11px; font-weight: bold; fill: rgb(0, 0, 0);"
    >
      <tspan
        class="highcharts-text-outline"
        fill="#FFFFFF"
        stroke="#FFFFFF"
        stroke-width="2px"
        stroke-linejoin="round"
      >
        14
        <tspan x="5" y="16">
          ​
        </tspan>
      </tspan>
      14
    </text>
  </g>
  <g
    class="highcharts-label highcharts-data-label highcharts-data-label-color-2"
    data-z-index="1"
    transform="translate(398,48)"
    style="cursor: pointer;"
    opacity="1"
  >
    <text
      x="5"
      data-z-index="1"
      y="16"
      style="color: rgb(0, 0, 0); font-size: 11px; font-weight: bold; fill: rgb(0, 0, 0);"
    >
      <tspan
        class="highcharts-text-outline"
        fill="#FFFFFF"
        stroke="#FFFFFF"
        stroke-width="2px"
        stroke-linejoin="round"
      >
        27
        <tspan x="5" y="16">
          ​
        </tspan>
      </tspan>
      27
    </text>
  </g>
  <g
    class="highcharts-label highcharts-data-label highcharts-data-label-color-3"
    data-z-index="1"
    transform="translate(416,71)"
    style="cursor: pointer;"
    opacity="1"
  >
    <text
      x="5"
      data-z-index="1"
      y="16"
      style="color: rgb(0, 0, 0); font-size: 11px; font-weight: bold; fill: rgb(0, 0, 0);"
    >
      <tspan
        class="highcharts-text-outline"
        fill="#FFFFFF"
        stroke="#FFFFFF"
        stroke-width="2px"
        stroke-linejoin="round"
      >
        73
        <tspan x="5" y="16">
          ​
        </tspan>
      </tspan>
      73
    </text>
  </g>
  <g
    class="highcharts-label highcharts-data-label highcharts-data-label-color-4"
    data-z-index="1"
    transform="translate(396,258)"
    style="cursor: pointer;"
    opacity="1"
  >
    <text
      x="5"
      data-z-index="1"
      y="16"
      style="color: rgb(0, 0, 0); font-size: 11px; font-weight: bold; fill: rgb(0, 0, 0);"
    >
      <tspan
        class="highcharts-text-outline"
        fill="#FFFFFF"
        stroke="#FFFFFF"
        stroke-width="2px"
        stroke-linejoin="round"
        style=""
      >
        316
        <tspan x="5" y="16">
          ​
        </tspan>
      </tspan>
      316
    </text>
  </g>
  <g
    class="highcharts-label highcharts-data-label highcharts-data-label-color-5"
    data-z-index="1"
    transform="translate(91,123)"
    style="cursor: pointer;"
    opacity="1"
  >
    <text
      x="5"
      data-z-index="1"
      y="16"
      style="color: rgb(0, 0, 0); font-size: 11px; font-weight: bold; fill: rgb(0, 0, 0);"
    >
      <tspan
        class="highcharts-text-outline"
        fill="#FFFFFF"
        stroke="#FFFFFF"
        stroke-width="2px"
        stroke-linejoin="round"
      >
        370
        <tspan x="5" y="16">
          ​
        </tspan>
      </tspan>
      370
    </text>
  </g>
</g>; */
}
