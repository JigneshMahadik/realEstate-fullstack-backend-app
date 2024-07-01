const propertyModel = require("../Models/PostProperty");


// Get all the posts from DB
const getAllProperties = async (req,res)=>{
    const pageno = req.query.pageNo;
    const data = await propertyModel.find().skip(pageno * 1).limit(3);
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



const searchKeyword = async (req,res)=>{
    try{
        const { keyword = '', transactionType } = req.body;
        if (!transactionType) {
            return res.status(400).json({
                status: false,
                message: "Transaction type is required"
            });
        }
        const query = {
            $and: [
                {
                    $or: [
                        { property_name: { $regex: keyword, $options: 'i' } },
                        { address: { $regex: keyword, $options: 'i' } }
                    ]
                },
                { transaction_type: transactionType }
            ]
        };
    
        const properties = await propertyModel.find(query);
        if(properties.length > 0){
            console.log("Searched property list fetched successfully");
            return res.json({
                status : true,
                message : "Searched property list fetched successfully",
                data : properties
            })
        }
        else{
            console.log("No Searched property list found !");
            return res.status(404).json({
                status : false,
                message : "No Searched property list found !",
            })
        }
    
    }
    catch(error){
        console.log("Error while searching the property",error);
        res.json({
            status : false,
            message : "Error while searching the property"
        })
    }
    res.json({
        status : true,
        message : "Property list Searched successful"
    })
}



// Export all the controllers.
const listPropertyControllers = {
    getAllProperties,
    getPropertyById,
    searchKeyword
}

module.exports = listPropertyControllers;