const express = require("express");
const { share } = require("./lannister.controller");
const router = express.Router();
router.post("/compute", share);
module.exports = router;
