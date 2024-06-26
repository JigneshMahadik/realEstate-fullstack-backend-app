const propertyModel = require("../Models/PostProperty");


// Get all the posts from DB
const getAllProperties = async (req,res)=>{
    const data = await propertyModel.find();
    res.json({
        status : true,
        message : "Records fetched successfully",
        total_records : data.length,
        records : data
    })
}


const getPropertyById = async(req,res)=>{
    
    try {
        const propertyDetails = await propertyModel.findById(req.query.propId);
        // console.log("jack",req.query.propId);
        // console.log(propertyDetails);
        res.json({
            status : true,
            message : "Property details fetched successfully",
            records : propertyDetails
        });   
    }
    catch (error) {
        res.json({
            message : "Something went wrong while fetching the data !"
        })    
    }
}



// Export all the controllers.
const listPropertyControllers = {
    getAllProperties,
    getPropertyById,
}

module.exports = listPropertyControllers;