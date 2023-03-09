import categoryModel from "../models/categoryModel.js";
import slugify from "slugify";


// Creating a new category (Admin)
export const createCategoryController = async (req, res) => {
  
  try {
    
    const { name } = req.body;

    // If 'name' doesn't exist
    if (!name) {
      return res.status(401).send({ message: "Category Name Is Required" });
    }

    // Check whether the category with a given name already exists or not
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return res.status(200).send({
        success: false,
        message: "Category Already Exists",
      });
    }

    // Saving the new category
    const category = await new categoryModel({
      name,
      slug: slugify(name),         // the 'slugify' package transforms the given name. Uses '-' by default, unless specified otherwise. 
    }).save();

    res.status(201).send({
      success: true,
      message: "New Category Created",
      category,
    });
  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      error,
      message: "Error in Category",
    });
  }
};

// Updating a category (Admin)
export const updateCategoryController = async (req, res) => {
  
  try {
    
    const { name } = req.body;
    const { id } = req.params;      // we get the 'id' from the url
    
    // Finding the 'category' by 'id'
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }      // needs to be done for updating items 
    );
    
    res.status(200).send({
      success: true,
      messsage: "Category Updated Successfully",
      category,
    });
  } catch (error) {
    
    console.log(error);
    
    res.status(500).send({
      success: false,
      error,
      message: "There was an error while updating the category",
    });
  }
};

// Getting all categories (Everyone)
export const categoryController = async (req, res) => {
  try {
    
    // Getting all categories
    const category = await categoryModel.find({});
    
    res.status(200).send({
      success: true,
      message: "List Of All Categories",
      category,
    });
  } catch (error) {
    
    console.log(error);
    
    res.status(500).send({
      success: false,
      error,
      message: "There was an error while getting the categories",
    });
  }
};