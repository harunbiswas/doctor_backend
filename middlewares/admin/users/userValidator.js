const { check } = require("express-validator");
const createError = require("http-errors");
const mysql = require("mysql");
const con = require("../../../database/dbConnection");

// add user
const addUserValidators = [
  check("firstName")
    .isLength({ min: 1, max: 40 })
    .withMessage("First name is reuiired")
    .isAlpha("en-US", { ignore: " -." })
    .withMessage("Name must me alphabet")
    .trim(),
  check("lastName")
    .isLength({ min: 1, max: 20 })
    .withMessage("First name is reuiired")
    .isAlpha("en-US", { ignore: " -." })
    .withMessage("Name must me alphabet")
    .trim(),

  check("email")
    .isEmail()
    .withMessage("Invalid email address")
    .trim()
    .custom(async (value) => {
      try {
        const user = con.query(`SELECT email FROM admins`, (err, rows) => {
          if (err) {
            console.log("errors");
          } else {
            if (user) {
              console.log(user);
              throw createError("Email alreadt is use!");
            }
          }
        });
      } catch (err) {
        throw createError(err.message);
      }
    }),
];

module.exports = { addUserValidators };
