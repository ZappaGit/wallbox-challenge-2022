/* TEST: unlinkingChargersToUsers */

const chai = require("chai");
const chaiHttp = require("chai-http");
const should = require("chai").should(); //actually call the function
const expect = require("chai").expect;

const config = require("../../config");
const api = require("../../api");

const lowdb = require("lowdb");
const storage = require("lowdb/file-sync");

const { Users } = require("../../../db");

const db = lowdb(config.db, {
  storage: storage,
});

chai.use(chaiHttp);

const request = chai.request(config.baseUrl);

describe("[3] unlinking a 4 chargers to a user", () => {
  let tokenAdmin;
  let uidchargers = [];
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

    let chargers = [
      config.charger_ok_Commander,
      config.charger_ok_Commander2,
      config.charger_ok_Commander3,
      config.charger_ok_Commander4,
    ];
    chargers.forEach((charger) => {
      request
        .post("/chargers")
        .set("accept", "application/json")
        .set("Content-Type", "application/json")
        .set("authorization", tokenAdmin)
        .send(charger)
        .end(function (err, res) {
          expect(res).to.have.status(200);
          expect(res).to.have.header(
            "content-type",
            "application/json; charset=utf-8"
          );
          uidchargers.push(res.body.charger.uid);
        });
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

  it("step2: - Allowed user to access 4 chargers ", (done) => {
    uidchargers.forEach((uid) => {
      request
        .post("/chargers/" + uid + "/users/" + uiduser)
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
        });
    });

    done();
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
        //console.log(res.body);
        res.body.chargers.forEach((element) => {
          element.users.should.be.lengthOf(1);
        });
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done();
      });
  });

  it("step4: - unlink user to access each charger ", (done) => {
    uidchargers.forEach((uid) => {
      request
        .delete("/chargers/" + uid + "/users/" + uiduser)
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
          res.body.message.should.to.be.eql("Removed charger access from user");
          //console.log(res.body);
        });
    });

    done();
  });
  it("Step5, check chargers state - no users for each charger", (done) => {
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
        //console.log(res.body);
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        res.body.chargers.forEach((element) => {
          element.users.should.be.lengthOf(0);
        });
        done();
      });
  });

  after("return state", async () => {
    const dataAdmin = { data: {}, token: tokenAdmin };
    uidchargers.forEach(async (uid) => {
      await api.fetchToken("chargers/" + uid, dataAdmin, "DELETE");
    });
  });
});
