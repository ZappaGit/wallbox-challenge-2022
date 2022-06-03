const chai = require("chai");
const chaiHttp = require("chai-http");
const config = require("./config");

const expect = require("chai").expect;
chai.use(chaiHttp);

const request = chai.request(config.baseUrl);

describe("running", () => {
  before(() => {
    console.log(request);
  });

  it("running", (done) => {
    request
      .get("/")
      .then(function (err, res) {
        expect(res).to.have.status(200);
        done(); // <= Call done to signal callback end
      })
      .catch(function (err) {
        console.log(err);
        done(); // <= Call done to signal callback end
      });
  });

  after(() => {
    console.log(`--- --- [webdb.populate.test.js] END`);
  });
});
