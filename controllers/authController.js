import userModel from "../models/userModel.js";


import { comparePassword, hashPassword } from "./../helpers/authHelper.js";
import JWT from "jsonwebtoken";


// POST Register
export const registerController = async (req, res) => {
  try {

    const { name, email, password, phone, address, answer } = req.body;

    // Validations
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res.send({ message: "Email is Required" });
    }
    if (!password) {
      return res.send({ message: "Password is Required" });
    }
    if (!phone) {
      return res.send({ message: "Phone no is Required" });
    }
    if (!address) {
      return res.send({ message: "Address is Required" });
    }
    if (!answer) {
      return res.send({ message: "Answer is Required" });
    }

    // Check whether user exists
    const existingUser = await userModel.findOne({ email });

    // If user already exists
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User Already Registered. Please Login",
      });
    }

    // Registering user by hashing the password
    const hashedPassword = await hashPassword(password);     // 'hashpassword' is the function
    
    // Saving the user to DB
    const user = await new userModel({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    }).save();

    res.status(201).send({
      success: true,
      message: "User Registered Successfully",
      user,
    });
  } catch (error) {
    
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Registration Failed",
      error,
    });
  }
};

// POST Login
export const loginController = async (req, res) => {
  try {
    
    const { email, password } = req.body;

    // Validation checks
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email/password",
      });
    }

    // Check whether user exists or not
    const user = await userModel.findOne({ email });
    
    // If user doesn't exist
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email is not registered",
      });
    }

    // Check whether password matches or not
    const match = await comparePassword(password, user.password);
    
    // If password doesn't match
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid Password",
      });
    }

    // JWT (token) creation
    const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",        // expires in 1 day
    });

    res.status(200).send({
      success: true,
      message: "Successfully Logged in",
      user: {                         
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });

  } catch (error) {
    
    console.log(error);
    
    res.status(500).send({
      success: false,
      message: "Login failed",
      error,
    });
  }
};

// Test Controller
export const testController = (req, res) => {
  try {
    res.send("Protected Routes");
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
};