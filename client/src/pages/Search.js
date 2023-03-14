import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";




const Search = () => {
  
  const [values, setValues] = useSearch();
  
  
  
  return (
    <Layout title={"Search results"}>
      
      <div className="container">
        <div className="text-center">
          
          <h1>Search Resuts</h1>
          
          <h6>
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length}`}
          </h6>

          

        </div>
      </div>

    </Layout>
  );
};

export default Search;