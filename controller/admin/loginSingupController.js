const bcrypt = require("bcrypt");
const con = require("../../database/dbConnection");

// singup Controller
async function singupController(req, res, next) {
  const { firstName, lastName, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectSQL = `SELECT * FROM admins`;

  con.query(selectSQL, (err, rows) => {
    if (err) {
      console.log(err);
    } else {
      if (rows.length === 0) {
        const data = {
          firstName,
          lastName,
          email,
          hashedPassword,
          role: "admin",
        };
        insartFunc(con, data);
      } else {
        const data = {
          firstName,
          lastName,
          email,
          hashedPassword,
          role: role ? role : "editor",
        };
        insartFunc(con, data);
      }
    }
  });

  const insartFunc = (con, data) => {
    const sql = `INSERT INTO admins (firstName, lastName, email, hash, role) VALUES (${JSON.stringify(
      data.firstName
    )}, ${JSON.stringify(data.lastName)}, ${JSON.stringify(
      data.email
    )},${JSON.stringify(data.hashedPassword)},${JSON.stringify(data.role)})`;
    con.query(sql, (err) => {
      if (err) {
        res.status(500);
        res.json({
          errors: {
            common: {
              msg: "Unkhown Error occured!",
            },
          },
        });
      } else {
        res.status(200);
        res.json("User create successfull!");
      }
    });
  };
}

module.exports = { singupController };
