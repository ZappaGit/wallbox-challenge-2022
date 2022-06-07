/* TEST: chargerToUsers.test.js */

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

describe("[1] linking one charger to 4 users", () => {
  let tokenAdmin;
  let uidusers = [];
  let uidcharger;

  before("admin signin", async () => {
    const respAdmin = await api.fetchSinToken(
      "signin",
      Users.find((user) => user.role === "admin"),
      "POST"
    );
    tokenAdmin = `token ${respAdmin.jwt}`;
    db("users").remove();
    db("chargers").remove();

    let users = [
      config.user_ok_1,
      config.user_ok_2,
      config.user_ok_3,
      config.user_ok_4,
    ];
    users.forEach((user) => {
      request
        .post("/users")
        .set("accept", "application/json")
        .set("Content-Type", "application/json")
        .set("authorization", tokenAdmin)
        .send(user)
        .end(function (err, res) {
          res.should.have.status(200);
          expect(res).to.have.header(
            "content-type",
            "application/json; charset=utf-8"
          );
          uidusers.push(res.body.user.uid);
          expect(res).to.have.header("Access-Control-Allow-Origin", "*");
          res.body.message.should.be.eql("User registered");
        });
    });
    // users = await db("users").value();
    // users.forEach((user) => {
    //   console.log(user.uid);
    // });
  });

  it("step1: create a charger", (done) => {
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
        uidcharger = res.body.charger.uid;
        db("chargers").push(res.body.charger);
        res.body.message.should.be.eql("Charger registered");

        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done();
      });
  });

  it("step2: check 4 users", (done) => {
    uidusers.should.be.lengthOf(4);
    done(); // <= Call done to signal callback end
  });

  it("step3: - Allowed user to access charger ", (done) => {
    uidusers.forEach((uid) => {
      request
        .post("/chargers/" + uidcharger + "/users/" + uid)
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
        });
    });

    done();
  });

  it("Step4, check charger state", (done) => {
    request
      .get("/chargers/" + uidcharger)
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        //console.log(res.body);
        res.body.users.should.be.lengthOf(4);
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        done(); // <= Call done to signal callback end
      });
  });

  after("return state", async () => {
    db("users").remove();
    db("chargers").remove();
    const dataAdmin = { data: {}, token: tokenAdmin };
    const deleteResult = await api.fetchToken(
      `chargers/${uidcharger}`,
      dataAdmin,
      "DELETE"
    );

    uidusers.forEach(async (uid) => {
      const deleteUser = await api.fetchToken(
        `users/${uid}`,
        dataAdmin,
        "DELETE"
      );
    });
  });
});
