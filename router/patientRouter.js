const express = require("express");
const { addpatient } = require("../controller/patient/patientController");
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

module.exports = router;
