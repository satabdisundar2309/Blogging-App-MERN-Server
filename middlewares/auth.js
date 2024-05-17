const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const { ErrorHandler } = require("../middlewares/error");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
require("dotenv").config();

const authenticate = catchAsyncErrors(async (req, res, next) => {
  let token = req.header("Authorization")
  if (!token) {
    return next(new ErrorHandler("User not authenticated", 400));
  }

  token = token.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  if (!decoded) {
    return next(new ErrorHandler("User not authenticated", 400));
  }

  req.user = await userModel.findById(decoded.id);
  next();
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(
          `User with this role(${req.user.role}) not allowed to access this resource`
        )
      );
    }
    next();
  };


};

module.exports = {authenticate, authorize}
