const express = require("express");
const {
  getClinicAppointments,
} = require("../controller/admin/appointment/appointmentController");
const {
  addClinic,
  getClinics,
  getSingleClinc,
  updateClinic,
  deleteClinic,
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
const { addTime } = require("../controller/time/timeController");
const fileUpload = require("../helpers/admin/fileUploader");

const {
  addClinicValidators,
  addClinicValidationResult,
  updateClinicValidators,
  updateClinicValidatorsResult,
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
const {
  addTimeValidator,
  addTimeValidatorResult,
} = require("../middlewares/time/addTimeValidator");

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
// update clinic
router.put(
  "/update/:id",
  checkLogin,
  updateClinicValidators,
  updateClinicValidatorsResult,
  updateClinic
);

// delete clinic
router.delete("/delete/:id", checkLogin, deleteClinic);

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

// appointment
router.get("/appointments", getClinicAppointments);

module.exports = router;
