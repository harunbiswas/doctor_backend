const express = require("express");
const {
  getDoctorInfo,
  getDoctorAppointments,
} = require("../controller/doctor/doctorController");
const {
  addExperience,
  getExperience,
  deleteExperience,
} = require("../controller/experience/experienceController");
const {
  addTime,
  getTime,
  deleteTime,
} = require("../controller/time/timeController");
const { checkLogin } = require("../middlewares/common/checkLogin");
const {
  addExperienceValidator,
  addExperienceValidatorResults,
} = require("../middlewares/experience/addExperienceValidators");
const {
  addTimeValidator,
  addTimeValidatorResult,
} = require("../middlewares/time/addTimeValidator");

const router = express.Router();

// doctor page
router.get("/", (req, res, next) => {
  res.json("doctor pages");
});

// doctor information
router.get("/info", checkLogin, getDoctorInfo);

// doctor appointments
router.get("/appointments", checkLogin, getDoctorAppointments);

// add exprience
router.post(
  "/experience/:id",
  checkLogin,
  addExperienceValidator,
  addExperienceValidatorResults,
  addExperience
);
// get experience list
router.get("/experience/:id", getExperience);
// delete experience
router.delete("/experience/:id", checkLogin, deleteExperience);

// time table
router.get("/time/:id", getTime);
router.post(
  "/time/:id",
  checkLogin,
  addTimeValidator,
  addTimeValidatorResult,
  addTime
);

router.delete("/time/:id", checkLogin, deleteTime);

module.exports = router;
