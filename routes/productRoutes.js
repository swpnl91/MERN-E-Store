import express from "express";
import {
  
  createProductController,
  
} from "../controllers/productController.js";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";




const router = express.Router();


// ROUTES


// Create a product (Admin)
router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  
  createProductController
);






export default router;