const con = require("../../database/dbConnection");

function isAdminCheck(req, res, next) {
  con.query(
    `SELECT *, "" AS password FROM users WHERE role = "admin"`,
    (err, rows) => {
      if (err) {
        res.status(500).json("Internal server errors!");
      } else {
        res.status(200).json(rows[0]);
      }
    }
  );
}

module.exports = { isAdminCheck };
