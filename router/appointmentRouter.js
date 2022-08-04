const express = require("express");
const {
  addAppointment,
} = require("../controller/appointment/appointmentController");
const {
  addAppointmentResult,
  addAppointmentValidator,
} = require("../middlewares/appointment/addAppoitmentValidator");
const {
  appointmentCheckLogin,
} = require("../middlewares/appointment/appintmentCheckLogin");
const {
  addpatientValidators,
} = require("../middlewares/patients/addPatientValidators");

const router = express.Router();

// get appointements
router.get("/", (req, res, next) => {
  res.status(200).json("appointemts");
});

// add a appointment
router.post(
  "/",
  appointmentCheckLogin,

  addAppointmentValidator,
  addAppointmentResult,
  addAppointment
);

module.exports = router;
