const express = require("express");
const router = express.Router();
const scoreController = require("../controllers/score");



router.get("listScore",scoreController.showscore);


module.exports = router;