const con = require("../../database/dbConnection");

// serch clinic
function searchClinic(req, res, next) {
  const { name, latitude, longitude } = req.body;
  let result = [];
  const splitName = name.split(" ");
  const sql = `SELECT *, "" as password FROM clinics LEFT JOIN users ON users.id = clinics.userId`;
  con.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json("Internal server errors!");
    } else {
      for (let i = 0; i < rows.length; i++) {
        if (
          parseInt(latitude) === parseInt(rows[i].latitude) &&
          parseInt(longitude) === parseInt(rows[i].longitude)
        ) {
          for (let j = 0; j < splitName.length; j++) {
            rows[i].firstName.split(" ").findIndex((el) => {
              if (el.toLowerCase() === splitName[j].toLowerCase()) {
                result.push(rows[i]);
              }
            });
          }
        }
      }

      res.status(200).json(result);
    }
  });
}

// serch doctor
function searchDector(req, res, next) {
  const { department, latitude, longitude } = req.body;
  let result = [];

  const splitName = department.split(" ");
  const sql = `SELECT *, doctors.image, doctors.phone, doctors.userId, doctors.id, "" as password FROM doctors LEFT JOIN users ON users.id = doctors.userId JOIN departments ON departments.id = doctors.departmentId JOIN clinics ON clinics.id = doctors.clinicId`;

  con.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(500).json("Internal server errors!");
    } else {
      for (let i = 0; i < rows.length; i++) {
        if (
          parseInt(latitude) === parseInt(rows[i].latitude) &&
          parseInt(longitude) === parseInt(rows[i].longitude)
        ) {
          for (let j = 0; j < splitName.length; j++) {
            rows[i].title.split(" ").findIndex((el) => {
              if (el.toLowerCase() === splitName[j].toLowerCase()) {
                result.push(rows[i]);
              }
            });
          }
        }
      }

      res.status(200).json(result);
    }
  });
}

module.exports = {
  searchClinic,
  searchDector,
};
