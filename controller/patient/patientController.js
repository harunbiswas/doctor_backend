const bcrypt = require("bcrypt");
const con = require("../../database/dbConnection");
const { unlink } = require("fs");

// inser patient
const inserpatient = (con, data, res, req) => {
  const sql = `INSERT INTO users( firstName,lastName, email, password, role) VALUES (${JSON.stringify(
    data.firstName
  )},${JSON.stringify(data.lastName)}, ${JSON.stringify(
    data.email
  )}, ${JSON.stringify(data.password)} , "patient")`;

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
            const sql2 = `INSERT INTO patients( userId, phone, image, gender, height, weight, bloodGroup, address) VALUES (${JSON.stringify(
              rows[0].id
            )}, ${JSON.stringify(data.phone)}, ${JSON.stringify(
              data.image
            )}, ${JSON.stringify(data.gender)}, ${JSON.stringify(
              data.heigth
            )}, ${JSON.stringify(data.weigth)}, ${JSON.stringify(
              data.bloadGroup
            )},  ${JSON.stringify(data.address)})`;

            con.query(sql2, (err3) => {
              if (err3) {
                con.query(
                  `DELETE FROM users WHERE id= ${rows[0].id}`,
                  (err4) => {
                    if (err4) {
                      res.status(500).json("Internal server errors!");
                    } else {
                      console.log(err3);
                      res.status(500).json("Internal server errors");
                    }
                  }
                );
              } else {
                res.status(200).json("patient added successfull!");
              }
            });
          }
        }
      );
    }
  });
};

// update patient query
const updatepatient = (con, data, res) => {
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

// add patient
async function addpatient(req, res, next) {
  const {
    firstName,
    lastName,
    phone,
    email,
    password,
    gender,
    heigth,
    weigth,
    bloadGroup,
    address,
  } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  if (req.files && req.files.length > 0) {
    const data = {
      firstName,
      lastName,
      phone,
      email,
      password: hashedPassword,
      gender,
      image: req.files[0].path,
      heigth,
      weigth,
      bloadGroup,
      address,
    };

    inserpatient(con, data, res, req);
  } else {
    res.status(500).json({
      errors: {
        image: {
          msg: "patient Profile image is require!",
        },
      },
    });
  }
}

// get patients
async function getpatients(req, res, next) {
  const sql = `SELECT * , "" as password FROM users INNER JOIN patients ON patients.userId = users.id WHERE users.role = "patient" `;
  con.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      res.status(400).json("Internal server Errors");
    } else {
      res.status(200).json(rows);
    }
  });
}

//get single patient
async function getSinglepatient(req, res, next) {
  const { id } = req.params;
  const sql = `SELECT *, "" as password  FROM users RIGHT JOIN patients ON patients.userId= users.id  WHERE patients.id = ${JSON.stringify(
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

// delete patient

async function deletepatient(req, res, next) {
  if (req.user && req.user.role === "clinic") {
    const { id } = req.params;
    con.query(`SELECT * FROM patients WHERE id = ${id}`, (err, rows) => {
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
                  res.status(200).json("patient delete successfull!");
                }
              });
            }
          });
        } else {
          res.status(400).json("patient not found!");
        }
      }
    });
  } else {
    req.status(502).json("Only clinic can delete patient!");
  }
}
module.exports = { addpatient, getpatients, getSinglepatient, deletepatient };
