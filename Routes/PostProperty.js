const express = require("express");
const router = express.Router();
const postPropertyControllers = require("../Controllers/PostProperty");

router.post("/postProperty",postPropertyControllers.postProperty);

router.post("/getPropertiesByUserID", postPropertyControllers.getPropertiesByUserID); //Fetched properties post by paricular user id.

router.delete("/deletePropertyByPropertyID", postPropertyControllers.deletePropertyByPropertyID);   //Delete particular property  based on property id.

router.put("/updateSold", postPropertyControllers.updateSold);      // Update sold field open/sold.

router.post("/addRequests", postPropertyControllers.addRequests);      // Add a Request message enquired by client.

router.post("/fetchRequests", postPropertyControllers.fetchRequests);      // Fetch all Request message for particular posted property.

router.post("/getRequestedProperties",postPropertyControllers.getRequestedProperties);

router.put("/editPropertyDetails", postPropertyControllers.editPropertyDetails);   //Update property details based on property id.

router.delete("/deleteProperty", postPropertyControllers.deleteProperty);   //Delete property details based on property id.

module.exports = router;