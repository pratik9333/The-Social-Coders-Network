let chai = require("chai");
const request = require("supertest");
const { after, describe, it } = require("mocha");
let User = require("../models/User.model");
let server = require("../index.js");
const { expect } = require("chai");
const { populateUsers, users } = require("./seed/seed");
let should = chai.should();

const fs = require("fs");
const path = require("path");

const nock = require("nock");
const query = require("../utils/ExternalAPI/fetchCodeData");

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
    request(server)
      .post("/api/v1/auth/signup")
      .send(user)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
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
    request(server)
      .post("/api/v1/auth/signup")
      .send(user)
      .expect(400)
      .end((err, res) => {
        expect(res.body).to.have.property(
          "error",
          "Email is already registered, please try again with another email"
        );
        done();
      });
  });

  it("Should login user and return auth token", (done) => {
    request(server)
      .post("/api/v1/auth/signin")
      .send({
        email: user.email,
        password: user.password,
      })
      .expect(200)
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
    request(server)
      .post("/api/v1/auth/signin")
      .send({
        email: "abc@gmail.com",
        password: user.password,
      })
      .expect(401)
      .end((err, res) => {
        expect(res.body).to.have.property("error", "email is incorrect");
        done();
      });
  });

  it("Should reject login with invalid password", (done) => {
    request(server)
      .post("/api/v1/auth/signin")
      .send({
        email: user.email,
        password: `djdjdjdj`,
      })
      .expect(401)
      .end((err, res) => {
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
    request(server)
      .get("/api/v1/user")
      .query({ page: 1, limit: 7 })
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

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
    request(server)
      .get("/api/v1/user")
      .query({ page: 1 })
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.Users).to.be.a("array");
        expect(res.body.Users).to.have.length(6);
        expect(res.body).to.have.property("totalUsersCount", 8);
        expect(res.body).to.have.property("filteredUsers", 6);
        done();
      });
  });

  it("Should return one user", (done) => {
    request(server)
      .get("/api/v1/user")
      .query({ page: 2 })
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.Users).to.be.a("array");
        expect(res.body.Users).to.have.length(1);
        expect(res.body).to.have.property("totalUsersCount", 8);
        expect(res.body).to.have.property("filteredUsers", 1);
        done();
      });
  });

  it("Should return users that has firstname starts with user", (done) => {
    request(server)
      .get("/api/v1/user")
      .query({ search: "user" })
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.Users).to.be.a("array");
        expect(res.body.Users).to.have.length(6);
        expect(res.body).to.have.property("totalUsersCount", 8);
        expect(res.body).to.have.property("filteredUsers", 6);
        done();
      });
  });

  it("Should return users that has endname starts with four", (done) => {
    request(server)
      .get("/api/v1/user")
      .query({ search: "four" })
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.Users).to.be.a("array");
        expect(res.body.Users).to.have.length(1);
        expect(res.body).to.have.property("totalUsersCount", 8);
        expect(res.body).to.have.property("filteredUsers", 1);
        done();
      });
  });

  it("Should return seven users from leaderboard api", (done) => {
    request(server)
      .get("/api/v1/user/leaderboard")
      .query({ page: 1, limit: 7 })
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.data).to.be.a("array");
        expect(res.body.data).to.have.length(7);

        expect(res.body).to.have.property("usersCount", 8);
        expect(res.body).to.have.property("filteredUsers", 7);
        done();
      });
  });

  it("Should return six users from leaderboard api", (done) => {
    request(server)
      .get("/api/v1/user/leaderboard")
      .query({ page: 1 })
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.data).to.be.a("array");
        expect(res.body.data).to.have.length(6);

        expect(res.body).to.have.property("usersCount", 8);
        expect(res.body).to.have.property("filteredUsers", 6);
        done();
      });
  });

  it("Should return two user from leaderboard api", (done) => {
    request(server)
      .get("/api/v1/user/leaderboard")
      .query({ page: 2 })
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        expect(res.body.data).to.be.a("array");
        expect(res.body.data).to.have.length(2);

        expect(res.body).to.have.property("usersCount", 8);
        expect(res.body).to.have.property("filteredUsers", 2);
        done();
      });
  });

  it("Should return a user profile data", (done) => {
    request(server)
      .get("/api/v1/user/dashboard")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
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

describe("PUT /user", () => {
  before((done) => {
    //const mock = nock("https://leetcode.com/graphql");

    nock("https://api.cloudinary.com")
      .post("/v1_1/pratikaswani/image/upload")
      .reply(200, {
        public_id: "93332001",
        url: "http://res.cloudinary.com/pratikaswani/image/upload/v1524241067/93332001.jpg",
        secure_url:
          "https://res.cloudinary.com/pratikaswani/image/upload/v1524241067/93332001.jpg",
        format: "jpg",
      });

    // mocking github api that returns github profile data
    nock("https://api.github.com/users/pratik9333").get().reply(200, {
      username: "pratik9333",
      publicRepos: "68",
      followers: "10",
      following: "5",
    });

    // mock
    //   .post("https://leetcode.com/graphql", {
    //     query: query,
    //     variables: {
    //       username: "pratik9333",
    //       limit: 5,
    //     },
    //   })
    //   .reply(200, { data: {} });

    done();
  });
  it("should update the user email and name", (done) => {
    request(server)
      .put("/api/v1/user")
      .send({
        name: "Sahil Jha",
        email: "sahiljha@gmail.com",
      })
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("success", true);
        expect(res.body).to.have.property("message", "User profile is updated");

        expect(res.body.updatedUser).to.be.an("object").and.not.to.be.empty;
        expect(res.body.updatedUser.social).to.be.an("object").and.not.to.be
          .empty;

        expect(res.body.updatedUser).to.have.property("name", "Sahil Jha");
        expect(res.body.updatedUser).to.have.property(
          "email",
          "sahiljha@gmail.com"
        );

        done();
      });
  });

  it("should update the user profile image and return public ID and and URL of uploaded image", (done) => {
    request(server)
      .put("/api/v1/user")
      .set("Content-Type", "multipart/form-data")
      .set("Authorization", "Bearer " + token)
      .expect(200)
      .attach(
        "photo",
        fs.readFileSync(path.resolve(__dirname, "./testImages/demo.jpeg"))
      )
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.have.property("success", true);
        expect(res.body).to.have.property("message", "User profile is updated");

        expect(res.body.updatedUser).to.be.an("object").and.not.to.be.empty;
        expect(res.body.updatedUser.social).to.be.an("object").and.not.to.be
          .empty;

        expect(res.body.updatedUser.photo).to.be.an("object").and.not.to.be
          .empty;

        expect(res.body.updatedUser.photo).to.have.property("id", "93332001");
        expect(res.body.updatedUser.photo).to.have.property(
          "url",
          "https://res.cloudinary.com/pratikaswani/image/upload/v1524241067/93332001.jpg"
        );

        done();
      });
  });

  after(() => {
    nock.cleanAll();
  });
});

module.exports = token;

// **** Some imp definations ****

// describe(): This is used to associate multiple tests in one collection.
// it(): This is used in a single test unit to mention how the test should behave and a callback to execute the test body.
// chai.request(): This is used to make an HTTP Request to the REST API
// done(): This is used to mention that the test was successful.
// xx.should.xxx(): The function should help to assert the test condition that is make test assertions. If the condition fails, the test fails.
