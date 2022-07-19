const bcrypt = require("bcrypt");
const con = require("../../../database/dbConnection");

// inser blog
const inserClinic = (con, data, res) => {
  const sql = `INSERT INTO clinics( name, email, phone, image, password, address, latitude, longitude) VALUES (${JSON.stringify(
    data.name
  )}, ${JSON.stringify(data.email)}, ${JSON.stringify(
    data.phone
  )}, ${JSON.stringify(data.image)}, ${JSON.stringify(
    data.password
  )} , ${JSON.stringify(data.address)}, ${JSON.stringify(
    data.latitude
  )} , ${JSON.stringify(data.longitude)}  )`;

  con.query(sql, (err) => {
    if (err) {
      res.status(400).json("Internal server errors!");
    } else {
      res.status(200).json("Blog add successfull");
    }
  });
};

// update blog query
const updateClinic = (con, data, res) => {
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

// add clinic
async function addClinic(req, res, next) {
  const { name, phone, email, password, address, latitude, longitude } =
    req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  if (req.user) {
    if (req.files && req.files.length > 0) {
      const data = {
        name,
        phone,
        email,
        password: hashedPassword,
        address,
        latitude,
        longitude,
        image: req.files[0].path,
      };

      inserClinic(con, data, res);
    } else {
      res.status(500).json({
        errors: {
          image: {
            msg: "Clinic Profile image is require!",
          },
        },
      });
    }
  } else {
    res.status(400).json({
      errors: {
        common: {
          msg: "Authentication failure!",
        },
      },
    });
  }
}

// get clinics
async function getClinics(req, res, next) {
  const sql = "SELECT * FROM clinics";
  con.query(sql, (err, rows) => {
    if (err) {
      res.status(400).json("Internal server Errors");
    } else {
      res.status(200).json(rows);
    }
  });
}

//get single clinic
async function getSingleClinc(req, res, next) {
  const { id } = req.params;
  const sql = `SELECT * FROM clinics WHERE id = ${id}`;

  con.query(sql, (err, rows) => {
    if (err) {
      res.status(400).json("Internal server Errors");
    } else {
      res.status(200).json(rows[0]);
    }
  });
}

// delete clinic

async function deleteClinic(req, res, next) {
  if (req.user) {
    const { id } = req.params;
    const sql = `DELETE FROM clinics WHERE id = ${id}`;
    con.query(sql, (err) => {
      if (err) {
        res.status(400).json("Internal server Errors");
      } else {
        res.status(200).json("Clinic delete successfull!");
      }
    });
  } else {
    req.status(502).json("Authontication failure!");
  }
}
module.exports = { addClinic, getClinics, getSingleClinc, deleteClinic };
