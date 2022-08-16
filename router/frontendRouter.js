const express = require("express");
const {
  getDepartmentFrontend,
} = require("../controller/frontend/frontendDepartmentController");
const {
  getfrontendDoctors,
} = require("../controller/frontend/frontendDoctorController");

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

module.exports = router;
