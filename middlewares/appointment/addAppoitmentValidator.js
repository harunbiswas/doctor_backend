const { check, validationResult } = require("express-validator");

const addAppointmentValidator = [
  check("doctorId")
    .isLength({ min: 1 })
    .withMessage("Doctor is required!")
    .trim(),
  check("departmentId")
    .isLength({ min: 1 })
    .withMessage("Department is required")
    .trim(),
  check("name").isLength({ min: 1 }).withMessage("Name is required").trim(),
  check("email").isLength({ min: 1 }).withMessage("Email is required").trim(),
  check("time").isLength({ min: 1 }).withMessage("Time is required").trim(),
  check("date").isLength({ min: 1 }).withMessage("Date is required").trim(),
  check("phone")
    .isLength({ min: 1 })
    .withMessage("Phone is required")
    .isMobilePhone()
    .withMessage("Invalid phone number")
    .trim(),
  check("age").isLength({ min: 1 }).withMessage("Age is required").trim(),
];

const addAppointmentResult = function (req, res, next) {
  const errrors = validationResult(req);
  const mappedErrors = errrors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    res.status(400).json(mappedErrors);
  }
};

module.exports = { addAppointmentResult, addAppointmentValidator };
