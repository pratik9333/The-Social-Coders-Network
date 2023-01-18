const { ObjectId } = require("mongodb");
const User = require("../../models/User.model");
const jsonwebtoken = require("jsonwebtoken");

const userOneID = new ObjectId();
const userTwoID = new ObjectId();
const userThreeID = new ObjectId();
const userFourID = new ObjectId();
const userFiveID = new ObjectId();
const userSixID = new ObjectId();
const userSevenID = new ObjectId();

// **** leetcode seed data ****
const leetcodeData = {
  matchedUser: {
    username: "rajpatel1508",
    profile: { ranking: 3898388 },
    languageProblemCount: [
      { languageName: "C++", problemsSolved: 1 },
      { languageName: "Python3", problemsSolved: 1 },
    ],
    submitStats: {
      acSubmissionNum: [
        { difficulty: "All", count: 1, submissions: 2 },
        { difficulty: "Easy", count: 1, submissions: 1 },
        { difficulty: "Medium", count: 0, submissions: 0 },
        { difficulty: "Hard", count: 0, submissions: 0 },
      ],
    },
  },
  recentAcSubmissionList: [{ title: "Two Sum" }],
  userContestRanking: {
    attendedContestsCount: 39,
    globalRanking: 14837,
    rating: 1901.0414965592431,
  },
};

const leetcodeResponseData = {
  contest: { attended: 39, rating: 1901 },
  username: "rajpatel1508",
  rating: 3898388,
  solvedQuestions: 1,
  submissions: 2,
  languagesUsed: ["C++", "Python3"],
};

// **** github seed data ****
const githubData = {
  username: "pratik9333",
  public_repos: "68",
  followers: "10",
  following: "5",
};

// **** codeforces seed data ****
const codeforcesUserData = {
  status: "ok",
  result: [{ rating: 3768 }],
};

const codeforcesContestsData = {
  status: "ok",
  result: [
    {
      contestId: 2,
      contestName: "Codeforces Beta Round #2",
      handle: "tourist",
      rank: 14,
      ratingUpdateTimeSeconds: 1267124400,
      oldRating: 0,
      newRating: 1602,
    },
  ],
};

const codeforcesSubmissionsData = {
  status: "ok",
  result: [
    {
      id: 179569288,
      contestId: 1750,
      creationTimeSeconds: 1667746093,
      relativeTimeSeconds: 793,
      problem: [Object],
      author: [Object],
      programmingLanguage: "GNU C++20 (64)",
      verdict: "NOT OK",
      testset: "TESTS",
      passedTestCount: 36,
      timeConsumedMillis: 46,
      memoryConsumedBytes: 819200,
    },
    {
      id: 179563887,
      contestId: 1750,
      creationTimeSeconds: 1667745738,
      relativeTimeSeconds: 438,
      problem: [Object],
      author: [Object],
      programmingLanguage: "GNU C++20 (64)",
      verdict: "OK",
      testset: "TESTS",
      passedTestCount: 8,
      timeConsumedMillis: 62,
      memoryConsumedBytes: 2867200,
    },
  ],
};

const codeforcesResponseData = {
  contest: { attended: 1, rating: 3768 },
  username: "tourist",
  rating: 3768,
  submissions: 2,
  languagesUsed: ["GNU C++20 (64)"],
  solvedQuestions: 1,
};

let users = [
  {
    _id: userOneID,
    email: "userone@gmail.com",
    name: "user one",
    password: "useronepassword",
  },
  {
    _id: userTwoID,
    email: "usertwo@gmail.com",
    name: "user two",
    password: "usertwopassword",
  },
  {
    _id: userThreeID,
    email: "userthree@gmail.com",
    name: "user three",
    password: "userthreepassword",
  },
  {
    _id: userFourID,
    email: "userfour@gmail.com",
    name: "user four",
    password: "userfourpassword",
  },
  {
    _id: userFiveID,
    email: "userfive@gmail.com",
    name: "user five",
    password: "userfivepassword",
  },
  {
    _id: userSixID,
    email: "usersix@gmail.com",
    name: "user six",
    password: "usersixpassword",
  },
  {
    _id: userSevenID,
    email: "userseven@gmail.com",
    name: "user seven",
    password: "usersevenpassword",
  },
];

const populateUsers = () => {
  const userOne = new User(users[0]).save();
  const userTwo = new User(users[1]).save();
  const userThree = new User(users[2]).save();
  const userFour = new User(users[3]).save();
  const userFive = new User(users[4]).save();
  const userSix = new User(users[5]).save();
  const userSeven = new User(users[6]).save();

  return Promise.all([
    userOne,
    userTwo,
    userThree,
    userFour,
    userFive,
    userSix,
    userSeven,
  ]);
};

const getTokenOfPopulatedUser = () => {
  const token = jsonwebtoken.sign(
    { id: users[0]._id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );

  return token;
};

module.exports = {
  users,
  getTokenOfPopulatedUser,
  populateUsers,
  leetcodeData,
  githubData,
  codeforcesContestsData,
  codeforcesSubmissionsData,
  codeforcesUserData,
  leetcodeResponseData,
  codeforcesResponseData,
};
