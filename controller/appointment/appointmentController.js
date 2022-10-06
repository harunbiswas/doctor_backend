const con = require("../../database/dbConnection");

const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// These id's and secrets should come from .env file.
const CLIENT_ID =
  "527370249281-7rrbhlfn2eq41a6vji71rlqm3mau2m3q.apps.googleusercontent.com";
const CLEINT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//041jONos9y4FGCgYIARAAGAQSNwF-L9IrzI6hF7k7JVm4PWDM_eKr16qiT_lDfnv2d5JK5VMVg71ya80E9O4G7u8sgZeSqN538xs";

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLEINT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(mail, text) {
  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "booking.estetix@gmail.com",
        clientId: CLIENT_ID,
        clientSecret: CLEINT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: "Estetix Confirmations <booking.estetix@gmail.com>",
      to: `to:${mail}`,
      //cc: 'booking.estetix@gmail.com',
      subject: "Booking confirmed",
      text: `${text}`,
      html: `<h1>${text}</h1>`,
    };

    const result = await transport.sendMail(mailOptions);
    return result;
  } catch (error) {
    return error;
  }
}

// inser appointment
const inserAppintment = (con, res, data) => {
  const sql = `INSERT INTO appointments(patientId, doctorId, departmentId, name, email, date, phone, comments, age, clinicId, paymentType) VALUES(${JSON.stringify(
    data.patientId
  )}, ${JSON.stringify(data.doctorId)},${JSON.stringify(
    data.departmentId
  )},${JSON.stringify(data.name)},${JSON.stringify(
    data.email
  )},${JSON.stringify(data.date)},${JSON.stringify(
    data.phone
  )},${JSON.stringify(data.comments)}, ${JSON.stringify(
    data.age
  )}, ${JSON.stringify(data.clinicId)}, ${JSON.stringify(data.payment)})`;

  con.query(sql, (err) => {
    if (err) {
      console.log(err);
      res.status(500).json("Internal Server Errors");
    } else {
      sendMail(
        data.email,
        "Dear customer we inform you that your booking was confirmed"
      )
        .then((result) => {
          con.query(
            `SELECT * FROM doctors WHERE id=${data.doctorId}`,
            (err1, rows) => {
              if (err1 || rows.length === 0) {
                console.log(err1);
                res.status(500).json("Internal Server Errors!");
              } else
                con.query(
                  `SELECT * FROM users WHERE id=${rows[0].userId}`,
                  (err2, rows1) => {
                    if (err2 || rows1.length === 0) {
                      console.log(err2);
                      res.status(500).json("Internal Server Errorse");
                    } else {
                      sendMail(
                        rows1[0].email,
                        "Dear Doctor we inform you that your get A new booking"
                      )
                        .then((result) => {
                          res.status(200).json("Appointment successfull");
                        })
                        .catch((e) => {
                          res.status(500).json("Internal Server Errors");
                        });
                    }
                  }
                );
            }
          );
        })
        .catch((error) => {
          res.status(500).json("Internal Server Errors");
        });
    }
  });
};

// add a appointment
const addAppointment = function (req, res, next) {
  const {
    clinicId,
    patientId,
    doctorId,
    departmentId,
    name,
    email,
    phone,
    comments,
    age,
    date,
    payment,
  } = req.body;
  const data = {
    patientId: patientId || null,
    doctorId,
    departmentId,
    name,
    email,
    phone,
    date,
    comments: comments || null,
    age,
    clinicId,
    payment,
  };
  con.query(
    `SELECT * FROM clinics WHERE id = ${JSON.stringify(clinicId)}`,
    (err2, rows2) => {
      if (err2) {
        res.status(500).json("Internal server errors");
      } else {
        if (rows2.length > 0) {
          con.query(
            `SELECT * FROM departments WHERE id = ${JSON.stringify(
              departmentId
            )}`,
            (err, rows) => {
              if (err) {
                res.status(500).json("Internal server errors!");
              } else {
                if (rows.length > 0) {
                  con.query(
                    `SELECT * FROM doctors WHERE id = ${JSON.stringify(
                      doctorId
                    )}`,
                    (err1, rows1) => {
                      if (err1) {
                        res.status(500).json("Internal server errors!");
                      } else {
                        if (rows1.length > 0) {
                          inserAppintment(con, res, data, rows);
                        } else {
                          res.status(400).json("Doctor not found!");
                        }
                      }
                    }
                  );
                } else {
                  res.status(200).json("Department not found!");
                }
              }
            }
          );
        } else {
          res.status(400).json("Clinic not found!");
        }
      }
    }
  );
};

// get appoinments
const getAppointments = function (req, res, next) {
  console.log(req.user);
  if (req.user && req.user.role === "clinic") {
    con.query(
      `SELECT * FROM users LEFT JOIN clinics ON clinics.userId = users.id WHERE users.id= ${req.user.id}`,
      (err, rows) => {
        if (err) {
          res.status(500).json("Internal server errors!");
        } else {
          const sql = `SELECT * FROM appointments WHERE clinicId = ${rows[0].id}`;
          con.query(sql, (err1, rows1) => {
            if (err1) {
              res.status(500).json("Internal server errors!");
            } else {
              res.status(200).json(rows1);
            }
          });
        }
      }
    );
  } else if (req.user && req.user.role === "doctor") {
    con.query(
      `SELECT * FROM users LEFT JOIN doctors ON doctors.userId = users.id WHERE users.id= ${req.user.id}`,
      (err, rows) => {
        if (err) {
          console.log(err);
          res.status(500).json("Internal server errors!");
        } else {
          const sql = `SELECT * FROM appointments WHERE doctorId = ${rows[0].id}`;
          con.query(sql, (err1, rows1) => {
            if (err1) {
              res.status(500).json("Internal server errors!");
            } else {
              res.status(200).json(rows);
            }
          });
        }
      }
    );
  } else {
    res.status(401).json("Authentication failure");
  }
};

module.exports = { addAppointment, getAppointments };
