import React, { useState, useEffect } from "react";
import axios from "axios";


import Layout from "../../components/Layout/Layout";





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