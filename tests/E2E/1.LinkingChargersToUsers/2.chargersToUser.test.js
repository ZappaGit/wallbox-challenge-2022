/* TEST: linkingChargersToUser */

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

describe("[2] xlinking 4 chargers to a user", () => {
  let tokenAdmin;
  let uidchargers = [];
  let uiduser;
  let tokenUser2;
  let uiduser2;

  before("admin signin", async () => {
    const respUser = await api.fetchSinToken(
      "signin",
      Users.find((user) => user.role === "user"),
      "POST"
    );
    //console.log(respUser);
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
        //console.log(res.body);
        done(); // <= Call done to signal callback end
      });
  });

  it("step2: check 4 chargers", (done) => {
    uidchargers.should.be.lengthOf(4);
    done(); // <= Call done to signal callback end
  });

  it("step3: - Allowed user to access charger ", (done) => {
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

  it("Step4, check chargers state", (done) => {
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

        done();
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        res.body.chargers.map((charger) => charger.users).should.be.lengthOf(4);
      });
  });

  it("Step5, create user2 ", (done) => {
    request
      .post("/users/")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .send(config.user_ok_1)
      .set("authorization", tokenAdmin)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        //console.log(res.body);
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done();
      });
  });

  it("Step6, user2  signin", (done) => {
    request
      .post("/signin/")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .send(config.user_ok_1)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        //console.log(res.body);
        tokenUser2 = `token ${res.body.jwt}`;
        uiduser2 = res.body.uid;
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done(); // <= Call done to signal callback end
      });
  });

  it("Step7, user2 check charger state and get Cannot access that resource", (done) => {
    request
      .get("/chargers/" + uidchargers[1])
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenUser2)
      .end(function (err, res) {
        expect(res).to.have.status(403);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        //console.log(res.body);
        res.body.message.should.to.be.eql("Cannot access that resource");
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done(); // <= Call done to signal callback end
      });
  });

  after("return state", async () => {
    const dataAdmin = { data: {}, token: tokenAdmin };
    await api.fetchToken(`users/${uiduser2}`, dataAdmin, "DELETE");
    uidchargers.forEach(async (uid) => {
      await api.fetchToken("chargers/" + uid, dataAdmin, "DELETE");
    });
  });
});
