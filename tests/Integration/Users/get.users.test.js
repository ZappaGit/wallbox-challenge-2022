/* TEST: get.users.test.js */

const chai = require("chai");
const chaiHttp = require("chai-http");
const should = require("chai").should(); //actually call the function
const expect = require("chai").expect;

const config = require("../../config");

const lowdb = require("lowdb");
const storage = require("lowdb/file-sync");

const { Users } = require("../../../db");

const db = lowdb(config.db, {
  storage: storage,
});

chai.use(chaiHttp);

const request = chai.request(config.baseUrl);

describe("get-users operation requests", () => {
  let tokenAdmin, tokenUser;

  before(() => {
    tokenAdmin = db("tokens").find({ role: "admin" });
    tokenUser = db("tokens").find({ role: "user" });
    if (tokenAdmin) {
      tokenAdmin = tokenAdmin.token;
    }
    if (tokenUser) {
      tokenUser = tokenUser.token;
    }
    db("users").remove();
  });
  it("401 - bad request /users", (done) => {
    request
      .get("/users")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .send()
      .end(function (err, res) {
        expect(res).to.have.status(401);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        res.body.message.should.be.eql("Invalid token");
        done(); // <= Call done to signal callback end
      });
  });

  it("400 - Unexpected string /users", (done) => {
    request
      .get("/users")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Content-Type", "application/json")
      .send("something", "error")
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

  it("200 - OK for admin over user /users", (done) => {
    request
      .get("/users")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        res.body.users
          .map((e) => e.role)
          .should.to.include.members(["admin", "user"]);
        res.body.users.forEach((u) => {
          db("users").push(u);
        });
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done();
      });
  });

  it("200 - OK for user over user /users", (done) => {
    request
      .get("/users")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenUser)
      .end(function (err, res) {
        res.should.have.status(200);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        res.body.users.map((e) => e.role).should.to.include.members(["user"]);
        res.body.users
          .map((e) => e.role)
          .should.to.not.include.members(["admin"]);

        done(); // <= Call done to signal callback end
      });
  });
});
