let chai = require("chai");
let chaiHttp = require("chai-http");
const { after, describe, it } = require("mocha");
let User = require("../models/User.model");
let server = require("../index.js");
const { expect } = require("chai");
const { populateUsers, users } = require("./seed/seed");
let should = chai.should();

chai.use(chaiHttp);

var token;

const user = {
  name: "pratik aswani",
  email: "pratik@gmail.com",
  password: "123456",
};

describe("POST /auth", () => {
  before((done) => {
    User.deleteMany({}, (err) => {
      done();
    });
  });

  it("should able to create user and return auth token", (done) => {
    chai
      .request(server)
      .post("/api/v1/auth/signup")
      .send(user)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        expect(res.headers["Authorization"]).to.not.be.null;
        expect(res.body.token).to.not.be.null;
        expect(res.body.user).to.have.property("email", user.email);
        User.findOne({ email: user.email }).then((user) => {
          expect(user).to.not.be.null;
          done();
        });
      });
  });

  it("should not create user if email in use", (done) => {
    chai
      .request(server)
      .post("/api/v1/auth/signup")
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body).to.have.property(
          "error",
          "Email is already registered, please try again with another email"
        );
        done();
      });
  });

  it("Should login user and return auth token", (done) => {
    chai
      .request(server)
      .post("/api/v1/auth/signin")
      .send({
        email: user.email,
        password: user.password,
      })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.headers["Authorization"]).to.not.be.null;
        expect(res.body.token).to.not.be.null;
        token = res.body.token;
        User.findById(res.body.user._id)
          .then((user) => {
            expect(user).to.not.be.null;
            done();
          })
          .catch((err) => done(err));
      });
  });

  it("Should reject login with invalid email", (done) => {
    chai
      .request(server)
      .post("/api/v1/auth/signin")
      .send({
        email: "abc@gmail.com",
        password: user.password,
      })
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body).to.have.property("error", "email is incorrect");
        done();
      });
  });

  it("Should reject login with invalid password", (done) => {
    chai
      .request(server)
      .post("/api/v1/auth/signin")
      .send({
        email: user.email,
        password: `djdjdjdj`,
      })
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body).to.have.property("error", "password is incorrect");
        done();
      });
  });
});

describe("GET /user", () => {
  before((done) => {
    populateUsers();
    done();
  });

  it("Should return seven users", (done) => {
    chai
      .request(server)
      .get("/api/v1/user")
      .query({ page: 1, limit: 7 })
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);

        expect(res.body.Users).to.be.a("array");
        expect(res.body.Users).to.have.length(7);
        expect(res.body).to.have.property("totalUsersCount", 8);
        expect(res.body).to.have.property("filteredUsers", 7);

        const updatedUsers = users.map((user) => {
          return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
          };
        });

        expect(...res.body.Users).to.include(...updatedUsers);

        done();
      });
  });

  it("Should return six users", (done) => {
    chai
      .request(server)
      .get("/api/v1/user")
      .query({ page: 1 })
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);

        expect(res.body.Users).to.be.a("array");
        expect(res.body.Users).to.have.length(6);
        expect(res.body).to.have.property("totalUsersCount", 8);
        expect(res.body).to.have.property("filteredUsers", 6);
        done();
      });
  });

  it("Should return one user", (done) => {
    chai
      .request(server)
      .get("/api/v1/user")
      .query({ page: 2 })
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);

        expect(res.body.Users).to.be.a("array");
        expect(res.body.Users).to.have.length(1);
        expect(res.body).to.have.property("totalUsersCount", 8);
        expect(res.body).to.have.property("filteredUsers", 1);
        done();
      });
  });

  it("Should return users that has firstname starts with user", (done) => {
    chai
      .request(server)
      .get("/api/v1/user")
      .query({ search: "user" })
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);

        expect(res.body.Users).to.be.a("array");
        expect(res.body.Users).to.have.length(6);
        expect(res.body).to.have.property("totalUsersCount", 8);
        expect(res.body).to.have.property("filteredUsers", 6);
        done();
      });
  });

  it("Should return users that has endname starts with four", (done) => {
    chai
      .request(server)
      .get("/api/v1/user")
      .query({ search: "four" })
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);

        expect(res.body.Users).to.be.a("array");
        expect(res.body.Users).to.have.length(1);
        expect(res.body).to.have.property("totalUsersCount", 8);
        expect(res.body).to.have.property("filteredUsers", 1);
        done();
      });
  });

  it("Should return seven users from leaderboard api", (done) => {
    chai
      .request(server)
      .get("/api/v1/user/leaderboard")
      .query({ page: 1, limit: 7 })
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);

        expect(res.body.data).to.be.a("array");
        expect(res.body.data).to.have.length(7);

        expect(res.body).to.have.property("usersCount", 8);
        expect(res.body).to.have.property("filteredUsers", 7);
        done();
      });
  });

  it("Should return six users from leaderboard api", (done) => {
    chai
      .request(server)
      .get("/api/v1/user/leaderboard")
      .query({ page: 1 })
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);

        expect(res.body.data).to.be.a("array");
        expect(res.body.data).to.have.length(6);

        expect(res.body).to.have.property("usersCount", 8);
        expect(res.body).to.have.property("filteredUsers", 6);
        done();
      });
  });

  it("Should return two user from leaderboard api", (done) => {
    chai
      .request(server)
      .get("/api/v1/user/leaderboard")
      .query({ page: 2 })
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);

        expect(res.body.data).to.be.a("array");
        expect(res.body.data).to.have.length(2);

        expect(res.body).to.have.property("usersCount", 8);
        expect(res.body).to.have.property("filteredUsers", 2);
        done();
      });
  });

  it("Should return a user profile data", (done) => {
    chai
      .request(server)
      .get("/api/v1/user/dashboard")
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        if (err) return done(err);
        res.should.have.status(200);
        expect(res.body).to.have.property("success", true);

        expect(res.body.loggedUser).to.be.an("object").and.not.to.be.empty;
        expect(res.body.loggedUser.social).to.be.an("object").and.not.to.be
          .empty;

        expect(res.body.loggedUser).to.have.property("name", user.name);
        expect(res.body.loggedUser).to.have.property("email", user.email);
        expect(res.body.loggedUser).to.have.property("rating", 0);
        done();
      });
  });
});

module.exports = token;

// **** Some imp definations ****

// describe(): This is used to associate multiple tests in one collection.
// it(): This is used in a single test unit to mention how the test should behave and a callback to execute the test body.
// chai.request(): This is used to make an HTTP Request to the REST API
// done(): This is used to mention that the test was successful.
// xx.should.xxx(): The function should help to assert the test condition that is make test assertions. If the condition fails, the test fails.
