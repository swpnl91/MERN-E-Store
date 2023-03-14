import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";




const Search = () => {
  
  const [values, setValues] = useSearch();
  
  
  
  return (
    <Layout title={"Search results"}>
      
      <div className="container">
        <div className="text-center">
          
        </div>
      </div>

    </Layout>
  );
};

export default Search;