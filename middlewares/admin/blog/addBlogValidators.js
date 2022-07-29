const { check, validationResult } = require("express-validator");
const path = require("path");
const { unlink } = require("fs");

const addBlogValidators = [
  check("title")
    .isLength({ min: 10 })
    .withMessage("Title should be minimum 10 caractors")
    .trim(),
  check("description")
    .isLength({ min: 100 })
    .withMessage("Description should be minimum 100 caractors")
    .trim(),
];

const addBlogValidatorsResust = (req, res, next) => {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    next();
  } else {
    if (req.files.length > 0) {
      const { filename } = req.files[0];
      unlink(
        path.join(__dirname, `../../../public/images/blog/${filename}`),
        (err) => {
          if (err) console.log(err);
        }
      );
    }
    res.status(500).json({
      errors: mappedErrors,
    });
  }
};

module.exports = { addBlogValidators, addBlogValidatorsResust };
