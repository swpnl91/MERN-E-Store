import express from "express";      // using 'import' instead of 'const... = require(...)' by changing 'type' to 'module' in package.json. It's 'commonjs' by default for you to be able to use 'const...require'
import colors from "colors";
import dotenv from "dotenv";
import morgan from "morgan";
import connectDB from './config/db.js';    // notice it's 'db.js' and not 'db' as we're using import/export instead of 'require' we also need to specify the file extension here
import authRoutes from "./routes/authRoute.js";
import categoryRoutes from "./routes/categoryRoutes.js";


import cors from "cors";


//Configure env
dotenv.config();   // since .env file is in the root folder we don't need to define a path like this 'dotenv.config({path:'...'});'

//Database config
connectDB();

//Rest object
const app = express();

//Middelwares
app.use(cors());
app.use(express.json());  // enabling json so that we can send json data with 'req/res' (instead of 'body-parser')
app.use(morgan("dev"));   // tells us abou the type of 'request (GET/POST etc.)' status code and how much time it took (in ms) for execution, in the terminal. Useful for debugging and will be removed in production

//Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);


//Rest API
app.get("/", (req, res) => {
  res.send("<h1>Welcome!</h1>");
});

//PORT
const PORT = process.env.PORT || 8080;    // 'process' comes with node.js by default

//Run server/Listen
app.listen(PORT, () => {
  console.log(
    `Server Running on port ${PORT}`.bgCyan     // .bgCyan.white comes from the 'colors' package
      .white
  );
});