const express = require("express");
const router = express.Router();
const botControllers = require("../Controllers/Bot");


router.post("/chat", botControllers.chat);


module.exports = router;