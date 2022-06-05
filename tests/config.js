const path = require("path");

module.exports = {
  baseUrl: "http://localhost:3000",
  db: path.join(__dirname, "./db/db.json"),
  user_ok_1: {
    emailConfirmation: "mateo@mail.com",
    email: "mateo@mail.com",
    password: "12345678",
    passwordConfirmation: "12345678",
    role: "user",
  },
  user_ok_2: {
    emailConfirmation: "mateo@mail.com",
    email: "mateo@mail.com",
    password: "12345678",
    passwordConfirmation: "12345678",
    role: "user",
  },
  user_without_confirms: {
    email: "mateo@mail.com",
    password: "12345678",
    role: "user",
  },
  user_without_requiredData: {
    email: "mateo@mail.com",
  },
  user_without_passwordOK: {
    emailConfirmation: "mateo@mail.com",
    email: "mateo@mail.com",
    password: "123456",
    passwordConfirmation: "123456",
    role: "user",
  },
};
