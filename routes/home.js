const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("hallo world");
});

module.exports = router;
