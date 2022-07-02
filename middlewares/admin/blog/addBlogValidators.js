const { check, validationResult } = require("express-validator");

const addBlogValidators = [
  check("title")
    .isLength({ min: 10 })
    .withMessage("Title should be minimum 10 caractors")
    .trim(),
  check("description")
    .isLength({ min: 100 })
    .withMessage("Description should be minimum 100 caractors")
    .trim(),
  check("tags").isLength({ min: 1 }).withMessage("Tags is required"),
];

const addBlogValidatorsResust = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    res.status(400).json(mappedErrors);
  }
};

module.exports = { addBlogValidators, addBlogValidatorsResust };
