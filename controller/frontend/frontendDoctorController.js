const con = require("../../database/dbConnection");

function getfrontendDoctors(req, res, next) {
  if (req.headers.departmentid && req.headers.clinicid) {
    con.query(
      `SELECT * FROM doctors WHERE departmentId = ${req.headers.departmentid} AND clinicId = ${req.headers.clinicid}`,
      (err, rows) => {
        if (err) {
          res.status(500).json("Internal server errors!");
        } else {
          res.status(200).json(rows);
        }
      }
    );
  } else {
    res.status(400).json("Clinic id & department id is required!");
  }
}

module.exports = { getfrontendDoctors };
