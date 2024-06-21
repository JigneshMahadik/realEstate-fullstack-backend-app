const userModel = require("../Models/auth");
const jwt = require("jsonwebtoken");

// JWT Secret Key
const jwtSecretKey = "MY_JWT_SECRET_KEYECOMM123";


const validateUser = async (req, res, next) => {

  const headers = req.headers;
  const tokenFromHeaders = headers.authorization;
  /**
   * Points to be validated in token
   * 1. Token should be present
   * 2. Secret key validation (This is the same tokne that we have generated)
   * 3. Token expiry date should not be passed
   * 4. Validate the issued at date (Optional)
   * 5. Validate the user id if it is present in database
   */
  // 1
  if (!tokenFromHeaders) {
    return res.status(401).json({
      msg: "Unauthenticated user",
    });
  }

  // 2
  try {
    jwt.verify(tokenFromHeaders, jwtSecretKey);
  } catch (err) {
    return res.status(401).json({
      msg: "Unauthenticated user",
    });
  }

  // 3
  const tokenData = jwt.decode(tokenFromHeaders);
  // console.log(tokenData);

  const tokenExp = tokenData.exp;
  const now = Math.ceil(new Date().getTime() / 1_000);

  if (tokenExp < now) {
    return res.status(401).json({
      msg: "Token has been expired, Please login again",
    });
  }

  // 5
  const userId = tokenData.user;
  const User = await userModel.findById(userId);
  if (!User) {
    return res.status(401).json({
      msg: "Unauthorized user",
    });
  }
  req.user = User; // This  will be passed to other available middlewares in next sequence and api routes.
  next();
};

module.exports = validateUser;