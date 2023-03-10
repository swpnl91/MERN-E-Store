import express from "express";
import {
  
  createProductController,

  getProductController,
  getSingleProductController,



  productPhotoController
  
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



// Get all products (Everyone)
router.get("/get-products", getProductController);

// Get a single product
router.get("/get-product/:slug", getSingleProductController);

// Get a photo
router.get("/product-photo/:pid", productPhotoController);






export default router;