/* TEST: delete.chargers.uidchargers.users.uiduser.test.js */

const chai = require("chai");
const chaiHttp = require("chai-http");
const should = require("chai").should(); //actually call the function
const expect = require("chai").expect;
const api = require("../../api");

const config = require("../../config");

const { Users } = require("../../../db");

chai.use(chaiHttp);

const request = chai.request(config.baseUrl);

describe("[8] DELETE -/chargers/{uidcharger/user/{uidcharger} operation requests", () => {
  let tokenAdmin, tokenUser;

  before(async () => {
    const respUser = await api.fetchSinToken(
      "signin",
      chargers.find((user) => user.role === "user"),
      "POST"
    );
    tokenUser = `token ${respUser.jwt}`;
    const respAdmin = await api.fetchSinToken(
      "signin",
      chargers.find((user) => user.role === "admin"),
      "POST"
    );
    tokenAdmin = `token ${respAdmin.jwt}`;
  });

  it("401 - bad request /chargers", (done) => {
    request
      .post("/chargers")
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

  it("400 - Unexpected string /chargers", (done) => {
    request
      .post("/chargers")
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

  it("200 - OK for admin over user /chargers", (done) => {
    request
      .post("/chargers")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .send(config.user_ok_2)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        res.body.message.should.be.eql("User registered");

        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done();
      });
  });

  it("401 - Insufficient permissions - for user over user /chargers", (done) => {
    request
      .post("/chargers")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenUser)
      .send(config.user_ok_1)
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

  //   it("409 - OK for user over user /chargers", (done) => {
  //     request
  //       .post("/chargers")
  //       .set("accept", "application/json")
  //       .set("Content-Type", "application/json")
  //       .set("Content-Type", "application/json")
  //       .set("authorization", tokenUser)
  //       .send(config.user_ok_2)
  //       .end(function (err, res) {
  //         res.should.have.status(200);
  //         expect(res).to.have.header(
  //           "content-type",
  //           "application/json; charset=utf-8"
  //         );
  //         expect(res).to.have.header("Access-Control-Allow-Origin", "*");
  //         res.body.message.should.be.eql("Email already in use");
  //         done(); // <= Call done to signal callback end
  //       });
  //   });
});
