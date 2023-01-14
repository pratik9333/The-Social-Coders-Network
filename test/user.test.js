let chai = require("chai");
let chaiHttp = require("chai-http");
const { after, describe, it } = require("mocha");
let User = require("../models/User.model");
let server = require("../index.js");
const { expect } = require("chai");
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
    //Before each test we empty the database
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
        expect(res.headers["authorization"]).to.not.be.null;
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

  // it("should not be able to login if users have not registered", (done) => {
  //   chai
  //     .request(server)
  //     .post("/api/v1/auth/signin")
  //     .send({
  //       email: user.email,
  //       password: user.password,
  //     })
  //     .end(function (err, res) {
  //       res.should.have.status(401);
  //       expect(res.body).to.have.property("error", "email is incorrect");
  //       done();
  //     });
  // });

  // it("it should able to login to existing user", (done) => {
  //   chai
  //     .request(server)
  //     .post("/api/v1/auth/signin")
  //     .send({
  //       name: "pratik",
  //       email: "pratik@gmail.com",
  //       password: "1234567",
  //     })
  //     .end((err, res) => {
  //       res.should.have.status(200);
  //       res.body.should.have.property("token");
  //       token = res.body.token;
  //       res.body.should.have.property("user");
  //       done();
  //     });
  // });

  // it("should be able to logout", (done) => {
  //   chai
  //     .request(server)
  //     .get("/api/v1/auth/signout")
  //     .set("Authorization", "Bearer " + token)
  //     .end((err, res) => {
  //       res.should.have.status(200);
  //       expect(res.body).to.have.property("success", true);
  //       expect(res.body).to.have.property("message", "Logout Success");
  //       done();
  //     });
  // });

  after(function (done) {
    server.close(done);
  });
});

// **** Some imp definations ****

// describe(): This is used to associate multiple tests in one collection.
// it(): This is used in a single test unit to mention how the test should behave and a callback to execute the test body.
// chai.request(): This is used to make an HTTP Request to the REST API
// done(): This is used to mention that the test was successful.
// xx.should.xxx(): The function should help to assert the test condition that is make test assertions. If the condition fails, the test fails.
