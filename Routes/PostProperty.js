const express = require("express");
const router = express.Router();
const postPropertyControllers = require("../Controllers/PostProperty");

router.post("/postProperty",postPropertyControllers.postProperty);

router.post("/getPropertiesByUserID", postPropertyControllers.getPropertiesByUserID); //Fetched properties post by paricular user id.

router.delete("/deletePropertyByPropertyID", postPropertyControllers.deletePropertyByPropertyID);   //Delete particular property  based on property id.

router.put("/updateSold", postPropertyControllers.updateSold);      // Update sold field open/sold.

module.exports = router;