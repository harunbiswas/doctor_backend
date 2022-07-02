const express = require("express");

// internal imports
const {
  singupController,
  login,
  addUser,
  getUser,
  deleteUser,
} = require("../controller/admin/loginSingupController");
const {
  doLoginValidators,
  doLoginValidatorsResust,
} = require("../middlewares/admin/login/loginValidator");
const {
  addUserValidators,
  addUserValidatorsHandler,
} = require("../middlewares/admin/users/userValidator");
const { checkLogin } = require("../middlewares/common/checkLogin");

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
  singupController,
  checkLogin,
  addUser
);

// user list
router.get("/user", checkLogin, getUser);

// delete user
router.delete("/user", checkLogin, deleteUser);

//login router
router.post("/singin", doLoginValidators, doLoginValidatorsResust, login);

module.exports = router;
