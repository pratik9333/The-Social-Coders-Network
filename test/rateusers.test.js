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
const Vote = require("../models/Votes.model");
const Friend = require("../models/Friends.model");

let userOneToken, userTwoToken;

describe("POST /rate/:action/:user", () => {
  before((done) => {
    User.deleteMany({}, (err) => {
      Friend.deleteMany({}, (err) => {
        Vote.deleteMany({}, (err) => {
          populateUsers();
          userOneToken = getTokenOfPopulatedUser(users[0]._id);
          userTwoToken = getTokenOfPopulatedUser(users[1]._id);
          done();
        });
      });
    });
  });

  it("should throw an error if userid or action not passed as params", (done) => {
    request(server)
      // passing action 1 i.e upvote and 2 i.e downvote but not user ID
      .post(`/api/v1/rate/user/1/`)
      .set("Authorization", "Bearer " + userOneToken)
      .expect(404) // 404 not found resource link
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an("object").and.to.be.empty;
        done();
      });
  });

  it("should throw an error if user is voting him/her self", (done) => {
    request(server)
      .post(`/api/v1/rate/user/1/${users[0]._id}`)
      .set("Authorization", "Bearer " + userOneToken)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.error).to.equal("Cannot vote yourself!");
        done();
      });
  });

  it("should throw an error if userid is invalid or user not found", (done) => {
    request(server)
      .post(`/api/v1/rate/user/1/63cbbc09d2db9c60e8c11356`)
      .set("Authorization", "Bearer " + userOneToken)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.error).to.equal("user not found");
        done();
      });
  });

  it("first user should able to vote second user", (done) => {
    request(server)
      .post(`/api/v1/rate/user/1/${users[1]._id}`)
      .set("Authorization", "Bearer " + userOneToken)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.success).to.equal(true);
        expect(res.body.message).to.equal(
          `${users[1].name} was rated successfully`
        );

        // checking status of a user model document if created and has voters and action info
        Vote.find({
          user: users[1]._id,
        }).then((res, err) => {
          expect(res).to.be.an("array").and.to.not.be.empty;
          expect(res[0]).to.be.an("object").and.to.not.be.empty;
          expect(res[0].user.toString()).to.equal(users[1]._id.toString());
          expect(res[0].voter.toString()).to.equal(users[0]._id.toString());
          expect(res[0].status).to.equal(1); // first user upvoted second user
          done();
        });
      });
  });

  it("should throw error if first user is voting again to second user", (done) => {
    request(server)
      .post(`/api/v1/rate/user/1/${users[1]._id}`)
      .set("Authorization", "Bearer " + userOneToken)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.error).to.equal(
          `you already had rated ${users[1].name}, you can revote after sometime`
        );
        done();
      });
  });

  it("second user should able to vote first user", (done) => {
    request(server)
      .post(`/api/v1/rate/user/2/${users[0]._id}`)
      .set("Authorization", "Bearer " + userTwoToken)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        if (err) return done(err);
        expect(res.body.success).to.equal(true);
        expect(res.body.message).to.equal(
          `${users[0].name} was rated successfully`
        );

        // checking status of a user model document if created and has voters and action info
        Vote.find({
          user: users[0]._id,
        }).then((res, err) => {
          expect(res).to.be.an("array").and.to.not.be.empty;
          expect(res[0]).to.be.an("object").and.to.not.be.empty;
          expect(res[0].user.toString()).to.equal(users[0]._id.toString());
          expect(res[0].voter.toString()).to.equal(users[1]._id.toString());
          expect(res[0].status).to.equal(2); // second user downvoted first user
          done();
        });
      });
  });
});

describe("GET /rate", () => {
  const userThreeToken = getTokenOfPopulatedUser(users[2]._id);
  it("should get empty log of rated users if no users found", (done) => {
    request(server)
      .get(`/api/v1/rate/`)
      .set("Authorization", "Bearer " + userThreeToken)
      .expect(200)
      .end(async (err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("success", true);
        expect(res.body.ratingUsers).to.be.an("array").and.to.be.empty;
        done();
      });
  });

  it("first user should get his log of users whom they voted including second user", (done) => {
    request(server)
      .get(`/api/v1/rate/`)
      .set("Authorization", "Bearer " + userOneToken)
      .expect(200)
      .end(async (err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("success", true);

        expect(res.body.ratingUsers).to.be.an("array").and.to.not.be.empty;

        expect(res.body.ratingUsers[0]).to.be.an("object").that.includes({
          user: users[0]._id.toString(),
        });

        expect(res.body.ratingUsers[0].voter).to.be.an("object").that.includes({
          _id: users[1]._id.toString(),
        });

        expect(res.body.ratingUsers[0].status).to.equal(2);

        done();
      });
  });

  it("second user should get his log of users whom they voted including first user", (done) => {
    request(server)
      .get(`/api/v1/rate/`)
      .set("Authorization", "Bearer " + userTwoToken)
      .expect(200)
      .end(async (err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("success", true);

        expect(res.body.ratingUsers).to.be.an("array").and.to.not.be.empty;

        expect(res.body.ratingUsers[0]).to.be.an("object").that.includes({
          user: users[1]._id.toString(),
        });

        expect(res.body.ratingUsers[0].voter).to.be.an("object").that.includes({
          _id: users[0]._id.toString(),
        });

        expect(res.body.ratingUsers[0].status).to.equal(1);

        done();
      });
  });
});
