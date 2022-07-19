const express = require("express");

const router = express.Router();

// home page
router.get("/", (req, res, next) => {
  res.json("Frontend page!");
});

router.post("/singin");

module.exports = router;
