const { check, validationResult } = require("express-validator");

const clinicSearcValidation = [
  check("name").isLength({ min: 1 }).withMessage("Name is required").trim(),
  check("latitude")
    .isLength({ min: 1 })
    .withMessage("Location is required! ")
    .trim(),
  check("longitude")
    .isLength({ min: 1 })
    .withMessage("Location is required! ")
    .trim(),
];

function clinicSearchValidationResult(req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    res.status(400).json(mappedErrors);
  }
}

const doctorSearcValidation = [
  check("department")
    .isLength({ min: 1 })
    .withMessage("Department is required")
    .trim(),
  check("latitude")
    .isLength({ min: 1 })
    .withMessage("Location is required! ")
    .trim(),
  check("longitude")
    .isLength({ min: 1 })
    .withMessage("Location is required! ")
    .trim(),
];

function doctorSearchValidationResult(req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    res.status(400).json(mappedErrors);
  }
}
module.exports = {
  clinicSearcValidation,
  clinicSearchValidationResult,
  doctorSearchValidationResult,
  doctorSearcValidation,
};
