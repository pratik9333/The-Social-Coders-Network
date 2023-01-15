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
        expect(res.headers["authorization"]).to.not.be.null;
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

describe("GET /users", () => {
  before((done) => {
    populateUsers();
    done();
  });

  it("Should return 7 paginated users", (done) => {
    chai
      .request(server)
      .get("/api/v1/user")
      .query({ page: 1, limit: 7 })
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        expect(res.body.Users).to.be.a("array");
        expect(res.body.Users).to.have.length(7);
        expect(res.body).to.have.property("totalUsersCount", 8);
        expect(res.body).to.have.property("filteredUsers", 7);

        // *** checking all users email and name ***

        // checking first user name and email
        expect(res.body.Users[0]).to.have.property("name", users[0].name);
        expect(res.body.Users[0]).to.have.property("email", users[0].email);

        // checking second user name and email
        expect(res.body.Users[1]).to.have.property("name", users[1].name);
        expect(res.body.Users[1]).to.have.property("email", users[1].email);

        // checking third user name and email
        expect(res.body.Users[2]).to.have.property("name", users[2].name);
        expect(res.body.Users[2]).to.have.property("email", users[2].email);

        // checking fourth user name and email
        expect(res.body.Users[3]).to.have.property("name", users[3].name);
        expect(res.body.Users[3]).to.have.property("email", users[3].email);

        // checking fifth user name and email
        expect(res.body.Users[4]).to.have.property("name", users[4].name);
        expect(res.body.Users[4]).to.have.property("email", users[4].email);

        // checking six user name and email
        expect(res.body.Users[5]).to.have.property("name", users[5].name);
        expect(res.body.Users[5]).to.have.property("email", users[5].email);

        // checking seven user name and email
        expect(res.body.Users[6]).to.have.property("name", users[6].name);
        expect(res.body.Users[6]).to.have.property("email", users[6].email);

        done();
      });
  });

  it("Should return 6 paginated users", (done) => {
    chai
      .request(server)
      .get("/api/v1/user")
      .query({ page: 1 })
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        expect(res.body.Users).to.be.a("array");
        expect(res.body.Users).to.have.length(6);
        expect(res.body).to.have.property("totalUsersCount", 8);
        expect(res.body).to.have.property("filteredUsers", 6);
        done();
      });
  });

  it("Should return 1 paginated user", (done) => {
    chai
      .request(server)
      .get("/api/v1/user")
      .query({ page: 2 })
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        expect(res.body.Users).to.be.a("array");
        expect(res.body.Users).to.have.length(1);
        expect(res.body).to.have.property("totalUsersCount", 8);
        expect(res.body).to.have.property("filteredUsers", 1);
        done();
      });
  });

  it("Should return null array of users", (done) => {
    chai
      .request(server)
      .get("/api/v1/user")
      .query({ page: 3 })
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        expect(res.body.Users).to.be.a("array");
        expect(res.body.Users).to.have.length(0);
        expect(res.body).to.have.property("totalUsersCount", 8);
        expect(res.body).to.have.property("filteredUsers", 0);
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
