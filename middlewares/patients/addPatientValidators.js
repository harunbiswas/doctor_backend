const { check, validationResult } = require("express-validator");
const con = require("../../database/dbConnection");
const { unlink } = require("fs");
const path = require("path");

const addpatientValidators = [
  check("firstName")
    .isLength({ min: 1 })
    .withMessage("First Name is require!")
    .trim(),
  check("lastName")
    .isLength({ min: 1 })
    .withMessage("Last Name is require!")
    .trim(),
  check("email")
    .isLength({ min: 1 })
    .withMessage("Email is require!")
    .isEmail()
    .withMessage("Email is not valid")
    .trim(),
  check("phone")
    .isLength({ min: 1 })
    .withMessage("Phone is require!")
    .isMobilePhone()
    .withMessage("Phone is not valid")
    .trim(),
  check("gender").isLength({ min: 1 }).withMessage("Gender is require!").trim(),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password should be morethan 6")
    .trim(),
  check("heigth").isLength({ min: 1 }).withMessage("Height is require!").trim(),
  check("weigth").isLength({ min: 1 }).withMessage("weight is require!").trim(),
  check("bloadGroup")
    .isLength({ min: 1 })
    .withMessage("BladGroup is require!")
    .trim(),
  check("address")
    .isLength({ min: 1 })
    .withMessage("Address is require!")
    .trim(),
];

const addpatientValidatorsResults = async function (req, res, next) {
  const errors = validationResult(req);
  const mappedErrors = errors.mapped();

  if (Object.keys(mappedErrors).length > 0) {
    if (req.files && req.files.length > 0) {
      const { path } = req.files[0];

      unlink(path, (err) => {
        if (err) {
          console.log(err);
          res.status(500).json("Internal Server Errors");
        } else {
          res.status(400).json(mappedErrors);
        }
      });
    } else {
      res.status(400).json(mappedErrors);
    }
  } else {
    const sql = `SELECT * FROM users WHERE email = ${JSON.stringify(
      req.body.email
    )}`;

    con.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
        res.status(500).json("Internal server errors");
      } else {
        if (rows && rows.length > 0) {
          mappedErrors.email = {
            msg: "Email is alrady use!",
            value: req.body.email,
            param: "email",
            location: "body",
          };
          if (req.files && req.files.length > 0) {
            const { path } = req.files[0];
            unlink(path, (err) => {
              if (err) {
                console.log(err);
                res.status(500).json("Internal server error");
              } else {
                res.status(500).json(mappedErrors);
              }
            });
          } else {
            res.status(400).json({
              errors: {
                file: {
                  msg: "Profile image is requires",
                },
              },
            });
          }
        } else {
          next();
        }
      }
    });
  }
};

module.exports = { addpatientValidators, addpatientValidatorsResults };
