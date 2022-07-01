const express = require("express");

const router = express.Router();

// home page
router.get("/", (req, res, next) => {
  res.json("Dashboard page!");
});

module.exports = router;
