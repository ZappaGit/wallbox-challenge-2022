/* TEST: put.chargers.uidcharger.test.js */

const chai = require("chai");
const chaiHttp = require("chai-http");
const should = require("chai").should(); //actually call the function
const expect = require("chai").expect;

const config = require("../../config");
const api = require("../../api");

const { Users } = require("../../../db");

chai.use(chaiHttp);

const request = chai.request(config.baseUrl);

describe("[4] PUT -/chargers/uidchager operation requests", () => {
  //require("./3.post.chargers.test");
  let tokenAdmin, tokenUser;
  let charger;

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
    console.log(respAdmin);
    tokenAdmin = `token ${respAdmin.jwt}`;

    const dataAdmin = { data: config.charger_ok_Commander3, token: tokenAdmin };

    const respPulsarPlus = await api.fetchToken("chargers", dataAdmin, "POST");
    // console.log(tokenAdmin);
    // console.log(respPulsarPlus);
    charger = respPulsarPlus.charger;
  });

  it(`401 - Invalid token /chargers/{{uidAdmin}}`, (done) => {
    request
      .put("/chargers/" + charger.uid)
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

  it("400 - Unexpected string admin over admin /chargers/{{uidAdmin}}", (done) => {
    request
      .put("/chargers/" + charger.uid)
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

  it("200 - update /chargers/{uidcharger}  -for admin over charger ", (done) => {
    request
      .put("/chargers/" + charger.uid)
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .send(config.charger_ok_quasar)
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

  it("409 - Serial number already in use update /chargers/{uidcharger}  -for admin over charger ", (done) => {
    request
      .put("/chargers/" + charger.uid)
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .send(config.charger_ok_quasar)
      .end(function (err, res) {
        expect(res).to.have.status(409);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");

        done(); // <= Call done to signal callback end
      });
  });

  it("401 - Insufficient permissions, for user over chargers ", (done) => {
    request
      .put("/chargers/" + charger.uid)
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenUser)
      .send(config.charger_ok_PulsarPlus)
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
  after(async () => {
    const dataAdmin = { data: {}, token: tokenAdmin };

    const deleteResult = await api.fetchToken(
      `chargers/${charger.uid}`,
      dataAdmin,
      "DELETE"
    );
    // console.log(tokenAdmin);
  });
  //   it("403 - Cannot access that resource - for user over admin /chargers/{{uidUser}}", (done) => {
  //     request
  //       .put("/chargers/" + uidAdmin)
  //       .set("accept", "application/json")
  //       .set("Content-Type", "application/json")
  //       .set("Content-Type", "application/json")
  //       .set("authorization", tokenUser)
  //       .end(function (err, res) {
  //         res.should.have.status(403);
  //         expect(res).to.have.header(
  //           "content-type",
  //           "application/json; charset=utf-8"
  //         );
  //         res.body.message.should.be.eql("Cannot access that resource");
  //         expect(res).to.have.header("Access-Control-Allow-Origin", "*");
  //         done(); // <= Call done to signal callback end
  //       });
  //   });
});
