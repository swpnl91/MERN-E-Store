import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
const { Option } = Select;



const CreateProduct = () => {
  



  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          
          

        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;