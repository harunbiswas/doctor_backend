const { json } = require("express");
const con = require("../../database/dbConnection");
const { get } = require("../../router/appointmentRouter");

// inser appointment
const inserAppintment = (con, res, data) => {
  const sql = `INSERT INTO appointments(patientId, doctorId, departmentId, name, email, time, date, phone, comments, age, clinicId) VALUES(${JSON.stringify(
    data.patientId
  )}, ${JSON.stringify(data.doctorId)},${JSON.stringify(
    data.departmentId
  )},${JSON.stringify(data.name)},${JSON.stringify(
    data.email
  )},${JSON.stringify(data.time)},${JSON.stringify(data.date)},${JSON.stringify(
    data.phone
  )},${JSON.stringify(data.comments)}, ${JSON.stringify(
    data.age
  )}, ${JSON.stringify(data.clinicId)})`;

  con.query(sql, (err) => {
    if (err) {
      console.log(err);
      res.status(500).json("Internal Server Errors");
    } else {
      res.status(200).json("Appointment create successfull");
    }
  });
};

// add a appointment
const addAppointment = function (req, res, next) {
  const {
    clinicId,
    patientId,
    doctorId,
    departmentId,
    name,
    email,
    time,
    phone,
    comments,
    age,
    date,
  } = req.body;
  const data = {
    patientId: patientId || null,
    doctorId,
    departmentId,
    name,
    email,
    time,
    phone,
    date,
    comments: comments || null,
    age,
    clinicId,
  };
  con.query(
    `SELECT * FROM clinics WHERE id = ${JSON.stringify(clinicId)}`,
    (err2, rows2) => {
      if (err2) {
        res.status(500).json("Internal server errors");
      } else {
        if (rows2.length > 0) {
          con.query(
            `SELECT * FROM departments WHERE id = ${JSON.stringify(
              departmentId
            )}`,
            (err, rows) => {
              if (err) {
                res.status(500).json("Internal server errors");
              } else {
                if (rows.length > 0) {
                  con.query(
                    `SELECT * FROM doctors WHERE id = ${JSON.stringify(
                      doctorId
                    )}`,
                    (err1, rows1) => {
                      if (err1) {
                        res.status(500).json("Internal server errors!");
                      } else {
                        if (rows1.length > 0) {
                          inserAppintment(con, res, data);
                        } else {
                          res.status(200).json("Doctor not found!");
                        }
                      }
                    }
                  );
                } else {
                  res.status(200).json("Department not found!");
                }
              }
            }
          );
        } else {
          res.status(400).json("Clinic not found!");
        }
      }
    }
  );
};

// get appoinments
const getAppointments = function (req, res, next) {
  console.log(req.user);
  if (req.user && req.user.role === "clinic") {
    con.query(
      `SELECT * FROM users LEFT JOIN clinics ON clinics.userId = users.id WHERE users.id= ${req.user.id}`,
      (err, rows) => {
        if (err) {
          res.status(500).json("Internal server errors!");
        } else {
          const sql = `SELECT * FROM appointments WHERE clinicId = ${rows[0].id}`;
          con.query(sql, (err1, rows1) => {
            if (err1) {
              res.status(500).json("Internal server errors!");
            } else {
              res.status(200).json(rows1);
            }
          });
        }
      }
    );
  } else if (req.user && req.user.role === "doctor") {
    con.query(
      `SELECT * FROM users LEFT JOIN doctors ON doctors.userId = users.id WHERE users.id= ${req.user.id}`,
      (err, rows) => {
        if (err) {
          console.log(err);
          res.status(500).json("Internal server errors!");
        } else {
          const sql = `SELECT * FROM appointments WHERE doctorId = ${rows[0].id}`;
          con.query(sql, (err1, rows1) => {
            if (err1) {
              res.status(500).json("Internal server errors!");
            } else {
              res.status(200).json(rows);
            }
          });
        }
      }
    );
  } else {
    res.status(401).json("Authentication failure");
  }
};

module.exports = { addAppointment, getAppointments };
