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