const express = require("express");
const router = express.Router();
const controller = require("../controller/HomeController");


router.get("/", controller.index); 
router.post("/create-payment", controller.createQr);
router.get("/check-status", controller.checkStatus);
module.exports = router;