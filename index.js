const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// internal import
const {
  notFoundHandler,
  errorHandler,
} = require("./middlewares/common/errorHandler");
const con = require("./database/dbConnection");

const frontendRouter = require("./router/frontendRouter");
const adminRouter = require("./router/adminRouter");
const dashboardRouter = require("./router/dashboardRouter");
const doctorRouter = require("./router/doctorRouter");
const clinicRouter = require("./router/clinicRouter");
const patientRouter = require("./router/patientRouter");
const appointRouter = require("./router/appointmentRouter");

// start project
const app = express();

app.use(cors());

//env file configaration
dotenv.config();

//database connection

con.connect((error) => {
  if (!error) {
    console.log("Database Connectios Success");
  } else {
    console.log("Database connection failed!");
  }
});

// resuest parsers
app.use(express.json());

// ser view engine
app.set("view engine", "ejs");

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// routing

app.use("/", frontendRouter);
app.use("/admin", adminRouter);
app.use("/dashboard", dashboardRouter);
app.use("/doctor", doctorRouter);
app.use("/clinic", clinicRouter);
app.use("/patient", patientRouter);
app.use("/appointment", appointRouter);

// 404 handler
app.use(notFoundHandler);

// common handling
app.use(errorHandler);

// run server
app.listen(process.env.PORT || 4000, (error) => {
  if (!error) {
    console.log(`App listening into port: ${process.env.PORT || 4000}`);
  } else {
    console.log(error);
  }
});
