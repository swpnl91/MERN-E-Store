import userModel from "../models/userModel.js";


import { hashPassword } from "./../helpers/authHelper.js";




export const registerController = async (req, res) => {
  try {

    const { name, email, password, phone, address, answer } = req.body;

    //Validations
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

    //Check whether user exists
    const existingUser = await userModel.findOne({ email });

    //If user already exists
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "User Already Registered. Please Login",
      });
    }

    //Registering user by hashing the password
    const hashedPassword = await hashPassword(password);     // 'hashpassword' is the function
    
    //Saving the user to DB
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