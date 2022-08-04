const con = require("../../database/dbConnection");

const appointmentCheckLogin = function (req, res, next) {
  if (req.body.patientId) {
    con.query(
      `SELECT * FROM users LEFT JOIN patients ON patients.userId = users.id WHERE users.id = ${req.body.patientId}`,
      (err, rows) => {
        if (err) {
          console.log(err);
          res.status(500).json("Internal server errors");
        } else {
          if (rows.length > 0 && rows[0].role === "patient") {
            const { firstName, lastName, email, phone, age, id } = rows[0];
            const body = {
              ...req.body,
              name: firstName + " " + lastName,
              email,
              phone,
              age,
              patientId: id,
            };
            req.body = body;
            next();
          } else {
            res.status(400).json("User not found");
          }
        }
      }
    );
  } else {
    next();
  }
};

module.exports = { appointmentCheckLogin };
