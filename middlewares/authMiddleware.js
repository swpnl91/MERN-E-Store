import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

// For token-based Protected Routes
export const requireSignIn = async (req, res, next) => {      // next() is used by middlewares so that the code execution can continue further
  try {
    const decode = JWT.verify(
      req.headers.authorization,     // since token is in 'req.headers.authorization' (similar to 'req.body')
      process.env.JWT_SECRET         // uses the secret key to verify the token
    );
    req.user = decode;
    next();   // after processing of 'req(request)', 'next()' gets validated and only then 'res(response)' is sent
  } catch (error) {
    console.log(error);
  }
};

// For Admin access
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);    // we get the 'user' from 'loginController'
    
    // If the user is NOT an Admin
    if (user.role !== 1) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized Access",
      });
    } else {
      next();     // If the user IS an Admin then 'next()' gets validated and further execution of the code takes place
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      error,
      message: "Error in the middelware for Admin access",
    });
  }
};