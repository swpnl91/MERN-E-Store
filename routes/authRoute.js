import express from "express";
import {
  loginController,
  registerController,
  
} from "../controllers/authController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";


//Router object
const router = express.Router();     // we need it if we're carrying out the routing logic in a separate file 


//ROUTING

//Routing for Registering; Method - POST
router.post("/register", registerController);     // 'registerController' is callback function from 'controllers' folder 

//Routing for Login; Method - POST
router.post("/login", loginController);

//Test routes
router.get("/test", requireSignIn, testController);


export default router;