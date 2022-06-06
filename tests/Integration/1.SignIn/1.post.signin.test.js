/* TEST: post.signin.test.js */

const chai = require("chai");
const chaiHttp = require("chai-http");
const should = require("chai").should(); //actually call the function
const expect = require("chai").expect;

const config = require("../../config");
const api = require("../../api");

const { Users } = require("../../../db");
const miUser = Users.find((user) => user.role === "user");
const miAdmin = Users.find((user) => user.role === "user");

chai.use(chaiHttp);

const request = chai.request(config.baseUrl);
describe("[1] POST - /signin operation", () => {
  it("400 - bad request", (done) => {
    request
      .post("/signin")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .send({
        email: "any",
        password: "any",
      })
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

  it("401 -  Wrong email or password (wrong email)", (done) => {
    request
      .post("/signin")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .send(config.user_without_confirms)
      .end(function (err, res) {
        expect(res).to.have.status(401);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        res.body.message.should.be.eql("Wrong email or password");
        done(); // <= Call done to signal callback end
      });
  });

  it("401 -  Wrong email or password (wrong password)", (done) => {
    request
      .post("/signin")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .send(config.admin_wrong_password)
      .end(function (err, res) {
        expect(res).to.have.status(401);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        res.body.message.should.be.eql("Wrong email or password");
        done(); // <= Call done to signal callback end
      });
  });

  it(`200 - OK - for User: ${miUser.email}`, (done) => {
    request
      .post("/signin")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .send(miUser)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        res.body.email.should.be.eql(miUser.email);
        res.body.uid.should.be.a("string");
        res.body.jwt.should.be.a("string");

        done(); // <= Call done to signal callback end
      });
  });

  it(`200 - OK - for Admin: ${miAdmin.email}`, (done) => {
    request
      .post("/signin")
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .send(miAdmin)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        res.body.email.should.be.eql(miAdmin.email);
        res.body.uid.should.be.a("string");
        res.body.jwt.should.be.a("string");

        done(); // <= Call done to signal callback end
      });
  });
});
