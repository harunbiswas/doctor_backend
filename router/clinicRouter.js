const express = require("express");
const { addClinic } = require("../controller/admin/clinic/clinicController");
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
router.get("/", (req, res, next) => {
  res.json("clinic pages");
});

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

module.exports = router;
