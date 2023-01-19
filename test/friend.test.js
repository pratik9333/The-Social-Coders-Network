let chai = require("chai");
chai.should();
const request = require("supertest");

const { describe, it } = require("mocha");

let User = require("../models/User.model");
let server = require("../index.js");
const { expect } = require("chai");

const {
  populateUsers,
  users,
  getTokenOfPopulatedUser,
} = require("./seed/seed");
const Friend = require("../models/Friends.model");

let userOneToken, userTwoToken;

describe("POST /friend/:userId", () => {
  before((done) => {
    User.deleteMany({}, (err) => {
      Friend.deleteMany({}, (err) => {
        populateUsers();
        userOneToken = getTokenOfPopulatedUser(users[0]._id);
        done();
      });
    });
  });

  it("first user should able to send friend request to second user", (done) => {
    request(server)
      .post(`/api/v1/friend/${users[1]._id}`)
      .set("Authorization", "Bearer " + userOneToken)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("success", true);

        expect(res.body).to.have.property(
          "message",
          `Friend request was sent successfully`
        );

        Friend.find({
          requester: users[0]._id.toString(),
          recipient: users[1]._id.toString(),
        }).then((res, err) => {
          if (err) return done(err);
          expect(res[0].requester.toString()).to.equal(users[0]._id.toString());
          expect(res[0].recipient.toString()).to.equal(users[1]._id.toString());
          expect(res[0]).to.have.property("status", 1);
          done();
        });
      });
  });

  it("first user should not able to send friend req again to second user", (done) => {
    request(server)
      .post(`/api/v1/friend/${users[1]._id}`)
      .set("Authorization", "Bearer " + userOneToken)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property(
          "error",
          "You already sent friend request!"
        );
        done();
      });
  });

  it("second user should not able to send friend request to first user", (done) => {
    userTwoToken = getTokenOfPopulatedUser(users[1]._id);
    request(server)
      .post(`/api/v1/friend/${users[0]._id}`)
      .set("Authorization", "Bearer " + userTwoToken)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property(
          "error",
          "User had already sent you friend request"
        );
        done();
      });
  });

  it("second user should able to accept friend request of first user", (done) => {
    userTwoToken = getTokenOfPopulatedUser(users[1]._id);
    request(server)
      .put(`/api/v1/friend/${users[0]._id}`)
      .set("Authorization", "Bearer " + userTwoToken)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property(
          "error",
          "User had already sent you friend request"
        );
        done();
      });
  });
});
