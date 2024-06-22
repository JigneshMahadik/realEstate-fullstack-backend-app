const path = require("path");
const multer = require("multer");
const propertyModel = require("../Models/PostProperty");

const uploadDirePath = path.join(__dirname, "..", "filesUploaded");

// console.log(uploadDirePath);

const storage = multer.diskStorage({
    destination : (req,file, cb)=>{
        cb(null, uploadDirePath);
    },
    filename : (req,file,cb)=>{
        const fileName = file.originalname;
        cb(null, fileName);
    }
});
    
const upload = multer({
    storage : storage
}).array("files");



// Create a new post in DB.
const postProperty = (req,res)=>{
    // console.log("beds are",req.body.beds);
    upload(req,res,async(error)=>{
        if(error){
            res.json({
                message : error,
            });
            return;
        }
        
        try {
            const fileData = req.files.map(file => file.path);

            const data = new propertyModel({
                property_type : req.body.property_type,
                transaction_type : req.body.transaction_type,
                property_name : req.body.property_name,
                pincode : req.body.pincode,
                address : req.body.address,
                propertySubtype : req.body.propertySubtype,
                price : req.body.price,
                beds : req.body.beds,
                bathrooms : req.body.bathrooms,
                furnishing : req.body.furnishing,
                other_details : req.body.other_details,
                files : fileData,
                userId : req.user._id
            });
            
            const newInsertedProperty = await data.save();    
            
            res.json({
                status : true,
                message : "File uploaded successfully"
            });
        }
        catch(error){
            console.log("Error while inserting tha data !", error.message);
            return res.status(500).json({
                Error : error.message,
                message : "Error while inserting the data"
            });
        }
    });    
};

// Retrive all properties posted by particular user id.
const getPropertiesByUserID = async(req,res)=>{

    const propertyDetails = await propertyModel.find({
        userId : req.query.propId
    });
    // console.log("user id is :",req.query.propId);

    res.json({
        message : "getPropertiesByUserID API called",
        total_records : propertyDetails.length,
        records : propertyDetails
    });
}


const deletePropertyByPropertyID = async(req,res)=>{

    const removedData = await propertyModel.findByIdAndDelete(req.query.propId);
    console.log("Property removed successfully");
    res.json({
        status : true,
        message : "Property removed successfully"
    })
}


const updateSold = async (req,res)=>{
    // console.log("Sold or not", req.body.sold, req.body._id);

    const soldUpdated = await propertyModel.findByIdAndUpdate(req.body._id, 
        {
            sold : req.body.sold
        });

    res.json({
        status : true,
        message : "Property sold out"
    })
}


// Export all the controllers.
const postPropertyControllers = {
    postProperty,
    getPropertiesByUserID,
    deletePropertyByPropertyID,
    updateSold
}

module.exports = postPropertyControllers;