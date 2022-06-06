const path = require("path");
const { ulid } = require("ulid");

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
  user_update_to_admin: {
    role: "admin",
  },
  user_update_to_user: {
    role: "user",
  },
  user_update_email: {
    email: "mateo@mail.com",
  },
  user_update_password: {
    password: "12345678",
  },
  user_update_wrongemail: {
    email: "mateokk",
  },
  user_update_wrong_password: {
    password: "123456",
  },
  user_without_confirms: {
    email: "mateo@mail.com",
    password: "12345678",
    role: "user",
  },
  admin_wrong_password: {
    email: "admin@wallbox.com",
    password: "admin2234",
    role: "admin",
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
  charger_ok_PulsarPlus2: {
    uid: ulid(),
    serialNumber: "623456789",
    model: "Pulsar Plus",
  },
  charger_ok_PulsarPlus: {
    uid: ulid(),
    serialNumber: "323456789",
    model: "Commander",
  },
  charger_ok_Commander5: {
    uid: ulid(),
    serialNumber: "423456717",
    model: "Commander",
  },
  charger_ok_Commander4: {
    uid: ulid(),
    serialNumber: "323456715",
    model: "Commander",
  },
  charger_ok_Commander3: {
    uid: ulid(),
    serialNumber: "323456712",
    model: "Commander",
  },
  charger_ok_Commander: {
    uid: ulid(),
    serialNumber: "323456789",
    model: "Commander",
  },
  charger_ok_Commander2: {
    uid: ulid(),
    serialNumber: "423456789",
    model: "Commander",
  },
  charger_ok_quasar: {
    serialNumber: "223456789",
    model: "Quasar",
  },
  charger_wrongModel: {
    uid: ulid(),
    serialNumber: "123456789",
    model: "patata",
  },
  charger_ok_noSerialNumber: {
    uid: ulid(),
    model: "Pulsar Plus",
  },
};
