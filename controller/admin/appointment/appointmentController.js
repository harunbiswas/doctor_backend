const con = require("../../../database/dbConnection");

// get admin appointment
function getAdminAppointments(req, res, next) {
  const sql = `SELECT *, appointments.id, doctors.image AS doctorImg FROM appointments LEFT JOIN departments ON departments.id = appointments.departmentId JOIN doctors ON doctors.id = appointments.doctorId JOIN users ON users.id = doctors.userId `;
  con.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).json("Internal server errors!");
    } else {
      res.status(200).json(rows);
    }
  });
}

// get clinic appointment
function getClinicAppointments(req, res, next) {
  con.query(
    `SELECT * FROM clinics WHERE userId = ${req.headers.clinicid}`,
    (err1, data) => {
      if (err1) {
        res.status(500).json("Internal server errors!");
      } else {
        if (data.length > 0) {
          const sql = `SELECT *, appointments.id, doctors.image AS doctorImg FROM appointments LEFT JOIN departments ON departments.id = appointments.departmentId JOIN doctors ON doctors.id = appointments.doctorId JOIN users ON users.id = doctors.userId WHERE appointments.clinicId = ${data[0].id}`;
          console.log(req.headers.clinicid);
          con.query(sql, (err, rows) => {
            if (err) {
              console.log(err);
              res.status(500).json("Internal server errors");
            } else {
              res.status(200).json(rows);
            }
          });
        } else {
          res.status(400).json("Clinic not found");
        }
      }
    }
  );
}

module.exports = { getAdminAppointments, getClinicAppointments };
