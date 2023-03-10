import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";


import fs from "fs";
import slugify from "slugify";

import dotenv from "dotenv";


dotenv.config();



// Creating a new product (Admin)      *****************************////////**************
export const createProductController = async (req, res) => {
  try {
    
    const { name, description, price, category, quantity, shipping } =
      req.fields;     // 'req.fields' (instead of req.body) comes from 'formidable' which is passed and called as a middleware in 'productRoutes.js'
    
    const { photo } = req.files;     // 'req.files' (instead of req.body) comes from 'formidable' which is passed and called as a middleware in 'productRoutes.js'
    
    // Validation for whether the above fields exist or not
    switch (true) {    // 'true' is compared against each case
      case !name:
        return res.status(500).send({ message: "Name Is Required" });
      case !description:
        return res.status(500).send({ message: "Description Is Required" });
      case !price:
        return res.status(500).send({ message: "Price Is Required" });
      case !category:
        return res.status(500).send({ message: "Category Is Required" });
      case !quantity:
        return res.status(500).send({ message: "Quantity Is Required" });
      case !photo:
        return res.status(500).send({ message: "Photo Is Required" });
      case photo && photo.size > 1000000:   // 1 (for 1 MB) * 1024 * 1024, the value is in bytes?!!!!!
        return res
          .status(500)
          .send({ message: "Photo size should be less then 1MB" });
    }

    const product = new productModel({ ...req.fields, slug: slugify(name) });     // retaining all the fields by using '...req.fields'. It includes 'shipping' too?!!!!
    
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);     // 'fs.readFileSync(photo.path)' reads file in a synchronous way
      product.photo.contentType = photo.type;
    }

    await product.save();    // Photos are also saved
    
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    
    console.log(error);
    
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating the product",
    });
  }
};

// Get all products (Everyone)
export const getProductController = async (req, res) => {
  
  try {
    
    const products = await productModel
      .find({})
      .populate("category")      // '.populate('category')' basically also gives us details about the property that's passed (in this case 'category'). Otherwise it'd have just returned the 'id' of 'category'. 
      .select("-photo")          // as 'photo' (pictures) increases the size of the 'request (req)' and hence takes a lot of time to load (we'll be using different API for getting photos). '-photo' ensures it doesn't get photos.
      .limit(12)                  // adds a limit for number of products to be shown at a time
      .sort({ createdAt: -1 });     // This ('-1') is done to sort it in a descending order by using its 'createdAt' field
    
      res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "List of all Products ",
      products,
    });
  } catch (error) {
    
    console.log(error);
    
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};

// Get a single product (Everyone)
export const getSingleProductController = async (req, res) => {
  
  try {
    
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")        // removing 'photo' for reasons mentioned above 
      .populate("category");  // it basically populates the 'category' (with its details) field instead of just getting its 'id'
    
      res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    
    console.log(error);
    
    res.status(500).send({
      success: false,
      message: "Error while getting the product",
      error,
    });
  }
};