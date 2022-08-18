const express = require("express");
const {
  getDoctorInfo,
  getDoctorAppointments,
} = require("../controller/doctor/doctorController");
const { checkLogin } = require("../middlewares/common/checkLogin");

const router = express.Router();

// doctor page
router.get("/", (req, res, next) => {
  res.json("doctor pages");
});

// doctor information
router.get("/info", checkLogin, getDoctorInfo);

// doctor appointments
router.get("/appointments", checkLogin, getDoctorAppointments);
module.exports = router;
