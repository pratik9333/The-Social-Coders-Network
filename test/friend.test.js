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
        userTwoToken = getTokenOfPopulatedUser(users[1]._id);
        done();
      });
    });
  });

  it("should throw an error if user id is invalid", (done) => {
    request(server)
      .post(`/api/v1/friend/${users[1]._id}`)
      .set("Authorization", "Bearer " + userTwoToken)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.error).to.equal(`Invalid user id or user not found`);
        done();
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

        // To check status if USER A has requested friend request to USER B
        Friend.find({
          requester: users[0]._id.toString(),
          recipient: users[1]._id.toString(),
        }).then((res, err) => {
          if (err) return done(err);
          expect(res[0].requester.toString()).to.equal(users[0]._id.toString());
          expect(res[0].recipient.toString()).to.equal(users[1]._id.toString());
          expect(res[0].status).to.equal(1); // 1-> requested
        });

        // To check status if USER B has received friend request from USER A
        Friend.find({
          requester: users[1]._id.toString(),
          recipient: users[0]._id.toString(),
        }).then((res, err) => {
          if (err) return done(err);
          expect(res[0].requester.toString()).to.equal(users[1]._id.toString());
          expect(res[0].recipient.toString()).to.equal(users[0]._id.toString());
          expect(res[0].status).to.equal(2); // 2-> pending
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
});

describe("PUT /:userId", () => {
  it("should throw an error if user not found", (done) => {
    request(server)
      .put(`/api/v1/friend/${users[2]._id}`)
      .set("Authorization", "Bearer " + userTwoToken)
      .expect(403)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("error", `User not found in list`);
        done();
      });
  });

  it("second user should able to accept friend request of first user", (done) => {
    request(server)
      .put(`/api/v1/friend/${users[0]._id}`)
      .set("Authorization", "Bearer " + userTwoToken)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body).to.have.property("success", true);
        expect(res.body).to.have.property("message", `Friend added to list!`);

        // To check document of FRIEND model USER A has status - 3 i.e Accepted req
        Friend.find({
          requester: users[0]._id,
          recipient: users[1]._id,
        }).then((res, err) => {
          if (err) return done(err);
          expect(res[0].requester.toString()).to.equal(users[0]._id.toString());
          expect(res[0].recipient.toString()).to.equal(users[1]._id.toString());
          expect(res[0]).to.have.property("status", 3);
        });

        // To check document of FRIEND model USER B has status - 3 i.e Accepted req
        Friend.find({
          requester: users[1]._id,
          recipient: users[0]._id,
        }).then((res, err) => {
          if (err) return done(err);
          expect(res[0].requester.toString()).to.equal(users[1]._id.toString());
          expect(res[0].recipient.toString()).to.equal(users[0]._id.toString());
          expect(res[0]).to.have.property("status", 3);
          done();
        });
      });
  });

  it("second user should not able to accept friend request again", (done) => {
    request(server)
      .put(`/api/v1/friend/${users[0]._id}`)
      .set("Authorization", "Bearer " + userTwoToken)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("error", `Already friends!`);
        done();
      });
  });

  it("first user should not able to send/accept friend request again", (done) => {
    request(server)
      .put(`/api/v1/friend/${users[1]._id}`)
      .set("Authorization", "Bearer " + userOneToken)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("error", `Already friends!`);
        done();
      });
  });
});

describe("GET /", () => {
  it("second user can see friend lists that should also contain first user", (done) => {
    request(server)
      .get(`/api/v1/friend/`)
      .set("Authorization", "Bearer " + userTwoToken)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("success", true);

        expect(res.body.user).to.be.an("array").and.to.not.be.empty;

        expect(res.body.user[0]).to.be.an("object").that.includes({
          requester: users[1]._id.toString(),
        });

        expect(res.body.user[0].recipient).to.be.an("object").that.includes({
          _id: users[0]._id.toString(),
        });

        expect(res.body.user[0].status).to.equal(3);

        done();
      });
  });

  it("first user can see friend lists that should also contain second user", (done) => {
    request(server)
      .get(`/api/v1/friend/`)
      .set("Authorization", "Bearer " + userOneToken)
      .expect(200)
      .end(async (err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("success", true);

        expect(res.body.user).to.be.an("array").and.to.not.be.empty;

        expect(res.body.user[0]).to.be.an("object").that.includes({
          requester: users[0]._id.toString(),
        });

        expect(res.body.user[0].recipient).to.be.an("object").that.includes({
          _id: users[1]._id.toString(),
        });

        expect(res.body.user[0].status).to.equal(3);

        done();
      });
  });
});

describe("DELETE /", () => {
  it("first user should remove second user from friend lists", (done) => {
    request(server)
      .delete(`/api/v1/friend/${users[1]._id}`)
      .set("Authorization", "Bearer " + userOneToken)
      .expect(200)
      .end(async (err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("success", true);
        expect(res.body).to.have.property(
          "message",
          "Friend removed from list!"
        );

        // To check document of FRIEND model USER A has been removed or not
        Friend.find({
          requester: users[0]._id,
          recipient: users[1]._id,
        }).then((res, err) => {
          expect(res).to.be.an("array").to.be.empty;
        });

        // To check document of FRIEND model USER B has been removed or not
        Friend.find({
          requester: users[1]._id,
          recipient: users[0]._id,
        }).then((res, err) => {
          expect(res).to.be.an("array").to.be.empty;
          done();
        });
      });
  });

  it("should throw an error if user not found or invalid id is passed", (done) => {
    request(server)
      .delete(`/api/v1/friend/${users[1]._id}`)
      .set("Authorization", "Bearer " + userOneToken)
      .expect(400)
      .end(async (err, res) => {
        if (err) return done(err);

        expect(res.body).to.have.property(
          "error",
          "User not found or invalid ID"
        );

        done();
      });
  });
});
