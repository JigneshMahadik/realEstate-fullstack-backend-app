const express = require("express");
const authRoutes = require("./Routes/auth");
const { default: mongoose } = require("mongoose");
const cors = require("cors");
const postPropertyRoutes = require("./Routes/PostProperty");
const validateUser = require("./Middlewares/auth");
const listPropertyRoutes = require("./Routes/ListProperty");
const path = require("path");


const app = express();

app.use(express.json());

// Use the CORS middleware
app.use(cors({
    // origin: 'https://fullstack-ecomm-frontend-app.vercel.app', // Replace with the origin you want to allow
    // origin : "http://localhost:3000",
    origin : "https://real-estate-fullstack-frontend-app.vercel.app",
    methods : ["GET", "POST", "PUT", "DELETE"],
    // credentials : true,
    allowedHeaders: 'Content-Type,Authorization',
    // optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
}));



app.use(authRoutes);
// Serve static files from the "filesUploaded" directory
app.use('/filesUploaded', express.static(path.join(__dirname, 'filesUploaded')));

app.use(listPropertyRoutes);        //Here sequence matters we cant write this line below "app.use(validateUser,postPropertyRoutes); because of middleware"
app.use(validateUser,postPropertyRoutes);

// DB Connection
// mongoose.connect("mongodb://localhost:27017/realEstateApp")
mongoose.connect("mongodb+srv://jignesh:dUaszhl26B0rpW0f@cluster0.s7hzif4.mongodb.net")
.then(()=>{ console.log("DB Connection Successful"); })
.catch((error)=>{ console.log("Error while DB Connection !", error); })

app.listen(10000,()=>{
    console.log("Server is up and running on port : 8082");
})