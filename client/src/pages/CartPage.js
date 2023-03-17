import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";

import axios from "axios";
import toast from "react-hot-toast";





const CartPage = () => {
  
  const [auth, setAuth] = useAuth();     // For checking whether the user is logged in or not
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");    // For getting/setting the client token for payment gateway 
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

  // Function to calculate total price of the products in the cart
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        total = total + item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
    }
  };


  // Remove/Delete item from the cart
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];     // creating a variable so as not to change the 'cart' array directly
      let index = myCart.findIndex((item) => item._id === pid);      // find the index of the product that has the same 'id' as that which is passed in the function ('p._id/pid')
      myCart.splice(index, 1);    // basically removes the item at the given index from the array
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));     // saving the new array with the item removed, in localStorage
    } catch (error) {
      console.log(error);
    }
  };

  // Getting payment gateway token 
  const getToken = async () => {
    try {
      const { data } = await axios.get("/api/v1/product/braintree/token");
      setClientToken(data?.clientToken);        // We get the 'clientToken' in 'data' when the 'get' request (to the API) is successful
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect() to call 'getToken()'
  useEffect(() => {
    if (auth?.token) {     ////////////////////// Check whether 'if' condition is needed or not ////////////////////////
      getToken();         // Just so that initially it's called and the 'clientToken' is set
    }
  }, [auth?.token]);     // Generate (call 'getToken()') if the user is logged in (auth.token)


  return (

    <Layout>
      
      <div className=" cart-page">
        
        <div className="row">
          <div className="col-md-12">
            
            <h1 className="text-center bg-light p-2 mb-1">
              {/* Condition for checking whether the user is logged in or not */}
              {!auth?.user
                ? "Hello Guest!"
                : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {/* There are two conditions (ternary operators) used. One within the other (nested).  */}
                {/* Notice that the second condition (the one with 'Please login...') is enclosed in '${}'. It won't consider it to be 'nested' otherwise.  */}
                {/* If 'cart?.length' exists/ If cart?.length > 0 */}
                {cart?.length
                  ? `You have ${cart.length} item/items in your cart. ${
                      auth?.token ? "" : "Please login to checkout!"
                    }`
                  : " Your Cart Is Empty"}
              </p>
            </h1>

          </div>
        </div>
        
        <div className="container ">
          <div className="row ">
            
            <div className="col-md-7  p-0 m-0">
              {cart?.map((p) => (
                <div className="row card flex-row" key={p._id}>
                  <div className="col-md-4">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      width="100%"
                      height={"130px"}
                    />
                  </div>
                  <div className="col-md-4">
                    <p>{p.name}</p>
                    <p>{p.description.substring(0, 30)}</p> 
                    <p>Price : {p.price}</p>
                  </div>
                  <div className="col-md-4 cart-remove-btn">
                    <button
                      className="btn btn-danger"
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="col-md-5 cart-summary ">
              
              <h2>Cart Summary</h2>
              
              <p>Total | Checkout | Payment</p>
              
              {/* Horizontal row */}
              <hr />
              
              {/* You directly call the function (totalPrice()) so that it calculates for everytime the page is rendered */}
              <h4>Total : {totalPrice()} </h4>
              
              {auth?.user?.address ? (   // Checks whether user has address
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}    // Redirects the user to 'user-profile' section where they can update the address 
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (      // Checks whether user is logged in or not
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (       // If the user is not logged in the button redirects them to the login page
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",          // It basically redirects us to the 'cart page' once we login.
                        })
                      }
                    >
                      Plase Login to checkout
                    </button>
                  )}
                </div>
              )}

              

            </div>

          </div>
        </div>
        
      </div>

    </Layout>
  );
};

export default CartPage;