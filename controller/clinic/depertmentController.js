const con = require("../../database/dbConnection");

// add Depertment
const addDepertment = async function (req, res, next) {
  if (req.user && req.user.role === "clinic") {
    con.query(
      `SELECT * FROM departments WHERE (title = ${JSON.stringify(
        req.body.title
      )}) AND (clinicID = ${JSON.stringify(req.user.id)}) `,
      (err, rows) => {
        if (err) {
          res.status(500).json("Internal server error!");
        } else {
          if (rows.length > 0) {
            res.status(400).json({
              title: {
                msg: "The department already added!",
              },
            });
          } else {
            con.query(
              `SELECT * FROM clinics WHERE userId=${req.user.id}`,
              (err3, rows1) => {
                if (err3) {
                  res.status(500).json("Internal server errors!");
                } else {
                  if (rows1.length > 0) {
                    const sql = `INSERT INTO departments(title, clinicID, discription) VALUES(${JSON.stringify(
                      req.body.title
                    )}, ${JSON.stringify(
                      JSON.stringify(rows1[0].id)
                    )}, ${JSON.stringify(req.body.description)})`;
                    con.query(sql, (err1) => {
                      if (err1) {
                        res.status(500).json("Internal server error!");
                      } else {
                        res.status(200).json("Department added successfully!");
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
      }
    );
  } else {
    res.status(400).json("Only clinic can add department");
  }
};

// get department
const getDepartment = async function (req, res, next) {
  con.query(
    `SELECT * FROM clinics WHERE userId=${req.user.id}`,
    (err3, rows1) => {
      if (err3) {
        res.status(500).json("Internal server errors!");
      } else {
        if (rows1.length > 0) {
          const sql = `SELECT * FROM departments WHERE clinicID = ${
            JSON.stringify(req.headers.id) || JSON.stringify(rows1[0].id)
          }`;

          con.query(sql, (err, rows) => {
            if (err) {
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
};

// delete department
const deleteDepartment = async function (req, res, next) {
  if (req.user && req.user.role === "clinic") {
    const sql = `SELECT * FROM departments WHERE id= ${JSON.stringify(
      req.params.id
    )} `;

    con.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json("Internal server errors");
      } else {
        if (rows.length > 0) {
          const sql1 = `DELETE FROM departments WHERE id= ${JSON.stringify(
            req.params.id
          )}`;

          con.query(sql1, (err1) => {
            if (err1) {
              console.log(err1);
              res.status(500).json("Internal server errors");
            } else {
              res.status(200).json("Department remove successfull!");
            }
          });
        } else {
          res.status(400).json("Departments not found!");
        }
      }
    });
  } else {
    res.status(401).json("Only clinic can remove departments");
  }
};

module.exports = { addDepertment, getDepartment, deleteDepartment };
