const bcrypt = require("bcrypt");
const con = require("../../database/dbConnection");
const jwt = require("jsonwebtoken");
const dotent = require("dotenv");

dotent.config();

// singup Controller
async function singupController(req, res, next) {
  const { firstName, lastName, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectSQL = `SELECT * FROM admins`;

  con.query(selectSQL, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      if (rows.length === 0) {
        const data = {
          firstName,
          lastName,
          email,
          hashedPassword,
          role: "admin",
        };
        insartFunc(con, data, res);
      } else {
        next();
      }
    }
  });
}

// add user controller
async function addUser(req, res, next) {
  const { firstName, lastName, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  if (req.user) {
    if (req.user.role === "admin") {
      const data = {
        firstName,
        lastName,
        email,
        hashedPassword,
        role: role ? role : "editor",
      };
      insartFunc(con, data, res);
    } else {
      res.status(400).json({
        errors: {
          common: {
            msg: "Authentication failure!",
          },
        },
      });
    }
  } else {
    res.status(400).json({
      errors: {
        common: {
          msg: "Authentication failure!",
        },
      },
    });
  }
}

// do login
async function login(req, res, next) {
  // process login
  const sql = `SELECT * FROM admins WHERE email =${JSON.stringify(
    req.body.email
  )}`;

  con.query(sql, async (err, rows) => {
    if (err) {
      res.status(500).json({
        errors: {
          common: {
            msg: "Unkhown Error occured!",
          },
        },
      });
    } else {
      if (rows.length > 0) {
        const {
          id,
          firstName,
          lastName,
          email,
          hash,
          role,
          createAt,
          updateAt,
        } = rows[0];
        const isValidPassword = await bcrypt.compare(req.body.password, hash);
        if (isValidPassword) {
          const userObject = {
            id,
            email,
            firstName,
            lastName,
            role,
            createAt,
            updateAt,
          };

          // jenarate token
          const token = jwt.sign(userObject, process.env.JWT_SECTET, {
            expiresIn: process.env.JWT_EXPIRY,
          });
          res.status(200).json({
            token,
            userObject,
            msg: "login successfull",
          });
        } else {
          res.status(401).json({
            errors: {
              common: {
                msg: "Login faild! Try again.",
              },
            },
          });
        }
      } else {
        res.status(401).json({
          errors: {
            common: {
              msg: "user not found!",
            },
          },
        });
      }
    }
  });
}

// inser user
const insartFunc = (con, data, res) => {
  const sql = `INSERT INTO admins (firstName, lastName, email, hash, role) VALUES (${JSON.stringify(
    data.firstName
  )}, ${JSON.stringify(data.lastName)}, ${JSON.stringify(
    data.email
  )},${JSON.stringify(data.hashedPassword)},${JSON.stringify(data.role)})`;
  con.query(sql, (err) => {
    if (err) {
      res.status(500);
      res.json({
        errors: {
          common: {
            msg: "Unkhown Error occured!",
          },
        },
      });
    } else {
      res.status(200);
      res.json("User create successfull!");
    }
  });
};

module.exports = { singupController, addUser, login };
