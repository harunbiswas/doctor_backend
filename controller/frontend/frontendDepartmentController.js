const con = require("../../database/dbConnection");

// get deparment
function getDepartmentFrontend(req, res, next) {
  if (req.headers.clinicid) {
    con.query(
      `SELECT * FROM departments WHERE clinicId = ${req.headers.clinicid}`,
      (err, rows) => {
        if (err) {
          console.log(err);
          res.status(500).json("Internal server errors!");
        } else {
          res.status(200).json(rows);
        }
      }
    );
  } else {
    res.status(400).json("Clinic id is required!");
  }
}

// export module
module.exports = { getDepartmentFrontend };
