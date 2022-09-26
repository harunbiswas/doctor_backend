const express = require("express");
const {
  payBill,
} = require("../controller/frontend/billingController/billingController");
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
router.post("/pay", payBill);
module.exports = router;
