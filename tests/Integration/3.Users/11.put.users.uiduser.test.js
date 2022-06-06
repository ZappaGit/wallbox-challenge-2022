/* TEST: put.users.uuiduser.test.js */

const chai = require("chai");
const chaiHttp = require("chai-http");
const should = require("chai").should(); //actually call the function
const expect = require("chai").expect;

const config = require("../../config");
const api = require("../../api");

const { Users } = require("../../../db");

chai.use(chaiHttp);

const request = chai.request(config.baseUrl);

describe("[11] PUT -/users/uiduser operation requests", () => {
  let tokenAdmin, tokenUser;
  let uidAdmin, uidUser;

  before(async () => {
    const respUser = await api.fetchSinToken(
      "signin",
      Users.find((user) => user.role === "user"),
      "POST"
    );
    //console.log(respUser);
    tokenUser = `token ${respUser.jwt}`;
    uidUser = respUser.uid;
    const respAdmin = await api.fetchSinToken(
      "signin",
      Users.find((user) => user.role === "admin"),
      "POST"
    );
    tokenAdmin = `token ${respAdmin.jwt}`;
    uidAdmin = respAdmin.uid;
    //console.log(tokenAdmin, uidAdmin, tokenUser, uidUser);
  });

  //   it(`401 - bad request /users/{{uidAdmin}}`, (done) => {
  //     request
  //       .put("/users/" + uidAdmin)
  //       .set("accept", "application/json")
  //       .set("Content-Type", "application/json")
  //       .send()
  //       .end(function (err, res) {
  //         expect(res).to.have.status(401);
  //         expect(res).to.have.header(
  //           "content-type",
  //           "application/json; charset=utf-8"
  //         );
  //         expect(res).to.have.header("Access-Control-Allow-Origin", "*");
  //         res.body.message.should.be.eql("Invalid token");
  //         done(); // <= Call done to signal callback end
  //       });
  //   });

  //   it("400 - Unexpected string admin over admin /users/{{uidAdmin}}", (done) => {
  //     request
  //       .put("/users/" + uidAdmin)
  //       .set("accept", "application/json")
  //       .set("Content-Type", "application/json")
  //       .set("Content-Type", "application/json")
  //       .set("authorization", tokenAdmin)
  //       .send("something", "error")
  //       .end(function (err, res) {
  //         expect(res).to.have.status(400);
  //         expect(res).to.have.header(
  //           "content-type",
  //           "application/json; charset=utf-8"
  //         );
  //         expect(res).to.have.header("Access-Control-Allow-Origin", "*");
  //         done(); // <= Call done to signal callback end
  //       });
  //   });

  it("200 - update user mail  -for admin over user /users/{{uidUser}}", (done) => {
    request
      .put("/users/" + uidUser)
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .send(config.user_update_email)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        res.body.message.should.be.eql("User updated");
        res.body.user.email.should.be.eql(config.user_update_email.email);
        //console.log(res.body);
        done(); // <= Call done to signal callback end
      });
  });

  it("200 - update user password -  -for admin over user /users/{{uidUser}}", (done) => {
    request
      .put("/users/" + uidUser)
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .send(config.user_update_password)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        res.body.message.should.be.eql("User updated");
        //console.log(res.body);
        done(); // <= Call done to signal callback end
      });
  });

  it("200 - update user role to admin-  -for admin over user /users/{{uidUser}}", (done) => {
    request
      .put("/users/" + uidUser)
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .send(config.user_update_to_admin)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        res.body.message.should.be.eql("User updated");
        //console.log(res.body);
        done(); // <= Call done to signal callback end
      });
  });

  it("200 - update user role to user-  -for admin over user /users/{{uidUser}}", (done) => {
    request
      .put("/users/" + uidUser)
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .send(config.user_update_to_user)
      .end(function (err, res) {
        expect(res).to.have.status(200);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        res.body.message.should.be.eql("User updated");
        //console.log(res.body);
        done(); // <= Call done to signal callback end
      });
  });

  it("409 - update user mail - Email already in use (same mail) -for admin over user /users/{{uidUser}}", (done) => {
    request
      .put("/users/" + uidUser)
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .send(config.user_update_password)
      .end(function (err, res) {
        expect(res).to.have.status(409);
        expect(res).to.have.header(
          "content-type",
          "application/json; charset=utf-8"
        );
        expect(res).to.have.header("Access-Control-Allow-Origin", "*");
        res.body.message.should.be.eql("Email already in use");
        done(); // <= Call done to signal callback end
      });
  });

  it("401 - update user mail - Wrong email or password (same mail) -for admin over user /users/{{uidUser}}", (done) => {
    request
      .put("/users/" + uidUser)
      .set("accept", "application/json")
      .set("Content-Type", "application/json")
      .set("Content-Type", "application/json")
      .set("authorization", tokenAdmin)
      .send(config.user_update_email)
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

  //   it("200 - OK - message User Updated - for admin over admin  /users/{{uidAdmin}}", (done) => {
  //     request
  //       .put("/users/" + uidAdmin)
  //       .set("accept", "application/json")
  //       .set("Content-Type", "application/json")
  //       .set("Content-Type", "application/json")
  //       .set("authorization", tokenAdmin)
  //       .send(config.user_update_to_admin)
  //       .end(function (err, res) {
  //         expect(res).to.have.status(200);
  //         expect(res).to.have.header(
  //           "content-type",
  //           "application/json; charset=utf-8"
  //         );
  //         ////console.log(res);
  //         res.body.message.should.be.eql("Cannot access that resource");
  //         expect(res).to.have.header("Access-Control-Allow-Origin", "*");
  //         done(); // <= Call done to signal callback end
  //       });
  //   });

  //   it("200 - OK - message User Updated - for admin over admin  /users/{{uidAdmin}}", (done) => {
  //     request
  //       .put("/users/" + uidAdmin)
  //       .set("accept", "application/json")
  //       .set("Content-Type", "application/json")
  //       .set("Content-Type", "application/json")
  //       .set("authorization", tokenAdmin)
  //       .send(config.user_update_to_user)
  //       .end(function (err, res) {
  //         expect(res).to.have.status(200);
  //         expect(res).to.have.header(
  //           "content-type",
  //           "application/json; charset=utf-8"
  //         );
  //         //console.log(res);
  //         res.body.message.should.be.eql("Cannot access that resource");
  //         expect(res).to.have.header("Access-Control-Allow-Origin", "*");
  //         done(); // <= Call done to signal callback end
  //       });
  //   });

  //   it("200 - OK for user over user  /users/{{uidUser}}", (done) => {
  //     request
  //       .put("/users/" + uidUser)
  //       .set("accept", "application/json")
  //       .set("Content-Type", "application/json")
  //       .set("Content-Type", "application/json")
  //       .set("authorization", tokenUser)
  //       .end(function (err, res) {
  //         expect(res).to.have.status(200);
  //         expect(res).to.have.header(
  //           "content-type",
  //           "application/json; charset=utf-8"
  //         );
  //         expect(res).to.have.header("Access-Control-Allow-Origin", "*");
  //         done(); // <= Call done to signal callback end
  //       });
  //   });

  //   it("403 - Cannot access that resource - for user over admin /users/{{uidUser}}", (done) => {
  //     request
  //       .put("/users/" + uidAdmin)
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
  after(() => {});
});
