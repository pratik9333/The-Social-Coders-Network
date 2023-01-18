const {
  codeforcesContestsData,
  codeforcesUserData,
  codeforcesSubmissionsData,
  leetcodeData,
  githubData,
} = require("./seed/seed");

const { query } = require("../utils/ExternalAPI/fetchCodeData");

const nock = require("nock");

const mockServer = () => {
  const mockLeetcode = nock("https://leetcode.com");
  const mockCloudinary = nock("https://api.cloudinary.com");
  const mockCodeforces = nock("https://codeforces.com/api");
  const mockGithubUrl = nock("https://api.github.com");

  // mocking cloudinary api that returns public id and url of user
  mockCloudinary.post("/v1_1/pratikaswani/image/upload").reply(200, {
    public_id: "93332001",
    url: "http://res.cloudinary.com/pratikaswani/image/upload/v1524241067/93332001.jpg",
    secure_url:
      "https://res.cloudinary.com/pratikaswani/image/upload/v1524241067/93332001.jpg",
    format: "jpg",
  });

  // mocking github api that returns github profile data of user
  mockGithubUrl.get("/users/pratik9333").reply(200, githubData);

  //mocking codeforces api that returns codeforces profile data of user
  mockCodeforces
    .get("/user.info")
    .query({ handles: "tourist" })
    .reply(200, codeforcesUserData);

  mockCodeforces
    .get("/user.rating")
    .query({ handle: "tourist" })
    .reply(200, codeforcesContestsData);

  mockCodeforces
    .get("/user.status")
    .query({ handle: "tourist" })
    .reply(200, codeforcesSubmissionsData);

  // mocking leetcode graphql api that returns leetcode profile data of user
  mockLeetcode
    .post(
      "/graphql",
      {
        query: query,
        variables: {
          username: "rajpatel1508",
          limit: 5,
        },
      },
      {
        reqheaders: {
          "Content-Type": "application/json",
        },
      }
    )

    .reply(200, {
      data: leetcodeData,
    });
};

const cleanMock = () => {
  nock.cleanAll();
};

module.exports = { cleanMock, mockServer };
