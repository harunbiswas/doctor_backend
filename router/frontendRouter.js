const express = require("express");

const router = express.Router();

// home page
router.get("/", (req, res, next) => {
  res.json("Frontend page!");
});

module.exports = router;
