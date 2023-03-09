import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";
import {
  categoryController,
  createCategoryController,
  

  updateCategoryController,
} from "./../controllers/categoryController.js";


const router = express.Router();


// ROUTES


// Creating a category (Admin)
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);

// Updating a category (Admin)
router.put(
  "/update-category/:id",
  requireSignIn,
  isAdmin,
  updateCategoryController
);

// Getting All Categories (Users/Admin/Everyone)
router.get("/get-category", categoryController);




export default router;