import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";


import axios from "axios";
import toast from "react-hot-toast";





const CartPage = () => {
  
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [clientToken, setClientToken] = useState("");
  const [instance, setInstance] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  


  return (

    <Layout>
      
      <div className=" cart-page">
        
        <div className="row">
          <div className="col-md-12">
            
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest!"
                : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You have ${cart.length} item/items in your cart ${
                      auth?.token ? "" : "Please login to checkout!"
                    }`
                  : " Your Cart Is Empty"}
              </p>
            </h1>

          </div>
        </div>

        

      </div>

    </Layout>
  );
};

export default CartPage;