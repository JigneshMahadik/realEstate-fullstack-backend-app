const userModel = require("../Models/auth");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
// JWT Secret Key
const jwtSecretKey = "MY_JWT_SECRET_KEYECOMM123";

const Signup = async (req,res)=>{
    try {
        // Generate hash password.
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(req.body.password,salt);

        // Create instance of model data and saved it.
        const newUser = new userModel({ ...req.body, password : hashPassword });
        await newUser.save();

        res.json({
            status : true,
            message : "Registration Successful",
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            status : false,
            message : "Error while inserting the data !"
        })    
    }
}
const Login = async (req,res)=>{
    console.log("Login API called");

    const user = await userModel.findOne({ email : req.body.email });
    
    // Check if user exist
    if(!user){
        return res.json({
            status : false,
            message : "User not found !"
        })
    }

    // Check password is valid or not.
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

    // If password is valid then provide a Token.
    const tokenExpiry = Math.ceil(new Date().getTime() / 1_000) + 3600; // 1hr validity
    const payload = {
      user: user._id,
      name: user.first_name,
      exp: tokenExpiry,
    };
    const token = jwt.sign(payload,jwtSecretKey);

    if(isPasswordValid){
        // console.log(token);
        // localStorage.set("token",token); 
        return res.json({
            token
        })
    }
    if(!isPasswordValid){
        return res.json({
            status : false,
            message : "Wrong password entered !"
        })
    }
}

const getData = (req,res)=>{
    res.json({
        message : "jack is here"       
    })
}

const authControllers = {
    Signup,
    Login,
    getData
}

module.exports = authControllers;