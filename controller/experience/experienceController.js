const con = require("../../database/dbConnection");

// add experience
async function addExperience(req, res, next) {
  if ((req.user && req.user.role === "clinic") || req.user.role === "doctor") {
    const { id, fromDate, toDate, role, institute } = req.body;

    const sql = `INSERT INTO experience (doctorId, fromDate, toDate, role, institute) VALUES (${id}, ${JSON.stringify(
      fromDate
    )}, ${JSON.stringify(toDate)}, ${JSON.stringify(role)}, ${JSON.stringify(
      institute
    )})`;
    con.query(sql, (err) => {
      if (err) {
        console.log(err);
        res.status(500).json("Internal server errors!");
      } else {
        res.status(200).json("Experience added successfully!");
      }
    });
  } else {
    res.status(400).json("Clinic and doctor can add it.");
  }
}

// get experience list
async function getExperience(req, res, next) {
  const { id } = req.params;
  con.query(`SELECT * FROM doctors WHERE userID=${id}`, (err, rows) => {
    if (err) {
      res.status(500).json("Internal server errors!");
    } else {
      if (rows.length > 0) {
        con.query(
          `SELECT * FROM experience WHERE doctorId=${rows[0].id}`,
          (err1, rows1) => {
            if (err1) {
              console.log(err1);
              res.status(500).json("Internal server errors!");
            } else {
              res.status(200).json(rows1);
            }
          }
        );
      } else {
        res.status(400).json("Doctor not found");
      }
    }
  });
}

// delete experience
async function deleteExperience(req, res, next) {
  if ((req.user && req.user.role === "clinic") || req.user.role === "doctor") {
    const { id } = req.params;
    con.query(`SELECT * FROM experience WHERE id=${id}`, (err1, rows) => {
      if (err1) {
        res.status(500).json("Internal server errors!");
      } else {
        if (rows.length > 0) {
          con.query(`DELETE FROM experience WHERE id=${id}`, (err) => {
            if (err) {
              res.status(500).json("Internal server errors!");
            } else {
              res.status(200).json("Successfull");
            }
          });
        } else {
          res.status(400).json("Experience not found");
        }
      }
    });
  } else {
    res.status(400).json("Clinic and doctor can do it!");
  }
}
module.exports = { addExperience, getExperience, deleteExperience };
