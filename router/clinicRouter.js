const express = require("express");
const { addClinic } = require("../controller/admin/clinic/clinicController");
const {
  login,
} = require("../controller/admin/loginSignup/loginSingupController");
const { addDepertment } = require("../controller/clinic/depertmentController");
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

//add depertment
router.post(
  "/depertment",
  checkLogin,
  addDepertmentValidators,
  addDepertmentValidatorsResult,
  addDepertment
);

module.exports = router;
