import express from "express";
import {
  registerController,
  
} from "../controllers/authController.js";




//Router object
const router = express.Router();     // we need it if we're carrying out the routing logic in a separate file 


//ROUTING

//Routing for Registering; Method - POST
router.post("/register", registerController);     // 'registerController' is callback function from 'controllers' folder  


export default router;