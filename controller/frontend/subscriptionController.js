const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const con = require("../../database/dbConnection");
const { body } = require("express-validator");

dotenv.config();

const isLeapyear = (year) => {
  return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
};

async function createSubscription(req, res, next) {
  if (req.user && req.user.role === "clinic") {
    if (req.body) {
      const date = new Date();
      const time =
        req.body.time === "month"
          ? new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
          : (isLeapyear(date.getFullYear()) && 366) || 365;

      const token = jwt.sign(req.body, process.env.JWT_SECTET, {
        expiresIn: 86400 * time,
      });

      const decode = jwt.verify(token, process.env.JWT_SECTET);
      let expireDate = new Date(decode.exp * 1000);

      expireDate =
        expireDate.getFullYear() +
        ":" +
        (expireDate.getMonth() + 1) +
        ":" +
        expireDate.getDate();

      con.query(
        `SELECT * FROM clinics WHERE userId = ${req.user.id}`,
        (err, rows) => {
          if (err) {
            res.status(500).json("Internal server errors");
          } else {
            if (rows.length > 0) {
              con.query(
                `SELECT * FROM subscriptions WHERE clinicId = ${rows[0].id}`,
                (err, rows1) => {
                  if (err || rows1.length === 0) {
                    const sql = `INSERT INTO subscriptions(clinicId, token, expireDate, paymentType) VALUES(${
                      rows[0].id
                    }, ${JSON.stringify(token)}, ${JSON.stringify(
                      expireDate
                    )}, "card")`;
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
  if (req.user && req.user.role === "clinic") {
    if (req.body) {
      con.query(
        `SELECT * FROM clinics WHERE userId = ${req.user.id}`,
        (err, rows) => {
          if (err) {
            console.log(err);
            res.status(500).json("Internal server errors");
          } else {
            if (rows.length > 0) {
              con.query(
                `SELECT * FROM subscriptions WHERE clinicId = ${rows[0].id}`,
                (err, rows1) => {
                  if ((err, rows1.length > 0)) {
                    const date = new Date();

                    const decode = jwt.verify(
                      rows1[0].token,
                      process.env.JWT_SECTET
                    );
                    const currentTime = date.getTime() / 1000;
                    const expireTime = rows1[0].expireDate.getTime() / 1000;
                    const bTime = expireTime - currentTime;

                    let time =
                      req.body.time === "month"
                        ? new Date(
                            rows1[0].expireDate.getFullYear(),
                            rows1[0].expireDate.getMonth() + 1,
                            0
                          ).getDate()
                        : (isLeapyear(rows1[0].expireDate.getFullYear()) &&
                            366) ||
                          365;

                    time = parseInt(86400 * time + (bTime > 0 ? bTime : 0));

                    const token = jwt.sign(req.body, process.env.JWT_SECTET, {
                      expiresIn: time,
                    });

                    const decodeEx = jwt.verify(token, process.env.JWT_SECTET);
                    let expireDate = new Date(decodeEx.exp * 1000);

                    expireDate =
                      expireDate.getFullYear() +
                      ":" +
                      (expireDate.getMonth() + 1) +
                      ":" +
                      expireDate.getDate();

                    const sql = `UPDATE subscriptions SET  token=${JSON.stringify(
                      token
                    )}, expireDate=${JSON.stringify(expireDate)} WHERE id=${
                      rows1[0].id
                    }`;
                    con.query(sql, (err) => {
                      if (err) {
                        console.log(err);
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

async function getSubscription(req, res, next) {
  if (req.user && req.user.role === "clinic") {
    con.query(
      `SELECT * FROM clinics WHERE userId = ${req.user.id}`,
      (err, rows) => {
        if (err && rows.length === 0) {
          res.status(500).json("Internal server errors!");
        } else {
          con.query(
            `SELECT * FROM subscriptions WHERE clinicId=${rows[0].id}`,
            (err1, rows1) => {
              if (err1) {
                res.status(500).json("Internal server errors");
              } else {
                res.status(200).json(rows1);
              }
            }
          );
        }
      }
    );
  } else {
    res.status(400).json("Authontication failured!");
  }
}
module.exports = {
  createSubscription,
  updateSubscription,
  getSubscription,
};
