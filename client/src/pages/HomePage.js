import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useCart } from "../context/cart";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "./../components/Layout/Layout";
import { AiOutlineReload } from "react-icons/ai";
import "../styles/Homepage.css";



const HomePage = () => {
  

  const navigate = useNavigate();
  const [cart, setCart] = useCart();                    // using context to add items to cart
  const [products, setProducts] = useState([]);         // Array of products on a given page
  const [categories, setCategories] = useState([]);     // Array of all the categories
  const [checked, setChecked] = useState([]);      // Is used to store all the categories that are checked, in an array
  const [radio, setRadio] = useState([]);          // Is used to store the price range for filtering on the basis of price of the products
  const [total, setTotal] = useState(0);            // To keep a tab on the quantity/total count of the products
  const [page, setPage] = useState(1);              // To keep a tab on the page number
  const [loading, setLoading] = useState(false);    // To show the 'loading' state

  // Function to get all categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-categories");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect to call getAllCategory/getTotal
  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  // Function to get all products
  const getAllProducts = async () => {
    
    try {
      
      setLoading(true);
      
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);    // Basically gets all products on a given 'page' and stores it in the 'products' array ('setProducts(data.products)')
      
      setLoading(false);
      
      setProducts(data.products);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

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
      
      setLoading(true);
      
      const { data } = await axios.get(`/api/v1/product/product-list/${page}`);
      
      setLoading(false);
      
      setProducts([...products, ...data?.products]);    // we're basically retaining the existing products AND appending the new products (from the next page) to the first one. So that all the products (even from the previous pages) are shown
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  // Function for filtering by categories
  const handleFilter = (value, id) => {
    let all = [...checked];      // basically takes the previously stored categories (from 'checked' array) and stores it in 'all'
    if (value) {                 // This condition takes care of checking the boxes
      all.push(id);
    } else {                     // The 'else' condition takes care of 'unchecking' the boxes wherein only the 'id' is received, the 'value' isn't sent?!!!!!
      all = all.filter((c) => c !== id);
    }
    setChecked(all);            // We assign the final filtered 'all' array to 'checked' again
  };

  // useEffect for rendering all products conditionally
  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();    // basically adds a condition that only calls 'getAllProducts()' when 'checked'/'radio' arrays are empty or in other words there's no filter applied
  }, [checked.length, radio.length]);

  // useEffect for calling filterProduct()
  useEffect(() => {
    if (checked.length || radio.length) filterProduct();  // basically adds a condition that only calls 'filterProduct()' when 'checked'/'radio' arrays are NOT empty or in other words there IS a filter applied
  }, [checked, radio]);

  // Function for getting filtered product
  const filterProduct = async () => {
    
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <Layout title={"Our Products - Best offers!"}>
      
      {/* banner image */}
      <img
        src="/images/banner.jpg"
        className="banner-img"
        alt="bannerimage"
        width={"100%"}
      />
      {/* banner image */}

      <div className="container-fluid row mt-3 home-page">
        
        <div className="col-md-3 filters">
          
          {/* Category filter */}
          <h4 className="text-center">Filter By Category</h4>
          
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              // <Checkbox /> basically gets us those checkboxes that we can use to filter according to the categories
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}    // 'e.target.checked' is the target value or 'category name'. We also need its 'id'
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          
          {/* Price filter */}
          <h4 className="text-center mt-4">Filter By Price</h4>
          
          <div className="d-flex flex-column">
            {/* Since it's a radio button only one range will be selected  */}
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  {/* 'p.array' is an array with the price range which is passed to 'onChange' in <Radio.Group /> */}
                  <Radio value={p.array}>{p.name}</Radio>  
                </div>
              ))}
            </Radio.Group>
          </div>

          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}    // we're basically refreshing/reloading the page that removes all the applied filters
            >
              RESET FILTERS
            </button>
          </div>

        </div>

        <div className="col-md-9 ">
          
          <h1 className="text-center">All Products</h1>
          
          <div className="d-flex flex-wrap">
            
            {products?.map((p) => (       
              
              <div className="card m-2" key={p._id}>
                
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />

                <div className="card-body">
                  
                  <div className="card-name-price">
                    <h5 className="card-title">{p.name}</h5>
                    <h5 className="card-title card-price">
                      {p.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                      })}
                    </h5>
                  </div>

                  <p className="card-text ">
                    {/* limiting the description  */}
                    {p.description.substring(0, 60)}... 
                  </p>

                  <div className="card-name-price">
                    
                    <button
                      className="btn btn-info ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>

                    <button
                      className="btn btn-dark ms-1"
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

              </div>

            ))}

          </div>
          
          <div className="m-2 p-3">
            {products && products.length < total && radio.length === 0 && checked.length === 0 && (      // If the 'products.length === total' that means we've only 6 products (set in backend for displaying max 6 products per page) in DB/inventory then 'Load more' button won't be shown
              <button
                className="btn loadmore"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);    // changes 'page' to the next one and when you reload/refresh it goes back to the 1st page as the default value of 'page' (the state) is '1'
                }}
              >
                {loading ? (
                  "Loading ..."
                ) : (
                  <>
                    {" "}
                    Load more <AiOutlineReload />
                  </>
                )}
              </button>
            )}
          </div>

        </div>

      </div>

    </Layout>
  );
};

export default HomePage;