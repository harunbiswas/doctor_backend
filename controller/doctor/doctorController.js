const con = require("../../database/dbConnection");

// doctor information
function getDoctorInfo(req, res, next) {
  if (req.user && req.user.role === "doctor") {
    const sql = `SELECT *,"" AS password, doctors.id, doctors.image FROM users JOIN doctors ON doctors.userId = users.id JOIN departments ON departments.id = doctors.departmentId  WHERE users.id = ${req.user.id}`;
    con.query(sql, (err, row) => {
      if (err) {
        console.log(err);
        res.status(500).json("Internal server errors!");
      } else {
        res.status(200).json(row[0]);
      }
    });
  } else {
    res.status(400).json("Authentication failure!");
  }
}

// doctor appointments
function getDoctorAppointments(req, res, next) {
  if (req.user && req.user.role === "doctor") {
    con.query(
      `SELECT * FROM doctors WHERE userId = ${req.user.id}`,
      (err, rows) => {
        if (err) {
          res.status(500).json("Internal server errors!");
        } else {
          if (rows.length > 0) {
            const sql = `SELECT *, appointments.id FROM appointments LEFT JOIN departments ON departments.id = appointments.departmentId WHERE appointments.doctorId = ${rows[0].id} `;
            con.query(sql, (err1, rows1) => {
              if (err1) {
                res.status(500).json("Internal server errors!");
              } else {
                res.status(200).json(rows1);
              }
            });
          } else {
            res.status(404).json("Doctor not found!");
          }
        }
      }
    );
  } else {
    res.status(400).json("Authentication failured!");
  }
}

module.exports = { getDoctorInfo, getDoctorAppointments };
