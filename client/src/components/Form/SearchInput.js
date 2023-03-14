import React from "react";
import { useSearch } from "../../context/search";
import axios from "axios";
import { useNavigate } from "react-router-dom";



const SearchInput = () => {
  
  const [values, setValues] = useSearch();      // Comes from 'search.js' context. 'values' is an object with 'keyword' (string) & 'results' (array) as properties.
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      
      const { data } = await axios.get(                 // the data that we get is an array of products 
        `/api/v1/product/search/${values.keyword}`
      );
      
      setValues({ ...values, results: data });      
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    
    <div>
      
      <form
        className="d-flex search-form"
        role="search"
        onSubmit={handleSubmit}
      >
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={values.keyword}        // The 'value' in the search bar is set to whatever 'value' is held in 'values.keyword' (initially it'll be an empty string)
          onChange={(e) => setValues({ ...values, keyword: e.target.value })}    // Once we type the keyword in the search bar, it sets the 'values.keyword' to 'e.target.value'
        />
        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form>

    </div>
  );
};

export default SearchInput;