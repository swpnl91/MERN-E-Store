import { useState, useEffect } from "react";
import axios from "axios";

export default function useCategory() {       // As per naming conventions we name this hook 'use...' 
  
  const [categories, setCategories] = useState([]);

  // Function to get categories
  const getCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-categories");
      setCategories(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect for calling 'getCategories()'
  useEffect(() => {
    getCategories();
  }, []);

  return categories;
}