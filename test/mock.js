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
  const leetcodeAPI = nock("https://leetcode.com");
  const cloudinaryAPI = nock("https://api.cloudinary.com");
  const codeforcesAPI = nock("https://codeforces.com/api");
  const githubAPI = nock("https://api.github.com");

  cloudinaryAPI.post("/v1_1/pratikaswani/image/upload").reply(200, {
    public_id: "93332001",
    url: "http://res.cloudinary.com/pratikaswani/image/upload/v1524241067/93332001.jpg",
    secure_url:
      "https://res.cloudinary.com/pratikaswani/image/upload/v1524241067/93332001.jpg",
    format: "jpg",
  });

  githubAPI.get("/users/pratik9333").reply(200, githubData);

  codeforcesAPI
    .get("/user.info")
    .query({ handles: "tourist" })
    .reply(200, codeforcesUserData);

  codeforcesAPI
    .get("/user.rating")
    .query({ handle: "tourist" })
    .reply(200, codeforcesContestsData);

  codeforcesAPI
    .get("/user.status")
    .query({ handle: "tourist" })
    .reply(200, codeforcesSubmissionsData);

  leetcodeAPI
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
