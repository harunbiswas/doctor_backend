const { check, validationResult } = require("express-validator");
const createHttpError = require("http-errors");
const createError = require("http-errors");
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

  check("email").isEmail().withMessage("Invalid email address").trim(),
  check("password").isStrongPassword().withMessage("Password must be strong!"),
];

// add user validator handler
const addUserValidatorsHandler = function (req, res, next) {
  const errors = validationResult(req);

  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    const sql = `SELECT * FROM users WHERE email = ${JSON.stringify(
      req.body.email
    )}`;
    con.query(sql, (err, rows) => {
      if (err) {
        res.status(400).json("Internal server errors!");
      } else {
        if (rows.length > 0) {
          mappedErrors.email = {
            msg: "Email is alrady use!",
            value: req.body.email,
            param: "email",
            location: "body",
          };
          res.status(400);
          res.json(mappedErrors);
        } else {
          next();
        }
      }
    });
  } else {
    res.status(400);
    res.json(mappedErrors);
  }
};

module.exports = { addUserValidators, addUserValidatorsHandler };
