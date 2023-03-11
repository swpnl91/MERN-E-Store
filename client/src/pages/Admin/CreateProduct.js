import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";     // Gave an error for the order in which it was imported
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import UserMenu from '../../components/Layout/UserMenu';
const { Option } = Select;     // Comes from 'ant-design'. Will be used to create dropdown menu




const CreateProduct = () => {
  
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);      // To get all the existing categories (that are then stored in an array) 
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");          // Singular because we'll be using it to assign a 'category' to the product that's to be created 
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");          // Need to figure out something for 'shipping' *****************************
  const [photo, setPhoto] = useState("");

  // Getting all the categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-categories");
      if (data?.success) {
        setCategories(data?.category);    // 'data?.category' is optional chaining. Basically it means IF 'data' exists THEN 'setCategories(data.category)'
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while getting categories");
    }
  };

  // 'useEffect' function to get all the categories initially
  useEffect(() => {
    getAllCategory();
  }, []);

  // Function for handling the creation of a product 
  const handleCreate = async (e) => {
    
    e.preventDefault();
    
    try {
      
      const productData = new FormData();         // We get 'FormData' from the browser
      productData.append("name", name);           // Stores it as 'key-value' pair
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("photo", photo);
      productData.append("category", category);

      const { data } = await axios.post(           // don't forget the 'await' keyword and destructuring of 'data'
        "/api/v1/product/create-product",
        productData
      );
      
      if (data?.success) {
        toast.success("Product Created Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while creating the product.");
    }
  };



  return (
    <Layout title={"Dashboard - Create Product"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          
          <div className="col-md-3">
            <AdminMenu />
          </div>

          <div className="col-md-9">
            
            <h1>Create Product</h1>
            
            <div className="m-1 w-75">
              
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"    // bootstrap className 'mb-3' -> margin from bottom
                onChange={(value) => {          // 'value' comes from ant-design. It's basically the value chosen from the dropdown menu and comes from 'value' in '<Option />'.
                  setCategory(value);           // 'onChange' helps us to get that 'value' and assign it to the product to be created.
                }}
              >
                {categories?.map((c) => (
                  // We're using the 'value' prop in '<Option />' to use the 'id' of the category based on which we'll update it (it's used in 'onChange' in '<Select />' above to 'setCategory()').
                  <Option key={c._id} value={c._id}>     
                    {c.name}
                  </Option>
                ))}
              </Select>

              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"    // ONLY 'images' ar accepted. '*' means any type of image ('png', 'jpg', 'jpeg' etc.)
                    onChange={(e) => setPhoto(e.target.files[0])}    // Unlike the 'value' prop in '<Select />' above, we get 'e'(event) with '<input />'. So to get the value/file we've to access 'e.target.files[0]' (as it's an image we've to access the 'files' array and its first element)
                    hidden     // 'hidden' attribute added to this 'input' field
                  />
                </label>
              </div>

              <div className="mb-3">
                {photo && (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}   // We get the 'URL' property from the browser
                      alt="product_photo"                // This whole <div> takes care of the image preview (image that has been chosen) 
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>

              <div className="mb-3">
                <input
                  type="text"
                  value={name}
                  placeholder="Name of the product"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <textarea
                  type="text"
                  value={description}
                  placeholder="Product description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="Price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="Product quantity"
                  className="form-control"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <Select
                  bordered={false}
                  placeholder="Shipping"
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => {
                    setShipping(value);
                  }}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>

              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleCreate}>
                  CREATE PRODUCT
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;