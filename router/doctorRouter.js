const express = require("express");

const router = express.Router();

// doctor page
router.get("/", (req, res, next) => {
  res.json("doctor pages");
});

router.post("/singin");

module.exports = router;
