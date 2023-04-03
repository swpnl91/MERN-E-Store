import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import DropIn from "braintree-web-drop-in-react";
// import { AiFillWarning } from "react-icons/ai";        // Not being used
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";




const CartPage = () => {
  
  const [auth, setAuth] = useAuth();     // For checking whether the user is logged in or not
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");    // For getting/setting the client token for payment gateway 
  const [instance, setInstance] = useState("");          // We'll be getting this from 'braintree-web-drop-in-react' as well
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

  // Function to calculate total price of the products in the cart
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.map((item) => {
        return total = total + item.price;
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

  // Function for handling payments
  const handlePayment = async () => {
    try {
      setLoading(true);
      
      const { nonce } = await instance.requestPaymentMethod();       // 'instance' has 'requestPaymentMethod()' method that gives us 'nonce'
      
      // const { data } = await axios.post("/api/v1/product/braintree/payment", {      // 'data' isn't being used
      //   nonce,        // We send 'nonce' and 'cart'
      //   cart,
      // });

      await axios.post("/api/v1/product/braintree/payment", {
        nonce,        // We send 'nonce' and 'cart'
        cart,
      });
      
      setLoading(false);
      
      localStorage.removeItem("cart");       // Once payment is done we remove it from 'localStorage' 
      
      setCart([]);                      // Once payment is done we 'setCart' (context) to an empty array 
      
      navigate("/dashboard/user/orders");
      
      toast.success("Payment Completed Successfully ");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };



  return (

    <Layout>
      
      <div className="cart-page">
        
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
        
        <div className="container cart-content">
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
                      className="btn remove"
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
                      className="btn update-address"
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
                      className="btn update-address"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (       // If the user is not logged in the button redirects them to the login page
                    <button
                      className="btn update-address"
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

              <div className="mt-2">
                {!clientToken || !auth?.token || !cart?.length ? (     // If there is no 'clientToken', no 'auth?.token' and no items in 'cart' then render " '' " (nothing)
                  "" 
                ) : (
                  <>
                    <DropIn
                      options={{
                        authorization: clientToken,       // This is how '<DropIn />' works
                        paypal: {
                          flow: "vault",
                        },
                      }}
                      onInstance={(instance) => setInstance(instance)}
                    />

                    <button
                      className="btn payment"
                      onClick={handlePayment}
                      disabled={loading || !instance || !auth?.user?.address}      // Basically if 'loading' is true 'disabled' will also be true. If 'instance' is true 'disabled' would false.
                    >
                      {loading ? "Processing ...." : "Make Payment"}
                    </button>
                  </>
                )}
              </div>

            </div>

          </div>
        </div>
        
      </div>

    </Layout>
  );
};

export default CartPage;