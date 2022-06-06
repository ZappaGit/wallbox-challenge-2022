/* TEST: delete.chargers.uidchargers.users.uiduser.test.js */

const chai = require("chai");
const chaiHttp = require("chai-http");
const should = require("chai").should(); //actually call the function
const expect = require("chai").expect;
const { ulid } = require("ulid");

const api = require("../../api");

const config = require("../../config");

const { Users } = require("../../../db");

chai.use(chaiHttp);

const request = chai.request(config.baseUrl);

describe("[8] DELETE -/chargers/{uidcharger/users/{uiduser} operation requests", () => {
  let tokenAdmin, tokenUser, uidUser;

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
    const dataAdmin = {
      data: config.charger_ok_PulsarPlus2,
      token: tokenAdmin,
    };

    const respPulsarPlus = await api.fetchToken("chargers", dataAdmin, "POST");
    console.log(tokenAdmin);
    console.log(respPulsarPlus, uidUser);
    charger = respPulsarPlus.charger;
  });

  it("401 - Invalid token -/chargers/{uidcharger}/users/{uiduser}", (done) => {
    request
      .delete("/chargers/" + charger.uid + "/users/" + uidUser)
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

  it("400 - Unexpected string -/chargers/{uidcharger}/users/{uiduser}", (done) => {
    request
      .delete("/chargers/" + charger.uid + "/users/" + uidUser)
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

  it("404 - Charger not found - admin over /chargers/{uidcharger}/users/{uiduser}", (done) => {
    request
      .delete("/chargers/" + ulid() + "/users/" + uidUser)
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .send()
      .end(function (err, res) {
        res.should.have.status(404);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        res.body.message.should.be.eql("Charger not found");
        done(); // <= Call done to signal callback end
      });
  });

  it("404 - User not found - admin over /chargers/{uidcharger}/users/{uiduser}", (done) => {
    request
      .delete("/chargers/" + charger.uid + "/users/" + ulid())
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .send()
      .end(function (err, res) {
        res.should.have.status(404);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        res.body.message.should.be.eql("User not found");
        done(); // <= Call done to signal callback end
      });
  });

  it("200 - Removed charger access from user - for admin over -/chargers/{uidcharger}/users/{uiduser}", (done) => {
    request
      .delete("/chargers/" + charger.uid + "/users/" + uidUser)
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .send()
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        res.body.message.should.be.eql("Removed charger access from user");

        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done();
      });
  });

  it("401 - Insufficient permissions - for user over -/chargers/{uidcharger}/users/{uiduser}", (done) => {
    request
      .delete("/chargers/" + charger.uid + "/users/" + uidUser)
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
});
