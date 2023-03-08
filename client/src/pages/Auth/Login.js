import React, { useState } from "react";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import "../../styles/AuthStyles.css";
import { useAuth } from "../../context/auth";



const Login = () => {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();      // we get it from 'auth.js' in 'context' 

  const navigate = useNavigate();
  const location = useLocation();

  // Form Submit Handler Function
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/v1/auth/login", {     // we send 'email', 'password' in 'req.body' to backend (authController.js - POST Login)
        email,
        password,
      });
      if (res && res.data.success) {        // if 'res' exists and 'res.data.success' is true
        toast.success(res.data && res.data.message);
        setAuth({              // we're setting the state in context (auth.js)
          ...auth,
          user: res.data.user,
          token: res.data.token,        // 'res.data.token' comes from backend (authController.js - POST Login)
        });
        localStorage.setItem("auth", JSON.stringify(res.data));          // the token needs to be stored in the 'localStorage' as it's lost when the user refreshes the page. The data also needs to be converted to a string as 'localStorage' doesn't support JSON data.
        navigate(location.state || "/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };  


  return (
    <Layout title="Login - E-Store">
      <div className="form-container " style={{ minHeight: "90vh" }}>
        <form onSubmit={handleSubmit}>
          <h4 className="title">LOGIN</h4>

          <div className="mb-3">
            <input
              type="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              id="exampleInputEmail1"
              placeholder="Enter Your Email "
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              id="exampleInputPassword1"
              placeholder="Enter Your Password"
              required
            />
          </div>
          <div className="mb-3">
            <button
              type="button"
              className="btn forgot-btn"
              onClick={() => {
                navigate("/forgot-password");
              }}
            >
              Forgot Password
            </button>
          </div>

          <button type="submit" className="btn btn-primary">
            LOGIN
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default Login;