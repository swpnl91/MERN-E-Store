import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";




const CategoryProduct = () => {
  
  
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);


  return (
    <Layout>
      
    </Layout>
  );
};

export default CategoryProduct;