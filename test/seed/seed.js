const { ObjectId } = require("mongodb");
const User = require("../../models/User.model");

const userOneID = new ObjectId();
const userTwoID = new ObjectId();
const userThreeID = new ObjectId();
const userFourID = new ObjectId();
const userFiveID = new ObjectId();
const userSixID = new ObjectId();
const userSevenID = new ObjectId();

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

module.exports = {
  users,
  populateUsers,
};
