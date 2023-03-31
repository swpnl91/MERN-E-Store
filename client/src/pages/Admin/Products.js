import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { AiOutlineReload } from "react-icons/ai";
import "../../styles/Products.css";




const Products = () => {
  
  const [products, setProducts] = useState([]);   // basically getting list of products as an array

  const [page, setPage] = useState(1);              // To keep a tab on the page number
  const [total, setTotal] = useState(0);            // To keep a tab on the quantity/total count of the products

  // Function to get all the products
  const getAllProducts = async () => {
    
    try {
      // const { data } = await axios.get("/api/v1/product/get-products");
      
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);    // Basically gets all products on a given 'page' and stores it in the 'products' array ('setProducts(data.products)')

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


  // useEffect to call getTotal()
  useEffect(() => {
    getTotal();
  }, []);

  // Function to get total product count
  const getTotal = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/product-count");
      setTotal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect for calling loadMore()
  useEffect(() => {
    if (page === 1) return;  // 'loadMore()' is not called while the user is on the first page 
    loadMore();
  }, [page]);        // Everytime the dependency - 'page' changes 'loadMore()' is called thus appending the new list of products from the next page to the existing one 

  // Function for loading more products
  const loadMore = async () => {
    
    try {
    
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      
      setProducts([...products, ...data?.products]);    // we're basically retaining the existing products AND appending the new products (from the next page) to the first one. So that all the products (even from the previous pages) are shown
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while loading all products");
    }
  };



  return (
    <Layout>
      
      <div className="row dashboard products">
        
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
                    src={`/api/v1/product/product-photo/${p._id}`}     // Hits a separate API (that we've already created) just to get the photo.
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

          <div className="m-2 p-3">
            {products && products.length < total && (      // If the 'products.length === total' that means we've only 6 products (set in backend for displaying max 6 products per page) in DB/inventory then 'Load more' button won't be shown. 
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);    // changes 'page' to the next one and when you reload/refresh it goes back to the 1st page as the default value of 'page' (the state) is '1'
                }}
              >
                <>
                  {" "}
                  Load more <AiOutlineReload />
                </>
              </button>
            )}
          </div>

        </div>

      </div>

    </Layout>
  );
};

export default Products;