import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";





const AdminOrders = () => {
  
  


  return (

    <Layout title={"All Orders Data"}>
      <div className="row dashboard">
        
        <div className="col-md-3">
          <AdminMenu />
        </div>
        
        
        
      </div>
    </Layout>
  );
};

export default AdminOrders;