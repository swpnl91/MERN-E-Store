import express from "express";      // using 'import' instead of 'const... = require(...)' by changing 'type' to 'module' in package.json. It's 'commonjs' by default for you to be able to use 'const...require'
import colors from "colors";
import dotenv from "dotenv";



//Configure env
dotenv.config();   // since .env file is in the root folder we don't need to define a path like this 'dotenv.config({path:'...'});'


//Rest object
const app = express();




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