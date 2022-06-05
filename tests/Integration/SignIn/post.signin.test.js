/* TEST: post.signin.test.js */

const chai = require("chai");
const chaiHttp = require("chai-http");
const should = require("chai").should(); //actually call the function
const expect = require("chai").expect;

const config = require("../../config");

const storage = require("lowdb/file-sync");
const lowdb = require("lowdb");

const { Users } = require("../../../db");

const db = lowdb(config.db, {
  storage: storage,
});

chai.use(chaiHttp);

const request = chai.request(config.baseUrl);
describe("signin operation", () => {
  before(() => {
    db("tokens").remove();
  });
  it("400 - bad request", (done) => {
    request
      .post("/signin")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        email: "any",
        password: "any",
      })
      .end(function (err, res) {
        expect(res).to.have.status(400);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done(); // <= Call done to signal callback end
      });
  });

  it("200 - OK - for User", (done) => {
    const miUser = Users.find((user) => user.role === "user");
    request
      .post("/signin")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .send(miUser)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        res.body.email.should.be.eql(miUser.email);
        res.body.uid.should.be.a("string");
        res.body.jwt.should.be.a("string");
        db("tokens").push({
          token: res.body.jwt,
          role: "user",
          timestamp: Date.now(),
        });
        done(); // <= Call done to signal callback end
      });
  });

  it("200 - OK - for Admin", (done) => {
    const miUser = Users.find((user) => user.role === "admin");
    request
      .post("/signin")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .send(miUser)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        res.body.email.should.be.eql(miUser.email);
        res.body.uid.should.be.a("string");
        res.body.jwt.should.be.a("string");
        db("tokens").push({
          token: res.body.jwt,
          role: "admin",
          timestamp: Date.now(),
        });
        done(); // <= Call done to signal callback end
      });
  });
});
