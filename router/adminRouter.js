const express = require("express");
const {
  addBlog,
  getBlogs,
  getSingleBlog,
  updateSingleBlog,
  deleteBlog,
} = require("../controller/admin/blogs/blogController");
const {
  addClinic,
  getClinics,
  getSingleClinc,
  deleteClinics,
  deleteClinic,
} = require("../controller/admin/clinic/clinicController");

// internal imports
const {
  singupController,
  login,
  addUser,
  getUser,
  deleteUser,
} = require("../controller/admin/loginSignup/loginSingupController");
const fileUpload = require("../helpers/admin/fileUploader");
const {
  addBlogValidators,
  addBlogValidatorsResust,
} = require("../middlewares/admin/blog/addBlogValidators");
const {
  addClinicValidators,
  addClinicValidationResult,
} = require("../middlewares/admin/clinic/addClinicValidators");
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

// blogs

// add blog
router.post(
  "/blog",
  checkLogin,
  fileUpload,
  addBlogValidators,
  addBlogValidatorsResust,
  addBlog
);

// getBlogs
router.get("/blogs", checkLogin, getBlogs);

// get single blog
router.get("/blog/:id", checkLogin, getSingleBlog);
// update blog
router.put(
  "/blog/:id",
  checkLogin,
  fileUpload,
  addBlogValidators,
  updateSingleBlog
);

// delete blog
router.delete("/blog/:id", checkLogin, deleteBlog);

// clinic
// add clinic
router.post(
  "/clinic",
  checkLogin,
  fileUpload,
  addClinicValidators,
  addClinicValidationResult,
  addClinic
);

// get clinics
router.get("/clinics", checkLogin, getClinics);

// get single clinic
router.get("/clinic/:id", checkLogin, getSingleClinc);

// get single clinic
router.delete("/clinic/:id", checkLogin, deleteClinic);
// add doctor
router.post("/doctor", checkLogin, fileUpload);

module.exports = router;
