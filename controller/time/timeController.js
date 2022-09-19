const con = require("../../database/dbConnection");

// add time table
function addTime(req, res, next) {
  const { id, day, startTime, endTime } = req.body;
  if (req.user) {
    const sql = `INSERT INTO time (day, startTime, endTime, doctorId) VALUES(${JSON.stringify(
      day
    )}, ${JSON.stringify(startTime)},${JSON.stringify(
      endTime
    )},${JSON.stringify(id)},)`;
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

module.exports = { addTime };
