const path = require("path");
const multer = require("multer");
const propertyModel = require("../Models/PostProperty");
const User = require("../Models/auth");

const express = require("express");
const app = express();
// app.use(express.urlencoded());
const nodemailer = require('nodemailer');

require('dotenv').config();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// const uploadDirePath = path.join(__dirname, "..", "filesUploaded");

// console.log(uploadDirePath);

// const storage = multer.diskStorage({
//     destination : (req,file, cb)=>{
//         cb(null, uploadDirePath);
//     },
//     filename : (req,file,cb)=>{
//         const fileName = file.originalname;
//         cb(null, fileName);
//     }
// });
    
// const upload = multer({
//     storage : storage
// }).array("files");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "cloudinary_real_estate", // Folder where images will be stored
        allowed_formats: ["jpg", "png", "jpeg"]
    }
});

const upload = multer({ storage: storage }).array("files");

// Create a new post in DB.
const postProperty = (req,res)=>{
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
                area : req.body.area,
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


// Add requests
const addRequests = async (req,res)=>{
    try {
        const propid = req.query.propId;
        const userid = req.body.userId;
        const msg = req.body.message;
        
        // Fetched user details from user schema.
        const user = await User.findById(userid).select("first_name email mobile_number");
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found"
            });
        }

        // Adding whole data to property schema 
        const response = await propertyModel.findByIdAndUpdate(propid,
            {
                $push : {
                    requests: {
                        message : msg,
                        userId : userid,
                        first_name : user.first_name,
                        email : user.email,
                        mobile_number : user.mobile_number
                    }
                }
        });

        
        res.json({
            status : true,
            message : "Message added successfully"
        })
        
    } 
    catch (error) {
        console.log("Error while inserting the message !",error);
        res.status(500).json({
            status : false,
            message : "Error while inserting the message !",
            Error : error
        })
    }
}


const fetchRequests = async (req,res)=>{
    try {
        // console.log("id is :",req.query.propId);
        // const resp = await propertyModel.findById(req.query.propId).populate({
        //     message,first_name,email,mobile_number
        // });
        const propId = req.query.propId;
        const property = await propertyModel.findById(propId)
        .populate({
            path: 'requests.userId',
            model: 'users',
            select: 'first_name email mobile_number'
        })
        .select('requests.message requests.userId');

        // console.log(response)
        return res.json({
            status : true,
            message : "Request messages fetched successfully",
            data : property
        });    
    } 
    catch (error) {
        console.log("error si :", error);
        return res.json({
            status : false,
            message : "Error while fetching the request messages from DB !"
        })
    
    }
}

// Fetch property list that has been inquired by particular client.
const getRequestedProperties = async (req,res)=>{
    try {
        const userid = req.query.userid;
        const resp = await propertyModel.find({
            requests: {
                $elemMatch :{
                    userId : userid
                }
            }
        }
        );
        res.json({
            status : true,
            message : "Requested property list fetched successfully",
            data : resp
        })    
    } 
    catch (error) {
        console.log(error);   
    }
}


const editPropertyDetails = async (req,res)=>{
    try {
        const resp = await propertyModel.findByIdAndUpdate(req.query.propId,{
            'property_type' : req.body.property_type,
            'transaction_type' : req.body.transaction_type,
            'property_name' : req.body.property_name,
            'pincode' : req.body.pincode,
            'address' : req.body.address,
            'propertySubtype' : req.body.propertySubtype,
            'price' : req.body.price,
            'beds' : req.body.beds,
            'bathrooms' : req.body.bathrooms,
            'furnishing' : req.body.furnishing,
            'other_details' : req.body.other_details,
            'area' : req.body.area
        });
        console.log("Data updated successfully");
        res.json({
            status : true,
            message : "Data updated successfully"
        })
    } 
    catch (error) {
        console.log("Error while updating the data !");
        res.json({
            status : false,
            message : "Error while updating the data !"
        })    
    }
}


const deleteProperty = async (req,res)=>{
    const userid = req.query.userId;
    const propertyId = req.query.propId;
    const updatedProperty = await propertyModel.findByIdAndUpdate(
    propertyId,
    {
        $pull: {
            requests: { userId: userid }
        }
    });
    res.json({
        status : true,
        message : "Requested property has been removed successfully."
    })
}


const sendMail = async (req,res)=>{
    try{
        const response = await propertyModel.findById(req.body.propertyId).select("userId").populate("userId");
        // console.log("Response is : ",response.userId.email);

        // Create a transporter using SMTP
        const transporter = nodemailer.createTransport({
            service : "Gmail",
            auth :{
                user : process.env.EMAIL,
                pass : process.env.PASSWORD
            }
        });

        // Email options
        const mailOptions = {   
            from: process.env.EMAIL,
            to: response.userId.email,
            subject: "Customer Requested the Property",
            text: req.body.messages
        };

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Error sending email');
            } else {
            console.log('Email sent:', info.response);
            res.send('Email sent successfully');
            }
        });
        res.json({
            status : true,
            message : "Email has been sent successfully"
        })

    }
    catch(error){
        console.log("Error while sending the mail !",error);
        res.json({
            status : false,
            message : "Error while sending the mail !"
        });
    }
}

// Export all the controllers.
const postPropertyControllers = {
    postProperty,
    getPropertiesByUserID,
    deletePropertyByPropertyID,
    updateSold,
    addRequests,
    fetchRequests,
    getRequestedProperties,
    editPropertyDetails,
    deleteProperty,
    sendMail
}

module.exports = postPropertyControllers;