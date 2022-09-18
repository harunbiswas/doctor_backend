const { check, validationResult } = require("express-validator");
const con = require("../../database/dbConnection");

const addExperienceValidator = [
  check("fromDate")
    .isLength({ min: 1, max: 4 })
    .withMessage("From is required and less than 4 characters")
    .isISO8601("yyyy")
    .withMessage("Only year support"),

  check("toDate")
    .isLength({ min: 1, max: 4 })
    .withMessage("To is required and less than 4 characters")
    .isISO8601("yyyy")
    .withMessage("Only year support"),
  check("role").isLength({ min: 1 }).withMessage("Role is required "),
  check("institute").isLength({ min: 1 }).withMessage("Role is required "),
];

const addExperienceValidatorResults = async function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    con.query(
      `SELECT * FROM doctors WHERE userId = ${req.params.id}`,
      (err, rows) => {
        if (err) {
          console.log(err);
          res.status(500).json("Internal server errors!");
        } else {
          if (rows.length > 0) {
            req.body.id = rows[0].id;
            next();
          } else {
            res.status(400).json("Doctor not found!");
          }
        }
      }
    );
  } else {
    res.status(400).json(mappedErrors);
  }
};

module.exports = {
  addExperienceValidator,
  addExperienceValidatorResults,
};
