/* TEST: UpdateChargerAfterLink */

const chai = require("chai");
const chaiHttp = require("chai-http");
const should = require("chai").should(); //actually call the function
const expect = require("chai").expect;

const config = require("../../config");
const api = require("../../api");

const lowdb = require("lowdb");
const storage = require("lowdb/file-sync");

const { Users } = require("../../../db");
const createStatsCollector = require("mocha/lib/stats-collector");

const db = lowdb(config.db, {
  storage: storage,
});

chai.use(chaiHttp);

const request = chai.request(config.baseUrl);

describe("[5] update charger after link, must be updated ", () => {
  let tokenAdmin;
  let chargers;
  let uiduser;

  before("admin signin and some config", async () => {
    const respUser = await api.fetchSinToken(
      "signin",
      Users.find((user) => user.role === "user"),
      "POST"
    );
    uiduser = respUser.uid;
    const respAdmin = await api.fetchSinToken(
      "signin",
      Users.find((user) => user.role === "admin"),
      "POST"
    );
    tokenAdmin = `token ${respAdmin.jwt}`;

    chargers = config.charger_ok_Commander;
    request
      .post("/chargers")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .send(chargers)
      .end(function (err, res) {
        chargers = res.body.charger;
        expect(res).to.have.status(200);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
      });
  });

  it("step1: check a user", (done) => {
    request
      .get("/users/" + uiduser)
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .send()
      .end(function (err, res) {
        res.should.have.status(200);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done(); // <= Call done to signal callback end
      });
  });

  it("step2: - Allowed user to access a charger ", (done) => {
    //console.log("/chargers/" + chargers.uid + "/users/" + uiduser);
    request
      .post("/chargers/" + chargers.uid + "/users/" + uiduser)
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
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        //console.log(res.body);
        done();
      });
  });

  it("Step3, check chargers state - every charger has a user", (done) => {
    request
      .get("/chargers/")
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
        //res.body.model.should.be.eql(config.charger_ok_Commander.model);
        //console.log(res.body);
        //res.body.users.should.be.lengthOf(1);
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done();
      });
  });

  it("step4: - update  charger  ", (done) => {
    request
      .put("/chargers/" + chargers.uid)
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .send(config.charger_ok_PulsarPlus)
      .end(function (err, res) {
        expect(res).to.have.status(200);

        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        res.body.message.should.to.be.eql("Charger updated");
        //console.log(res.body);
        done();
      });
  });

  it("Step5, check chargers state - the charger must be updated", (done) => {
    request
      .get("/chargers/" + chargers.uid)
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
        //console.log(res.body);
        res.body.model.should.be.eql(config.charger_ok_PulsarPlus.model);
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done();
      });
  });

  after("return state", async () => {
    const dataAdmin = { data: {}, token: tokenAdmin };

    await api.fetchToken("chargers/" + chargers.uid, dataAdmin, "DELETE");
  });
});
