/* TEST: post.chargers.test.js */

const chai = require("chai");
const chaiHttp = require("chai-http");
const should = require("chai").should(); //actually call the function
const expect = require("chai").expect;
const api = require("../../api");

const config = require("../../config");

const { Users } = require("../../../db");

chai.use(chaiHttp);

const request = chai.request(config.baseUrl);

describe("[3] POST -/xchargers operation requests", () => {
  let tokenAdmin, tokenUser;

  before(async () => {
    const respUser = await api.fetchSinToken(
      "signin",
      Users.find((user) => user.role === "user"),
      "POST"
    );
    tokenUser = `token ${respUser.jwt}`;
    const respAdmin = await api.fetchSinToken(
      "signin",
      Users.find((user) => user.role === "admin"),
      "POST"
    );
    tokenAdmin = `token ${respAdmin.jwt}`;
  });

  it("401 - Invalid token /chargers", (done) => {
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

  it("200 - OK for admin over chargers ", (done) => {
    request
      .post("/chargers")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .send(config.charger_ok_PulsarPlus)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        res.body.message.should.be.eql("Charger registered");

        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done();
      });
  });

  it("400 - wrong without serial number for admin over chargers ", (done) => {
    request
      .post("/chargers")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .send(config.charger_ok_noSerialNumber)
      .end(function (err, res) {
        expect(res).to.have.status(400);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        res.body.errors.should.be.a("array");

        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done();
      });
  });

  it("409 - wrong charger uid for admin over chargers ", (done) => {
    request
      .post("/chargers")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .send(config.charger_wrong_noUID)
      .end(function (err, res) {
        expect(res).to.have.status(409);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );

        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done();
      });
  });

  it("409 - Serial number already in use, for admin over chargers ", (done) => {
    request
      .post("/chargers")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .send(config.charger_ok_PulsarPlus)
      .end(function (err, res) {
        expect(res).to.have.status(409);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        res.body.message.should.be.eql("Serial number already in use");

        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done();
      });
  });

  it("401 - Insufficient permissions - for user over chargers ", (done) => {
    request
      .post("/chargers")
      .set("accept", "application/json")
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
});
