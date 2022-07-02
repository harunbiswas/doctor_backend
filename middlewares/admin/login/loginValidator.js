const { check, validationResult } = require("express-validator");

// login validator
const doLoginValidators = [
  check("email")
    .isLength({ min: 1 })
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Invalid Email address")
    .trim(),
  check("password")
    .isLength({ min: 1 })
    .withMessage("Password is required!")
    .trim(),
];

// login validator result

const doLoginValidatorsResust = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    res.status(400).json(mappedErrors);
  }
};

module.exports = { doLoginValidators, doLoginValidatorsResust };
