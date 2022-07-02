const express = require("express");

// internal imports
const {
  singupController,
} = require("../controller/admin/loginSingupController");
const {
  addUserValidators,
  addUserValidatorsHandler,
} = require("../middlewares/admin/users/userValidator");

const router = express.Router();

// home page
router.get("/", (req, res, next) => {
  res.status(200);
  res.json("Admin!");
});

// sing up route
router.post(
  "/singup",
  addUserValidators,
  addUserValidatorsHandler,
  singupController
);

//login router
router.post("singin");

module.exports = router;
