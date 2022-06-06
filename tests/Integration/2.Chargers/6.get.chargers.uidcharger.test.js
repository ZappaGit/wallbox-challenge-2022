/* TEST: get.chargers.uuidcharger.test.js */

const chai = require("chai");
const chaiHttp = require("chai-http");
const should = require("chai").should(); //actually call the function
const expect = require("chai").expect;

const api = require("../../api");
const { Users } = require("../../../db");

const config = require("../../config");

chai.use(chaiHttp);

const request = chai.request(config.baseUrl);

describe("[6] GET -/chargers/uidcharger operation requests", () => {
  let tokenAdmin, tokenUser;
  let uidAdmin, uidUser;
  let charger;

  before(async () => {
    const respUser = await api.fetchSinToken(
      "signin",
      Users.find((user) => user.role === "user"),
      "POST"
    );
    tokenUser = `token ${respUser.jwt}`;
    uidUser = respUser.uid;
    const respAdmin = await api.fetchSinToken(
      "signin",
      Users.find((user) => user.role === "admin"),
      "POST"
    );
    tokenAdmin = `token ${respAdmin.jwt}`;
    uidAdmin = respAdmin.uid;
    const dataAdmin = { data: config.charger_ok_Commander5, token: tokenAdmin };

    const respPulsarPlus = await api.fetchToken("chargers", dataAdmin, "POST");
    // console.log(tokenAdmin);
    console.log(respPulsarPlus);
    charger = respPulsarPlus.charger;
  });

  it(`401 -  Invalid token /chargers/{{uuidcharger}}`, (done) => {
    request
      .get("/chargers/" + charger.uid)
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

  it("400 - Unexpected string admin over admin /chargers/{{uuidcharger}}", (done) => {
    request
      .get("/chargers/" + charger.uid)
      .set("accept", "application/json")
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

  it("200 - OK for admin over charger /chargers/{{uuidcharger}}", (done) => {
    request
      .get("/chargers/" + charger.uid)
      .set("accept", "application/json")
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

  it("200 - OK for admin over admin  /chargers/{{uuidcharger}}", (done) => {
    request
      .get("/chargers/" + charger.uid)
      .set("accept", "application/json")
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

  it("403 - forbiden for user over admin /chargers/{{uuidcharger}}", (done) => {
    request
      .get("/chargers/" + charger.uid)
      .set("accept", "application/json")
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
