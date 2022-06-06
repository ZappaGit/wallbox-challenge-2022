/* TEST: delete.users.uuiduser.test.js */

const chai = require("chai");
const chaiHttp = require("chai-http");
const should = require("chai").should(); //actually call the function
const expect = require("chai").expect;

const config = require("../../config");

const api = require("../../api");
const { Users } = require("../../../db");

chai.use(chaiHttp);

const request = chai.request(config.baseUrl);

describe("[12] DELETE -/xusers/uiduser operation requests", () => {
  let tokenAdmin, tokenUser;
  let uidAdmin, uidUser;

  before(async () => {
    const respUser = await api.fetchSinToken(
      "signin",
      Users.find((user) => user.role === "user"),
      "POST"
    );
    //console.log(respUser);
    tokenUser = `token ${respUser.jwt}`;
    uidUser = respUser.uid;
    const respAdmin = await api.fetchSinToken(
      "signin",
      Users.find((user) => user.role === "admin"),
      "POST"
    );
    tokenAdmin = `token ${respAdmin.jwt}`;
    uidAdmin = respAdmin.uid;
    //console.log(tokenAdmin, uidAdmin, tokenUser, uidUser);
  });

  it(`401 - bad request /users/{{uidAdmin}}`, (done) => {
    request
      .delete("/users/" + uidUser)
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
      .delete("/users/" + uidUser)
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
      .delete("/users/" + uidUser)
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

  it("401 - Insufficient permissions - for user over user /users", (done) => {
    request
      .delete("/users/" + uidUser)
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenUser)
      .send()
      .end(function (err, res) {
        expect(res).to.have.status(401);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        res.body.message.should.be.eql("Insufficient permissions");

        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done();
      });
  });

  it("204 - OK for admin over user /users/{{uidUser}}", (done) => {
    request
      .delete("/users/" + uidUser)
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .end(function (err, res) {
        expect(res).to.have.status(204);

        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done(); // <= Call done to signal callback end
      });
  });

  it("404 - User not found for admin over user /users/{{uidUser}}", (done) => {
    request
      .delete("/users/" + uidUser)
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .end(function (err, res) {
        expect(res).to.have.status(404);
        res.body.message.should.be.eql("User not found");
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done(); // <= Call done to signal callback end
      });
  });

  // it("401 - Could not verify token, for admin over admin  /users/{{uidAdmin}}", (done) => {
  //   request
  //     .delete("/users/" + uidUser)
  //     .set("accept", "application/json")
  //     .set("Content-Type", "application/json")
  //     .set("Content-Type", "application/json")
  //     .set("authorization", tokenUser)
  //     .end(function (err, res) {
  //       expect(res).to.have.status(401);
  //       res.body.message.should.be.eql("Could not verify token");
  //       expect(res).to.have.header("Access-Control-Allow-Origin", "*");
  //       done(); // <= Call done to signal callback end
  //     });
  // });
});
