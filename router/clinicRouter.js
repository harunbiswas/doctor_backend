const express = require("express");
const {
  addClinic,
  getClinics,
  getSingleClinc,
} = require("../controller/admin/clinic/clinicController");
const {
  login,
} = require("../controller/admin/loginSignup/loginSingupController");
const {
  addDepertment,
  getDepartment,
  deleteDepartment,
} = require("../controller/clinic/depertmentController");
const {
  addDoctor,
  adddoctor,
  getdoctors,
  getSingleDoctor,
  deletedoctor,
  updateDoctor,
} = require("../controller/clinic/doctorControler");
const fileUpload = require("../helpers/admin/fileUploader");

const {
  addClinicValidators,
  addClinicValidationResult,
} = require("../middlewares/admin/clinic/addClinicValidators");
const {
  doLoginValidators,
  doLoginValidatorsResust,
} = require("../middlewares/admin/login/loginValidator");
const {
  addDepertmentValidators,
  addDepertmentValidatorsResult,
} = require("../middlewares/clinic/addDepertmentValidator");
const {
  addDoctorValidators,
  addDoctorValidatorsResults,
} = require("../middlewares/clinic/addDoctorValidator");
const { checkLogin } = require("../middlewares/common/checkLogin");

const router = express.Router();

// clinic page
router.get("/", getClinics);
router.get("/list/:id", getSingleClinc);

// create clinic account
router.post(
  "/signup",
  fileUpload,
  addClinicValidators,
  addClinicValidationResult,
  addClinic
);

//  login clinic
router.post("/signin", doLoginValidators, doLoginValidatorsResust, login);

// Departments
router.post(
  "/department",
  checkLogin,
  addDepertmentValidators,
  addDepertmentValidatorsResult,
  addDepertment
);
router.get("/departments", checkLogin, getDepartment);
router.delete("/department/:id", checkLogin, deleteDepartment);

// doctors
router.post(
  "/doctor",
  checkLogin,
  fileUpload,
  addDoctorValidators,
  addDoctorValidatorsResults,
  adddoctor
);
router.get("/doctors", checkLogin, getdoctors);
router.get("/doctor/:id", getSingleDoctor);
router.delete("/doctor/:id", checkLogin, deletedoctor);
router.put("/doctor/:id", checkLogin, updateDoctor);

module.exports = router;
