/* TEST: delete.charger.uidcharger.test.js */

const chai = require("chai");
const chaiHttp = require("chai-http");
const should = require("chai").should(); //actually call the function
const expect = require("chai").expect;

const config = require("../../config");

const api = require("../../api");
const { Users } = require("../../../db");

chai.use(chaiHttp);

const request = chai.request(config.baseUrl);

describe("[5] DELETE -/chargers/uidcharger operation requests", () => {
  let tokenAdmin, tokenUser;
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
    const dataAdmin = { data: config.charger_ok_Commander4, token: tokenAdmin };

    const respPulsarPlus = await api.fetchToken("chargers", dataAdmin, "POST");
    // console.log(tokenAdmin);
    // console.log(respPulsarPlus);
    charger = respPulsarPlus.charger;
  });

  it(`401 - bad request /chargers/{{uidcharger}}`, (done) => {
    request
      .delete("/chargers/" + charger.uid)
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

  it("400 - Unexpected string admin over admin /chargers/{{uidcharger}}", (done) => {
    request
      .delete("/chargers/" + charger.uid)
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
  it("400 - Unexpected string admin over charger /chargers/{{uidcharger}}", (done) => {
    request
      .delete("/chargers/" + charger.uid)
      .set("accept", "application/json")
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

  it("401 - Insufficient permissions - for user over charger /chargers", (done) => {
    request
      .delete("/chargers/" + charger.uid)
      .set("accept", "application/json")
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

  it("204 - OK - for admin over charger /chargers/{{uidcharger}}", (done) => {
    request
      .delete("/chargers/" + charger.uid)
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .end(function (err, res) {
        expect(res).to.have.status(204);
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done(); // <= Call done to signal callback end
      });
  });

  it("400 - Invalid value for charger, admin over charger /chargers/{{uidcharger}}", (done) => {
    request
      .delete("/chargers/" + "0001")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .end(function (err, res) {
        expect(res).to.have.status(400);
        console.log(res.body);
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done(); // <= Call done to signal callback end
      });
  });
});
