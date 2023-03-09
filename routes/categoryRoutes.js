import express from "express";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";



const router = express.Router();


// ROUTES


// Creating a category (Admin)
router.post(
  "/create-category",
  requireSignIn,
  isAdmin,
  createCategoryController
);




export default router;