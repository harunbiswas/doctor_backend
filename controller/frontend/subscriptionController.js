const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const con = require("../../database/dbConnection");
const { body } = require("express-validator");

dotenv.config();

const isLeapyear = (year) => {
  return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
};

async function createSubscription(req, res, next) {
  if (req.user && req.user.role === "patient") {
    if (req.body) {
      const date = new Date();
      const time =
        req.body.time === "month"
          ? new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
          : (isLeapyear(date.getFullYear()) && 366) || 365;
      let expireDate =
        req.body.time === "month"
          ? new Date(date.getFullYear(), date.getMonth() + 1, date.getDate())
          : new Date(date.getFullYear() + 1, date.getMonth());
      const token = jwt.sign(req.body, process.env.JWT_SECTET, {
        expiresIn: 86400 * time,
      });

      const decode = jwt.verify(token, process.env.JWT_SECTET);
      const ex = new Date(decode.exp).getFullYear();
      console.log(ex, decode.exp);

      expireDate =
        expireDate.getFullYear() +
        ":" +
        expireDate.getMonth() +
        ":" +
        expireDate.getDate() +
        1;

      con.query(
        `SELECT * FROM patients WHERE userId = ${req.user.id}`,
        (err, rows) => {
          if (err) {
            console.log(err);
            res.status(500).json("Internal server errors");
          } else {
            if (rows.length > 0) {
              con.query(
                `SELECT * FROM subscriptions WHERE patientId = ${rows[0].id}`,
                (err, rows1) => {
                  if ((err, rows1.length === 0)) {
                    const sql = `INSERT INTO subscriptions(patientId, token, expireDate) VALUES(${
                      rows[0].id
                    }, ${JSON.stringify(token)}, ${JSON.stringify(
                      expireDate
                    )})`;
                    con.query(sql, (err) => {
                      if (err) {
                        res.status(500).json("Internal server errors!");
                      } else {
                        res.status(200).json({
                          data: {
                            token,
                            expireDate,
                          },
                        });
                      }
                    });
                  } else {
                    res.status(200).json("You have to already A package!");
                  }
                }
              );
            } else {
              res.status(400).json("Authentication failured");
            }
          }
        }
      );
    } else {
      res.status(400).json("Data missing!");
    }
  } else {
    res.status(400).json("Authontication failured!");
  }
}

async function updateSubscription(req, res, next) {
  if (req.user && req.user.role === "patient") {
    if (req.body) {
      con.query(
        `SELECT * FROM patients WHERE userId = ${req.user.id}`,
        (err, rows) => {
          if (err) {
            console.log(err);
            res.status(500).json("Internal server errors");
          } else {
            if (rows.length > 0) {
              con.query(
                `SELECT * FROM subscriptions WHERE patientId = ${rows[0].id}`,
                (err, rows1) => {
                  if ((err, rows1.length > 0)) {
                    const preExpireDate = rows1[0].expireDate;

                    const date = new Date();
                    let time;

                    const decode = jwt.verify(
                      rows1[0].token,
                      process.env.JWT_SECTET
                    );
                    const leftyear = rows1[0].expireDate.getFullYear();
                    const leftmonth = rows1[0].expireDate.getMonth();
                    const leftDate = rows1[0].expireDate.getDate();
                    const currentyear = date.getFullYear();
                    const currentmonth = date.getMonth();
                    const currentDate = date.getDate();

                    console.log(
                      leftyear,
                      leftmonth,
                      leftDate,
                      currentyear,
                      currentmonth,
                      currentDate,
                      rows1[0].expireDate
                    );
                    if (decode) {
                      time =
                        req.body.time === "month"
                          ? new Date(
                              date.getFullYear(),
                              date.getMonth() + 1,
                              0
                            ).getDate()
                          : (isLeapyear(date.getFullYear()) && 366) || 365;
                    } else {
                      time =
                        req.body.time === "month"
                          ? new Date(
                              date.getFullYear(),
                              date.getMonth() + 1,
                              0
                            ).getDate()
                          : (isLeapyear(date.getFullYear()) && 366) || 365;
                    }

                    // const sql = `INSERT INTO subscriptions(patientId, token, expireDate) VALUES(${
                    //   rows[0].id
                    // }, ${JSON.stringify(token)}, ${JSON.stringify(
                    //   expireDate
                    // )})`;
                    // con.query(sql, (err) => {
                    //   if (err) {
                    //     res.status(500).json("Internal server errors!");
                    //   } else {
                    //     res.status(200).json({
                    //       data: {
                    //         token,
                    //         expireDate,
                    //       },
                    //     });
                    //   }
                    // });
                  } else {
                    res.status(200).json("You haven't any package!");
                  }
                }
              );
            } else {
              res.status(400).json("Authentication failured");
            }
          }
        }
      );
    } else {
      res.status(400).json("Data missing!");
    }
  } else {
    res.status(400).json("Authontication failured!");
  }
}
module.exports = {
  createSubscription,
  updateSubscription,
};
