import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";




const Products = () => {
  
  const [products, setProducts] = useState([]);   // basically getting list of products as an array

  // Function to get all the products
  const getAllProducts = async () => {
    
    try {
      const { data } = await axios.get("/api/v1/product/get-products");
      setProducts(data.products);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while getting all products");
    }
  };

  // useEffect function to call 'getAllProducts()' to populate the page with products initially 
  useEffect(() => {
    getAllProducts();
  }, []);



  return (
    <Layout>
      
      <div className="row dashboard">
        
        <div className="col-md-3">
          <AdminMenu />
        </div>
        
        <div className="col-md-9 ">
          
          <h1 className="text-center">List of Products</h1>
          
          <div className="d-flex flex-wrap">
            
            {products?.map((p) => (
              
              <Link
                key={p._id}
                to={`/dashboard/admin/product/${p.slug}`}
                className="product-link"
              >
                <div className="card m-2" style={{ width: "18rem" }}>
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">{p.description}</p>
                  </div>
                </div>
              </Link>

            ))}

          </div>

        </div>

      </div>

    </Layout>
  );
};

export default Products;