import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";



const Profile = () => {
  
  // Getting the context
  const [auth, setAuth] = useAuth();

  // State constants
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Get user data
  useEffect(() => {
    const { email, name, phone, address } = auth?.user;      // Getting user from 'auth' context
    setName(name);
    setPhone(phone);
    setEmail(email);
    setAddress(address);
  }, [auth?.user]);

  // Form submit function
  const handleSubmit = async (e) => {
    
    e.preventDefault();
    
    try {
      
      const { data } = await axios.put("/api/v1/auth/profile", {
        name,
        email,
        password,
        phone,
        address,
      });
      
      if (data?.error) {
        toast.error(data?.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        
        let ls = localStorage.getItem("auth");    // We're getting whatever's stored in localStorage under 'auth'
        
        ls = JSON.parse(ls);    // We parse it so as to use it normally as it's stored as a string in localStorage
        
        ls.user = data.updatedUser;      // We update only the user as we also have token which is not to be touched 
        
        localStorage.setItem("auth", JSON.stringify(ls));  // We store it again in the localStorage as a string
        
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      
      console.log(error);
      toast.error("Something went wrong while updating the profile");
    }
  };



  return (
    <Layout title={"Your Profile"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          
          <div className="col-md-3">
            <UserMenu />
          </div>

          <div className="col-md-8">
            <div className="form-container" style={{ marginTop: "-40px" }}>
              
              <form onSubmit={handleSubmit}>
                
                <h4 className="title">USER PROFILE</h4>
                
                <div className="mb-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    id="exampleInputName1"
                    placeholder="Enter Your Name"
                    autoFocus
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="form-control"
                    id="exampleInputEmail1"
                    placeholder="Enter Your Email "
                    disabled     // So that it cannot be edited
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
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control"
                    id="exampleInputPhone1"
                    placeholder="Enter Your Phone #"
                  />
                </div>

                <div className="mb-3">
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="form-control"
                    id="exampleInputAddress1"
                    placeholder="Enter Your Address"
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  UPDATE
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;