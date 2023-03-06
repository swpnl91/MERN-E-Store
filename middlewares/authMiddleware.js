import JWT from "jsonwebtoken";
import userModel from "../models/userModel.js";

//Protected Routes (token-based)
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