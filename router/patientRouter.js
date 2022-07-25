const express = require("express");
const {
  addpatient,
  getpatients,
  getSinglepatient,
} = require("../controller/patient/patientController");
const fileUpload = require("../helpers/admin/fileUploader");
const {
  addpatientValidators,
  addpatientValidatorsResults,
} = require("../middlewares/patients/addPatientValidators");

const router = express.Router();

// patient page
router.get("/", (req, res, next) => {
  res.json("Patient router");
});

router.post(
  "/singup",
  fileUpload,
  addpatientValidators,
  addpatientValidatorsResults,
  addpatient
);
router.get("/list", getpatients);
router.get("/list/:id", getSinglepatient);
router.post("/apointment");

module.exports = router;
