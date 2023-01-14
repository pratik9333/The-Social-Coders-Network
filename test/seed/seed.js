const { ObjectId } = require("mongodb");
const User = require("../../models/User.model");

const userOneID = new ObjectId();
const userTwoID = new ObjectId();

const users = [
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
];

const populateUsers = (done) => {
  User.remove({})
    .then(() => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();

      return Promise.all([userOne, userTwo]);
    })
    .then(() => done());
};

module.exports = {
  users,
  populateUsers,
};
