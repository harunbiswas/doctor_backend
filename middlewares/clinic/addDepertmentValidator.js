const { check, validationResult } = require("express-validator");

const addDepertmentValidators = [
  check("title")
    .isLength({ min: 1 })
    .withMessage("Title is required!")
    .isLength({ max: 50 })
    .withMessage("Title should be lessthan 50 caractors")
    .trim(),
  check("description")
    .isLength({ min: 10, max: 100 })
    .withMessage("Description should be 10 to 100 caractors")
    .trim(),
];

const addDepertmentValidatorsResult = async function (req, res, next) {
  const errors = validationResult(req);

  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length > 0) {
    res.status(400).json(mappedErrors);
  } else {
    next();
  }
};

module.exports = {
  addDepertmentValidators,
  addDepertmentValidatorsResult,
};
