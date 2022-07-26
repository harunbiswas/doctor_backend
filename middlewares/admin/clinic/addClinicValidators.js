const { check, validationResult } = require("express-validator");
const con = require("../../../database/dbConnection");
const { unlink } = require("fs");
const path = require("path");

const addClinicValidators = [
  check("name")
    .isLength({ min: 1, max: 100 })
    .withMessage("Name is Required!")
    .trim(),
  check("email")
    .isLength({ min: 1 })
    .withMessage("Email is required!")
    .isEmail()
    .withMessage("Email is not valid!")
    .trim(),
  check("phone")
    .isLength({ min: 1 })
    .withMessage("Phone is required!")
    .isMobilePhone()
    .withMessage("Phone is not valid")
    .trim(),
  check("password")
    .isStrongPassword()
    .withMessage("You should provide strong password")
    .trim(),
  check("address")
    .isLength({ min: 1 })
    .withMessage("address is required!")
    .trim(),
  check("latitude")
    .isLength({ min: 1 })
    .withMessage("Latitude is required")
    .trim(),
  check("longitude")
    .isLength({ min: 1 })
    .withMessage("Longitude is required")
    .trim(),
];

const addClinicValidationResult = function (req, res, next) {
  const errors = validationResult(req);

  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length === 0) {
    const sql = `SELECT * FROM users WHERE email = ${JSON.stringify(
      req.body.email
    )}`;

    con.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
      } else {
        if (rows && rows.length > 0) {
          mappedErrors.email = {
            msg: "Email is alrady use!",
            value: req.body.email,
            param: "email",
            location: "body",
          };
          if (req.files.length > 0) {
            const { filename } = req.files[0];
            unlink(
              path.join(__dirname, `../../../public/images/photo/${filename}`),
              (err) => {
                if (err) {
                  console.log(err);
                } else {
                  res.status(500).json(mappedErrors);
                }
              }
            );
          } else {
            res.status(400).json({
              image: {
                msg: "Clinic image is requires",
              },
            });
          }
        } else {
          next();
        }
      }
    });
  } else {
    if (req.files && req.files.length > 0) {
      const { path } = req.files[0];
      unlink(path, (err) => {
        if (err) {
          res.status(500).json("Internal Server Errors");
        } else {
          res.status(400).json(mappedErrors);
        }
      });
    } else {
      res.status(400).json(mappedErrors);
    }
  }
};

module.exports = {
  addClinicValidators,
  addClinicValidationResult,
};
