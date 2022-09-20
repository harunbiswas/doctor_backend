const con = require("../../database/dbConnection");

// add time table
function addTime(req, res, next) {
  const { id, day, startTime, endTime } = req.body;

  if (req.user && (req.user.role === "clinic" || req.user.role === "doctor")) {
    const sql = `INSERT INTO time (day, startTime, endTime, doctorId) VALUES(${JSON.stringify(
      day
    )}, ${JSON.stringify(startTime)},${JSON.stringify(
      endTime
    )},${JSON.stringify(id)})`;
    con.query(sql, (err) => {
      if (err) {
        res.status(500).json("Internal server errors");
      } else {
        res.status(200).json("Time add successfull!");
      }
    });
  } else {
    res.status(401).status("Authentication failure");
  }
}

// get time table
function getTime(req, res, next) {
  const { id } = req.params;
  con.query(`SELECT * FROM doctors WHERE userId=${id}`, (err, rows) => {
    if (err) {
      res.status(500).json("Internal server errors!");
    } else {
      if (rows.length > 0) {
        const sql = `SELECT * FROM time WHERE doctorId=${rows[0].id} `;
        con.query(sql, (err, rows1) => {
          if (err) {
            res.status(500).json("Internal server errors");
          } else {
            res.status(200).json(rows1);
          }
        });
      } else {
        res.status(400).json("Doctor not found");
      }
    }
  });
}

// delete time
function deleteTime(req, res, next) {
  const { id } = req.params;

  if (req.user && (req.user.role === "doctor" || req.user.role === "clinic")) {
    con.query(`SELECT * FROM time WHERE id=${id}`, (err, rows) => {
      if (err) {
        res.status(500).json("Internal server errors!");
      } else {
        if (rows.length > 0) {
          const sql = `DELETE FROM time WHERE id=${id} `;
          con.query(sql, (err, rows1) => {
            if (err) {
              res.status(500).json("Internal server errors");
            } else {
              res.status(200).json("Time delete successfull");
            }
          });
        } else {
          res.status(400).json("Time not found");
        }
      }
    });
  } else {
    res.status(401).json("Authentication failured!");
  }
}

module.exports = { addTime, getTime, deleteTime };
