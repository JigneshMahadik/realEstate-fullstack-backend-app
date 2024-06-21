const express = require("express");


const router = express.Router();
const authControllers = require("../Controllers/auth");

router.post("/Signup",authControllers.Signup);

router.post("/Login",authControllers.Login);

router.get("/getData",authControllers.getData);

module.exports = router;