const con = require("../../database/dbConnection");

// inser appointment
const inserAppintment = (con, res, data) => {
  const sql = `INSERT INTO appointments(patientId, doctorId, departmentId, name, email, time, date, phone, comments, age) VALUES(${JSON.stringify(
    data.patientId
  )}, ${JSON.stringify(data.doctorId)},${JSON.stringify(
    data.departmentId
  )},${JSON.stringify(data.name)},${JSON.stringify(
    data.email
  )},${JSON.stringify(data.time)},${JSON.stringify(data.date)},${JSON.stringify(
    data.phone
  )},${JSON.stringify(data.comments)}, ${JSON.stringify(data.age)})`;

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
  };
  inserAppintment(con, res, data);
};

module.exports = { addAppointment };
