import React from "react";
import Layout from "./../components/Layout/Layout";
import { useSearch } from "../context/search";

import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import "../styles/Search.css";




const Search = () => {
  
  const [values, setValues] = useSearch();

  const navigate = useNavigate();
  const [cart, setCart] = useCart();                    // using context to add items to cart
  
  
  
  return (
    
    <Layout title={"Search results"}>
      
      <div className="container search dashboard">
        <div className="text-center">
          
          <h1>Search Resuts</h1>
          
          <h6>
            {values?.results.length < 1
              ? "No Products Found"
              : `Found ${values?.results.length}`}
          </h6>

          <div className="d-flex flex-wrap mt-4 search-cart">
            {values?.results.map((p) => (        // We iterate through the 'values.results' array and render each product
              <div className="card m-2 search-card" style={{ width: "18rem" }} key={p._id}>
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text">
                    {p.description.substring(0, 30)}...
                  </p>
                  <p className="card-text"> $ {p.price}</p>
                  
                  {/* <button class="btn btn-primary ms-1">More Details</button>
                  <button class="btn btn-secondary ms-1">ADD TO CART</button> */}

                  <button
                    className="btn btn-info ms-1 details"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>

                  <button
                    className="btn btn-dark ms-1 add-to-cart"
                    onClick={() => {
                      setCart([...cart, p]);       // While keeping the existing products in the 'cart' array, we add a new product ('p' is the product)
                      localStorage.setItem(
                        "cart",
                        JSON.stringify([...cart, p])      // We're basically storing the cart in localStorage
                      );
                      toast.success("Item added to cart");
                    }}
                  >
                    ADD TO CART
                  </button>

                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

    </Layout>
  );
};

export default Search;