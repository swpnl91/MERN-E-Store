import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";



const ProductDetails = () => {
  
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);


  return (
    <Layout>
      
      <div className="row container product-details">
        
        <div className="col-md-6">
          <img
            src={`/api/v1/product/product-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
            height="300"
            width={"350px"}
          />
        </div>

        <div className="col-md-6 product-details-info">
          
          <h1 className="text-center">Product Details</h1>
          
          <hr />
          
          <h6>Name : {product.name}</h6>
          
          <h6>Description : {product.description}</h6>
          
          <h6>
            Price :
            {product?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </h6>

          <h6>Category : {product?.category?.name}</h6>
          
          <button class="btn btn-secondary ms-1">ADD TO CART</button>
        </div>

      </div>

      

    </Layout>
  );
};

export default ProductDetails;