const express = require("express");
const { getDoctorInfo } = require("../controller/doctor/doctorController");
const {
  payBill,
} = require("../controller/frontend/billingController/billingController");
const {
  getDoctors,
} = require("../controller/frontend/doctorController/frontendDoctorController");
const {
  getDepartmentFrontend,
} = require("../controller/frontend/frontendDepartmentController");
const {
  getfrontendDoctors,
} = require("../controller/frontend/frontendDoctorController");
const {
  searchClinic,
  searchDector,
} = require("../controller/frontend/searchController");
const {
  createSubscription,
  updateSubscription,
  getSubscription,
} = require("../controller/frontend/subscriptionController");
const {
  addAppointmentValidator,
  addAppointmentResult,
} = require("../middlewares/appointment/addAppoitmentValidator");
const { checkLogin } = require("../middlewares/common/checkLogin");
const {
  clinicSearcValidation,
  clinicSearchValidationResult,
  doctorSearcValidation,
  doctorSearchValidationResult,
} = require("../middlewares/frontend/searchValidation");

const router = express.Router();

// home page
router.get("/", (req, res, next) => {
  res.json("Frontend page!");
});

router.post("/singin");

// get departments
router.get("/departments", getDepartmentFrontend);

// get doctors for appointments
router.get("/doctors", getfrontendDoctors);

// serch filter
router.post(
  "/search/clinics",
  clinicSearcValidation,
  clinicSearchValidationResult,
  searchClinic
);

router.post(
  "/search/doctors",
  doctorSearcValidation,
  doctorSearchValidationResult,
  searchDector
);

// billing
router.post("/subscription", checkLogin, createSubscription);
router.put("/subscription", checkLogin, updateSubscription);
router.get("/subscription", checkLogin, getSubscription);

// doctors
router.get("/frDoctors", getDoctors);

module.exports = router;
