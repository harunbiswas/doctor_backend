const bcrypt = require("bcrypt");
const con = require("../../database/dbConnection");
const { unlink } = require("fs");

// inser doctor
const inserdoctor = (con, data, res, req) => {
  const sql = `INSERT INTO users( firstName,lastName, email, password, role) VALUES (${JSON.stringify(
    data.firstName
  )},${JSON.stringify(data.lastName)}, ${JSON.stringify(
    data.email
  )}, ${JSON.stringify(data.password)} , "doctor")`;

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
            con.query(
              `SELECT * FROM clinics WHERE userId= ${JSON.stringify(
                req.user.id
              )}`,
              (e, rows1) => {
                if (e) {
                  res.status(500).json("Internal server errors!");
                } else {
                  const sql2 = `INSERT INTO doctors( userId, clinicID, phone, image, departmentId, gender) VALUES (${JSON.stringify(
                    rows[0].id
                  )},${JSON.stringify(rows1[0].id)}, ${JSON.stringify(
                    data.phone
                  )}, ${JSON.stringify(data.image)}, ${JSON.stringify(
                    data.departmentID
                  )}, ${JSON.stringify(data.gender)})`;

                  con.query(sql2, (err3) => {
                    if (err3) {
                      con.query(
                        `DELETE FROM users WHERE id= ${rows[0].id}`,
                        (err4) => {
                          if (err4) {
                            res.status(500).json("Internal server errors!");
                          } else {
                            res.status(500).json("Internal server errors!");
                          }
                        }
                      );
                    } else {
                      res.status(200).json("doctor added successfull!");
                    }
                  });
                }
              }
            );
          }
        }
      );
    }
  });
};

// update doctor query
const updatedoctor = (con, data, res) => {
  const sql = `UPDATE blogs SET departmentID=null,thumbnail = ${JSON.stringify(
    data.thumnel
  )},title=${JSON.stringify(
    data.title
  )},date=null,timeToRead=null,description=${JSON.stringify(
    data.description
  )},tags=${JSON.stringify(data.tags)} WHERE id = ${data.id}`;

  con.query(sql, (err) => {
    if (err) {
      // console.log(err);
      res.status(400).json("Internal server errors!");
    } else {
      res.status(200).json("Blog update successfull");
    }
  });
};

// add doctor
async function adddoctor(req, res, next) {
  const { firstName, lastName, phone, email, password, departmentID, gender } =
    req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (req.files && req.files.length > 0) {
    const data = {
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
      departmentID,
      gender,
      image: req.files[0].path,
    };

    inserdoctor(con, data, res, req);
  } else {
    res.status(500).json({
      errors: {
        image: {
          msg: "doctor Profile image is require!",
        },
      },
    });
  }
}

// get doctors
async function getdoctors(req, res, next) {
  if (req.headers.clinicid) {
    const sql = `SELECT * FROM users INNER JOIN doctors ON doctors.userId = users.id  WHERE clinicID = ${JSON.stringify(
      req.headers.clinicid
    )}`;
    con.query(sql, (err, rows) => {
      if (err) {
        console.log(err);
        res.status(400).json("Internal server Errors");
      } else {
        res.status(200).json(rows);
      }
    });
  } else {
    con.query(
      `SELECT * FROM clinics WHERE userId= ${JSON.stringify(req.user.id)}`,
      (err, rows) => {
        if (err) {
          res.status(500).json("Internal server errors!");
        } else {
          if (rows.length > 0) {
            const sql = `SELECT * FROM users INNER JOIN doctors ON doctors.userId = users.id WHERE clinicID = ${JSON.stringify(
              rows[0].id
            )} `;
            con.query(sql, (err, rows) => {
              if (err) {
                console.log(err);
                res.status(400).json("Internal server Errors");
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
}

//get single doctor
async function getSingleDoctor(req, res, next) {
  const { id } = req.params;
  const sql = `SELECT * FROM users RIGHT JOIN doctors ON doctors.userId= users.id  WHERE doctors.id = ${JSON.stringify(
    id
  )}`;

  con.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(400).json("Internal server Errors");
    } else {
      res.status(200).json(rows[0]);
    }
  });
}

// delete doctor

async function deletedoctor(req, res, next) {
  if (req.user && req.user.role === "clinic") {
    const { id } = req.params;
    con.query(`SELECT * FROM doctors WHERE id = ${id}`, (err, rows) => {
      if (err) {
        res.status(500).json("Internal server Errors");
      } else {
        if (rows.length > 0) {
          unlink(rows[0].image, (err1) => {
            if (err1) {
              res.status(500).json("Internal server Errors");
            } else {
              const sql = `DELETE FROM users WHERE id = ${rows[0].userId}`;
              con.query(sql, (err2) => {
                if (err2) {
                  console.log(err2);
                  res.status(500).json("Internal server Errors");
                } else {
                  res.status(200).json("doctor delete successfull!");
                }
              });
            }
          });
        } else {
          res.status(400).json("Doctor not found!");
        }
      }
    });
  } else {
    req.status(502).json("Only clinic can delete doctor!");
  }
}
module.exports = { adddoctor, getdoctors, getSingleDoctor, deletedoctor };
