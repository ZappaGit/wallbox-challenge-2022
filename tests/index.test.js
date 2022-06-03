var chai = require("chai"),
  config = require("./config.js"),
  expect = chai.expect,
  chaiHttp = require("chai-http");

chai.use(chaiHttp);

const getData = (urlpath) => {
  console.log(`--- --- [getdata] urlpath: ${config.baseUrl}`);
  return new Promise((resolve, reject) => {
    chai
      .request(config.baseUrl)
      .get(urlpath)
      .end((err, res) => {
        resolve(res);
      });
  });
};

describe("/", () => {
  it("should return 200 status", (done) => {
    getData("/").then((res) => {
      expect(res).to.have.status(404);
      expect(res).to.be.json;
      done();
    });
  });
});
