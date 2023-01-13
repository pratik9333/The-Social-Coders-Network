let mongoose = require("mongoose");

let chai = require("chai");
let chaiHttp = require("chai-http");
const { after, describe, it } = require("mocha");
let User = require("../models/User.model");
let server = require("../index.js");
const { expect } = require("chai");
let should = chai.should();

chai.use(chaiHttp);

// Agent that will keep track of our cookies
const agent = chai.request.agent(server);

// describe(): This is used to associate multiple tests in one collection.
// it(): This is used in a single test unit to mention how the test should behave and a callback to execute the test body.
// chai.request(): This is used to make an HTTP Request to the REST API
// done(): This is used to mention that the test was successful.
// xx.should.xxx(): The function should help to assert the test condition that is make test assertions. If the condition fails, the test fails.

describe("Authentication", () => {
  before((done) => {
    //Before each test we empty the database
    User.deleteMany({}, (err) => {
      done();
    });
  });
  /*
   * Testing the authentication part includes signup, signin and signout
   */
  describe("User Authentication", () => {
    it("should not be able to login if users have not registered", (done) => {
      agent
        .post("/api/v1/auth/signin")
        .send({
          email: "pratik@gmail.com",
          password: "1234567",
        })
        .end(function (err, res) {
          res.should.have.status(401);
          done();
        });
    });

    it("it should add new user on signup", (done) => {
      agent
        .post("/api/v1/auth/signup")
        .send({
          name: "pratik",
          email: "pratik@gmail.com",
          password: "1234567",
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("token");
          res.body.should.have.property("user");
          done();
        });
    });

    it("it should able to login to existing user", (done) => {
      agent
        .post("/api/v1/auth/signin")
        .send({
          name: "pratik",
          email: "pratik@gmail.com",
          password: "1234567",
        })
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property("token");
          res.body.should.have.property("user");
          done();
        });
    });

    it("should be able to logout", (done) => {
      agent.get("/api/v1/auth/signout").end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.have.property("success", true);
        expect(res.body).to.have.property("message", "Logout Success");
        done();
      });
    });
  });

  after(function (done) {
    server.close(done);
  });
});
