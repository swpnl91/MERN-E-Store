import express from "express";      // using 'import' instead of 'const... = require(...)' by changing 'type' to 'module' in package.json. It's 'commonjs' by default for you to be able to use 'const...require'
import colors from "colors";





//Rest object
const app = express();




//Rest API
app.get("/", (req, res) => {
  res.send("<h1>Welcome!</h1>");
});

//PORT
const PORT = process.env.PORT || 8080;

//Run server/Listen
app.listen(PORT, () => {
  console.log(
    `Server Running on port ${PORT}`.bgCyan
      .white
  );
});