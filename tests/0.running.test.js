const chai = require("chai");
const chaiHttp = require("chai-http");
const config = require("./config");

const expect = require("chai").expect;
chai.use(chaiHttp);

const request = chai.request(config.baseUrl);

describe(`[0] running at: ${config.baseUrl}`, () => {
  it("running", (done) => {
    request.get("/").end(function (err, res) {
      expect(res).to.have.status(200);
      expect(res).to.have.header(
        "content-type",
        "application/json; charset=utf-8"
      );
      expect(res).to.be.json;
      done(); // <= Call done to signal callback end
    });
  });
});
