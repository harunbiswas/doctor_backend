const { check, validationResult } = require("express-validator");
const con = require("../../database/dbConnection");

const addTimeValidator = [
  check("day").isLength({ min: 1 }).withMessage("Day is required!").trim(),
  check("startTime")
    .isLength({ min: 1 })
    .withMessage("Start Time is required")
    .isISO8601()
    .withMessage("Invalid time")
    .trim(),
  check("endTime")
    .isLength({ min: 1 })
    .withMessage("End Time is required")
    .isISO8601()
    .withMessage("Invalid time")
    .trim(),
];

const addTimeValidatorResult = function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    con.query(`SELECT * FROM users WHERE id= ${req.params.id}`, (err) => {
      if ((err, rows)) {
        res.status(500).json("Internal server errors!");
      } else {
        if (rows.length > 0) {
          req.body.id = rows[0].doctorId;
          next();
        } else {
          res.status(400).json("Doctor not found!");
        }
      }
    });
  } else {
    res.status(400).json(mappedErrors);
  }
};

module.exports = {
  addTimeValidator,
  addTimeValidatorResult,
};
