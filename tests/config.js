const path = require("path");

module.exports = {
  baseUrl: "http://localhost:3000",
  db: path.join(__dirname, "./db/db.json"),
};
