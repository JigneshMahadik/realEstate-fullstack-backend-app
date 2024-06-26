const express = require("express");
const router = express.Router();
const listPropertyControllers = require("../Controllers/ListProperty");


router.get("/getAllProperties", listPropertyControllers.getAllProperties);

router.post("/getPropertyById",listPropertyControllers.getPropertyById);

router.post("/searchKeyword",listPropertyControllers.searchKeyword);        //Search property list based on searched keyword.

module.exports = router;