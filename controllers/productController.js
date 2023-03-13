import productModel from "../models/productModel.js";
import categoryModel from "../models/categoryModel.js";


import fs from "fs";
import slugify from "slugify";

import dotenv from "dotenv";


dotenv.config();



// Creating a new product (Admin)      *********************////////**************
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
      case photo && photo.size > 1000000:   // 1 (for 1 MB) * 1024 * 1024, the value is in bytes?!!!!!!!********
        return res
          .status(500)
          .send({ message: "Photo size should be less then 1MB" });
    }

    const product = new productModel({ ...req.fields, slug: slugify(name) });     // retaining all the fields by using '...req.fields'. It doesn't include 'shipping' (as it's not mandatory to add it as per 'productmodels')
    
    if (photo) {
      // 'photo.path' and 'photo.type' are included in 'req.files' when we upload a photo on the frontend using "enctype='multipart/form-data'"
      product.photo.data = fs.readFileSync(photo.path);     // 'fs.readFileSync(photo.path)' reads file in a synchronous way. It basically 'reads' the content of the file (synchronously) and stores it in 'product.photo.data'. As for what that 'content' looks like you can have a look at it in the database, in the 'products' collection.
      product.photo.contentType = photo.type;
    }

    await product.save();    // Photos are also saved
    
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      product,        // As a reminder, this 'product' includes the 'photo' field but doesn't include the 'shipping' field
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

// Get all products (Everyone)         **********////////**************
export const getProductController = async (req, res) => {
  
  try {
    
    const products = await productModel
      .find({})
      .populate("category")      // '.populate('category')' basically also gives us details about the property that's passed (in this case 'category'). Otherwise it'd have just returned the 'id' of 'category'. 
      .select("-photo")          // as 'photo' (pictures) increases the size of the 'request (req)' and hence takes a lot of time to load (we'll be using/calling a different API - created below - from frontend, for getting photos). '-photo' ensures it gets everything but photos.
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

// Get a photo
export const productPhotoController = async (req, res) => {
  
  try {
    
    const product = await productModel.findById(req.params.pid).select("photo");       // '.select("photo")' - this basically ONLY gets the photo
    
    // if 'product.photo.data' exists
    if (product.photo.data) {       // 'product.photo.data' is basically the actual 'data' that translates into 'photo'
      res.set("Content-type", product.photo.contentType);       // setting the 'Content-type'
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    
    console.log(error);
    
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error,
    });
  }
};

// Delete a product
export const deleteProductController = async (req, res) => {
  
  try {
    
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");       // '.select("-photo")' only ensures the 'photo' field is not fetched but it's deleted anyway when the product is deleted     
    
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    
    console.log(error);
    
    res.status(500).send({
      success: false,
      message: "Error while deleting the product",
      error,
    });
  }
};

// Upate a product (Admin)
export const updateProductController = async (req, res) => {
  
  try {
    
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    
    const { photo } = req.files;
    
    // Validations (same as those that we used for 'creating a product')
    switch (true) {
      case !name:
        return res.status(500).send({ message: "Name is Required" });
      case !description:
        return res.status(500).send({ message: "Description is Required" });
      case !price:
        return res.status(500).send({ message: "Price is Required" });
      case !category:
        return res.status(500).send({ message: "Category is Required" });
      case !quantity:
        return res.status(500).send({ message: "Quantity is Required" });
      // case !photo:
      //   return res.status(500).send({ message: "Photo Is Required" });            // Had to remove this case because otherwise everytime the product is updated without changing the photo, it threw an error.
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .send({ message: "Photo size should be less then 1MB" });
    }

    const product = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }       // needed for updating in mongoose
    );

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();

    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    
    console.log(error);
    
    res.status(500).send({
      success: false,
      error,
      message: "There was an error while updating the product",
    });
  }
};

// Filtering products
export const productFiltersController = async (req, res) => {
  
  try {
    
    const { checked, radio } = req.body;
    
    
    let args = {};    // since we have multiple queries (to be passed to the DB) we're creating an 'args' object
    
    // It can happen that the user wants to filter the products list based on category AND price, ONLY category, OR ONLY price. Hence we're using conditions below
    if (checked.length > 0) args.category = checked;     // 'checked' is an array with selected/checked categories (for filtering)
    
    // Only 'radio.length' is used because we're gonna get only one array with 2 elements in it. As only one price range can be chosen.
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };       // 'radio' is an array with 2 elements/values (that represent the price range) 
    
    const products = await productModel.find(args);
    
    res.status(200).send({
      success: true,
      products,
    });
  } catch (error) {
    
    console.log(error);
    
    res.status(400).send({
      success: false,
      message: "There was an error while filtering products",
      error,
    });
  }
};

// Controller for keeping product count
export const productCountController = async (req, res) => {
  try {
    const total = await productModel.find({}).estimatedDocumentCount();
    res.status(200).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "Error in product count",
      error,
      success: false,
    });
  }
};