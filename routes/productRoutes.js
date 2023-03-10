import express from "express";
import {
  
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,



  productPhotoController,
  


  updateProductController,
} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";



const router = express.Router();


// ROUTES


// Create a product (Admin)
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),    // Used for 'multipart/form-data' file upload (which is done on the front-end)
  createProductController
);

// Update a product (Admin)
router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),        // In addition to what's mentioned above, we get 'req.fields' and 'req.files' from 'formidable'
  updateProductController
);

// Get all products (Everyone)
router.get("/get-products", getProductController);

// Get a single product
router.get("/get-product/:slug", getSingleProductController);

// Get a photo
router.get("/product-photo/:pid", productPhotoController);     // based 'pid' (product id)

// Delete product (Admin)
router.delete("/delete-product/:pid", 
  requireSignIn,
  isAdmin, 
  deleteProductController
);






export default router;