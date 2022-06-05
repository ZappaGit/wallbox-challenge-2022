/* TEST: get.users.uuiduser.test.js */

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

describe("get-users-uiduser operation requests", () => {
  let tokenAdmin, tokenUser;
  let uidAdmin, uidUser;

  before(() => {
    tokenAdmin = db("tokens").find({ role: "admin" });
    tokenUser = db("tokens").find({ role: "user" });
    if (tokenAdmin) {
      tokenAdmin = tokenAdmin.token;
    }
    if (tokenUser) {
      tokenUser = tokenUser.token;
    }

    uidAdmin = db("users").find({ role: "admin" });
    uidUser = db("users").find({ role: "user" });
    if (uidAdmin) {
      uidAdmin = uidAdmin.uid;
    }
    if (uidUser) {
      uidUser = uidUser.uid;
    }
    console.log(uidAdmin);
  });
  it(`401 - bad request /users/{{uidAdmin}}`, (done) => {
    request
      .get("/users/" + uidAdmin)
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

  it("400 - Unexpected string admin over admin /users/{{uidAdmin}}", (done) => {
    request
      .get("/users/" + uidAdmin)
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
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
  it("400 - Unexpected string user over user /users/{{uidUser}}", (done) => {
    request
      .get("/users/" + uidUser)
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenUser)
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

  it("200 - OK for admin over user /users/{{uidUser}}", (done) => {
    request
      .get("/users/" + uidUser)
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
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done(); // <= Call done to signal callback end
      });
  });

  it("200 - OK for admin over admin  /users/{{uidAdmin}}", (done) => {
    request
      .get("/users/" + uidAdmin)
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
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done(); // <= Call done to signal callback end
      });
  });

  it("200 - OK for user over user  /users/{{uidUser}}", (done) => {
    request
      .get("/users/" + uidUser)
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenUser)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done(); // <= Call done to signal callback end
      });
  });

  it("403 - forbiden for user over admin /users/{{uidUser}}", (done) => {
    request
      .get("/users/" + uidAdmin)
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenUser)
      .end(function (err, res) {
        res.should.have.status(403);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done(); // <= Call done to signal callback end
      });
  });
});
