const bcrypt = require("bcrypt");
const con = require("../../../database/dbConnection");
const { unlink } = require("fs");
const { json } = require("express");

// inser clinic
const inserClinic = (con, data, res) => {
  const sql = `INSERT INTO users( firstName, email, password, role) VALUES (${JSON.stringify(
    data.name
  )}, ${JSON.stringify(data.email)}, ${JSON.stringify(
    data.password
  )} , "clinic")`;

  con.query(sql, (err) => {
    if (err) {
      res.status(500).json("Internal server errors!");
    } else {
      con.query(
        `SELECT * FROM users WHERE email = ${JSON.stringify(data.email)}`,
        (err2, rows) => {
          if (err2) {
            res.status(500).json("Internal server errors!");
          } else {
            const sql2 = `INSERT INTO clinics( userId, phone, image, address, latitude, longitude) VALUES (${JSON.stringify(
              rows[0].id
            )}, ${JSON.stringify(data.phone)}, ${JSON.stringify(
              data.image
            )}, ${JSON.stringify(data.address)}, ${JSON.stringify(
              data.latitude
            )} , ${JSON.stringify(data.longitude)})`;

            con.query(sql2, (err3) => {
              if (err3) {
                res.status(500).json("Internal server errors!");
              } else {
                res.status(200).json("Clinic create successfull!");
              }
            });
          }
        }
      );
    }
  });
};

// add clinic
async function addClinic(req, res, next) {
  const { name, phone, email, password, address, latitude, longitude } =
    req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (req.files && req.files.length > 0) {
    const data = {
      name,
      phone,
      email,
      password: hashedPassword,
      address,
      latitude,
      longitude,
      image: req.files[0].path,
    };

    inserClinic(con, data, res);
  } else {
    res.status(500).json({
      image: {
        msg: "Clinic Profile image is require!",
      },
    });
  }
}

// get clinics
async function getClinics(req, res, next) {
  const sql =
    "SELECT *, null as password  FROM users LEFT JOIN clinics ON clinics.userId = users.id WHERE role='clinic '";
  con.query(sql, (err, rows) => {
    if (err) {
      res.status(400).json("Internal server Errors");
    } else {
      res.status(200).json(rows);
    }
  });
}

//get single clinic
async function getSingleClinc(req, res, next) {
  const { id } = req.params;
  const sql = ` SELECT *, null as password FROM users RIGHT JOIN clinics ON clinics.userId = users.id WHERE users.id = ${JSON.stringify(
    id
  )}`;

  con.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json("Internal server Errors");
    } else {
      if (rows && rows.length > 0) {
        con.query(
          `SELECT * FROM departments WHERE clinicId = ${
            rows.length > 0 && rows[0].id
          }`,
          (err1, data) => {
            if (err1) {
              res.status(500).json("Internal server Errors");
            } else {
              rows[0].departments = data;
              con.query(
                `SELECT * FROM doctors RIGHT JOIN users ON users.id = doctors.userId JOIN departments ON departments.id = doctors.departmentId  WHERE doctors.clinicId = ${rows[0].id}`,
                (err2, rows1) => {
                  if (err2) {
                    res.status(500).json("Internal server Errors");
                  } else {
                    rows[0].doctors = rows1;
                    res.status(200).json(rows[0]);
                  }
                }
              );
            }
          }
        );
      } else {
        res.status(200).json("data not found!");
      }
    }
  });
}

// update clinic
async function updateClinic(req, res, next) {
  const { name, email, phone, address, latitude, longitude } = req.body;
  const { id } = req.params;

  con.query(
    `UPDATE users SET firstName=${JSON.stringify(name)}, email=${JSON.stringify(
      email
    )} WHERE id=${id}`,
    (err) => {
      if (err) {
        res.status(500).json("Internal server errors!");
      } else {
        con.query(
          `UPDATE clinics SET phone=${JSON.stringify(
            phone
          )}, address=${JSON.stringify(address)},latitude=${JSON.stringify(
            latitude
          )}, longitude=${JSON.stringify(longitude)} WHERE userId =${id}`,

          (err1) => {
            if (err1) {
              console.log(err1);
              res.status(500).json("Internal server errors");
            } else {
              res.status(200).json("Clinic Update successfull!");
            }
          }
        );
      }
    }
  );
}

const fs = require("fs");
const path = require("path");
// delete clinic
async function deleteClinic(req, res, next) {
  if (req.user) {
    const { id } = req.params;
    con.query(`SELECT * FROM clinics WHERE userId =${id}`, (err, rows) => {
      if (err) {
        res.status(500).json("Internal server Errors");
      } else {
        if (rows.length > 0) {
          const sql = `DELETE FROM users WHERE id = ${id}`;
          con.query(sql, (err) => {
            if (err) {
              res.status(500).json("Internal server Errors");
            } else {
              const fileName = path.parse(rows[0].image).base;
              const url = path.join(
                __dirname,
                `../../../public/images/photo/${fileName}`
              );

              unlink(url, (err) => {
                if (err) {
                  res.status(500).json("Internal server Errorse");
                } else {
                  res.status(200).json("Clinic delete successfull!");
                }
              });
            }
          });
        } else {
          res.status(400).json("Clinic not found!");
        }
      }
    });
  } else {
    req.status(502).json("Authontication failure!");
  }
}
module.exports = {
  addClinic,
  getClinics,
  getSingleClinc,
  deleteClinic,
  updateClinic,
};
