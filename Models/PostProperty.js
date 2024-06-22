const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema({
    property_type : {       //Residential/Commercial
        type : String,
        required : true
    },
    transaction_type : {     //Rent/Sell
        type : String,
        required : true
    },
    property_name : {
        type : String,
        required : true
    },
    pincode : {
        type : Number,
        required : true
    },
    address : {
        type : String,
        required : true
    },
    propertySubtype : {
        type : String,
        required : true
    },
    price : {
        type : String,
        required : true
    },
    beds : {
        type : Number,
        required : false
    },
    bathrooms : {
        type : Number,
        required : false
    },
    furnishing : {
        type : String,
        required : false
    },
    other_details : {
        type : String,
        required : false
    },
    files : {
        type : [String],
        required : false,
    },
    userId : {
        type : mongoose.Types.ObjectId,      //its a monggose's data type.
        ref : "users"                       // Refered to users collections's user id.
    },
    sold : {
        type : String,
        default : "open",
        required : true
    }
},
{
    timestamps : true
});

const propertyModel = mongoose.model("property",propertySchema);
module.exports = propertyModel;