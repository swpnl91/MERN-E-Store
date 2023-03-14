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
      
      <div className="container mt-3 category">
        
        <h4 className="text-center">Category - {category?.name}</h4>
        
        <h6 className="text-center">{products?.length} result found </h6>
        
        <div className="row">
          <div className="col-md-9 offset-1">
            
          </div>
        </div>

      </div>

    </Layout>
  );
};

export default CategoryProduct;