const bcrypt = require("bcrypt");
const con = require("../../database/dbConnection");
const { unlink } = require("fs");
const { json } = require("express");
const { body } = require("express-validator");

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
      image: {
        msg: "doctor Profile image is require!",
      },
    });
  }
}

// get doctors
async function getdoctors(req, res, next) {
  if (req.headers.clinicid) {
    const sql = `SELECT * , "" as password FROM users LEFT JOIN doctors ON doctors.userId = users.id LEFT JOIN departments ON departments.id = doctors.departmentId  WHERE doctors.clinicID = ${JSON.stringify(
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
            const sql = `SELECT * , "" as password FROM users LEFT JOIN doctors ON doctors.userId = users.id RIGHT JOIN departments ON departments.id = doctors.departmentId WHERE doctors.clinicID = ${JSON.stringify(
              rows[0].id
            )} `;
            con.query(sql, (err, rows) => {
              if (err) {
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
  const sql = `SELECT *, "" as password FROM users RIGHT JOIN doctors ON doctors.userId= users.id JOIN departments ON departments.id = doctors.departmentId  WHERE users.id = ${JSON.stringify(
    id
  )}`;

  con.query(sql, (err, rows) => {
    if (err) {
      res.status(400).json("Internal server Errors");
    } else {
      if (rows.length > 0) {
        res.status(200).json(rows[0]);
      } else {
        res.status(200).json("Doctor data not found");
      }
    }
  });
}

// delete doctor

async function deletedoctor(req, res, next) {
  if (req.user && req.user.role === "clinic") {
    const { id } = req.params;
    con.query(
      `SELECT * FROM users LEFT JOIN doctors ON doctors.userId = users.id WHERE users.id = ${id}`,
      (err, rows) => {
        if (err) {
          res.status(500).json("Internal server Errors!");
        } else {
          if (rows.length > 0) {
            unlink(rows[0].image, (err1) => {
              if (err1) {
                res.status(500).json("Internal server Error");
              } else {
                const sql = `DELETE FROM users WHERE id = ${id}`;
                con.query(sql, (err2) => {
                  if (err2) {
                    console.log(err2);
                    res.status(500).json("Internal server Errors!");
                  } else {
                    console.log(err2);
                    res.status(200).json("Doctor delete successfull!");
                  }
                });
              }
            });
          } else {
            res.status(400).json("Doctor not found!");
          }
        }
      }
    );
  } else {
    req.status(502).json("Only clinic can delete doctor!");
  }
}

async function updateDoctor(req, res, next) {
  const { id } = req.params;

  if ((req.user && req.user.role === "doctor") || req.user.role === "clinic") {
    con.query(
      `SELECT * FROM users LEFT JOIN doctors ON doctors.userId = users.id WHERE users.id = ${JSON.stringify(
        id
      )}`,
      (err, rows) => {
        if (err) {
          res.status(500).json("Internal server errors!");
        } else {
          if (rows.length > 0) {
            const sql = `UPDATE users SET firstName = ${JSON.stringify(
              req.body.firstName || rows[0].firstName
            )}, lastName=${JSON.stringify(
              req.body.lastName || rows[0].lastName
            )} WHERE id=  ${id}`;
            con.query(sql, (err1) => {
              if (err1) {
                res.status(500).json("Internal server errors!");
              } else {
                const sql1 = `UPDATE doctors SET  image=${JSON.stringify(
                  req.body.image || rows[0].image
                )}, degree=${JSON.stringify(
                  req.body.degree || rows[0].degree
                )}, phone=${JSON.stringify(
                  req.body.phone || rows[0].phone
                )}, departmentId=${JSON.stringify(
                  req.body.departmentId || rows[0].departmentId
                )}, gender=${JSON.stringify(
                  req.body.gender || rows[0].gender
                )}, bio=${JSON.stringify(
                  req.body.bio || rows[0].bio
                )}, fee=${JSON.stringify(
                  req.body.fee || rows[0].fee
                )}, instagram=${JSON.stringify(
                  req.body.instagram || rows[0].instagram
                )},linkedin=${JSON.stringify(
                  req.body.linkedin || rows[0].linkedin
                )}, facebook=${JSON.stringify(
                  req.body.facebook || rows[0].facebook
                )}, twitter=${JSON.stringify(
                  req.body.twitter || rows[0].twitter
                )} WHERE id= ${JSON.stringify(rows[0].id)}`;

                con.query(sql1, (err2) => {
                  if (err2) {
                    res.status(500).json("Internal server errors");
                  } else {
                    res.status(200).json("Profile update successfull!");
                  }
                });
              }
            });
          } else {
            res.status(400).json("Doctor not found!");
          }
        }
      }
    );
  } else {
    res.status(401).json("Authontication failured");
  }
}
module.exports = {
  adddoctor,
  getdoctors,
  getSingleDoctor,
  deletedoctor,
  updateDoctor,
};
