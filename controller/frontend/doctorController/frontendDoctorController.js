const con = require("../../../database/dbConnection");

async function getDoctors(req, res, next) {
  con.query(
    `SELECT *, "" as password FROM doctors LEFT JOIN users ON users.id=doctors.userId`,
    (err, rows) => {
      if (err) {
        res.status(500).json("Internal server errors");
      } else {
        res.status(200).json(rows);
      }
    }
  );
}

module.exports = {
  getDoctors,
};
