import React, { useState, useEffect } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
const { Option } = Select;



///////////// Problem - Need to refresh/reload the page to see the updated photo. Change isn't reflected immediately.     AND ALSO SHIPPING?!

const UpdateProduct = () => {
  

  const navigate = useNavigate();
  const params = useParams();
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState("");     // Shipping can be changed to yes/no depending on the option chosen in the dropdown menu while updating the product
  const [photo, setPhoto] = useState(null);
  const [id, setId] = useState("");        // This is basically used to get the product id and when the page is rendered (using the getSingleProduct function) so that we can use the product id in the urls. 

  // Function for getting a single product
  const getSingleProduct = async () => {
    
    try {
      
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`       // getting the 'slug' from the URL using 'params'
      );


      setName(data.product.name);
      setId(data.product._id);
      setDescription(data.product.description);
      setPrice(data.product.price);
      setQuantity(data.product.quantity);
      setShipping(data.product.shipping);
      setCategory(data.product.category);        // Note that 'data.product.category' is an object which means 'category' becomes an object and 'setCategory()' sets its value to an object. You can set it to an 'id' (setCategory(data.product.category._id)) as well.
      
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while getting the product details.");
    }
  };

  // useEffect() to call 'getSingleProduct()' so that we get the details of the product initially 
  useEffect(() => {
    getSingleProduct();
    //eslint-disable-next-line
  }, []);

  // Function for getting all the categories
  const getAllCategory = async () => {
    
    try {
      
      const { data } = await axios.get("/api/v1/category/get-categories");
      
      if (data?.success) {
        setCategories(data?.category);      // Here 'data.category' is an array (of categories)
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while getting the categories.");
    }
  };

  // useEffect() to call 'getAllCategory()' so that we get all the categories initially 
  useEffect(() => {
    getAllCategory();
  }, []);

  // Function for updating a product
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    try {
      
      const productData = new FormData();

      // All the previous values for the following (name, description, quantity etc.) are already pre-populated. So we only need to send them (and not check whether they were changed or not) even if the admin changes only a few fields and not all. 

      // Kept getting an error regarding 'getting categories' every time the code was edited and saved. Mostly because of the type of the value that was being assigned to 'category'. It's assigned a category object initially and then a 'string' with category id.
      if( (typeof category === "object" || typeof category === 'function') ){
        productData.append("category", category._id);  // IF category is an object we append accordingly as we need to send the 'id' of the category
      } else {
        productData.append("category", category);
      }


      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      photo && productData.append("photo", photo);      // photo is appended ONLY IF it exists
      
      const { data } = await axios.put(
        `/api/v1/product/update-product/${id}`,
        productData
      );

      
      if (data?.success) {
        toast.success("Product Updated Successfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error(data?.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while updating the product.");
    }
  };

  // Function for deleting a product
  const handleDelete = async () => {
    
    try {
      let answer = window.prompt("Are you sure you want to delete this product? Type 'y' or hit 'cancel'.");
      
      if (!answer) return;
      
      const { data } = await axios.delete(
        `/api/v1/product/delete-product/${id}`
      );
      
      toast.success("Product Deleted Successfully");
      navigate("/dashboard/admin/products");
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while deleting the product.");
    }
  };



  return (
    <Layout title={"Dashboard - Update Product"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          
          <div className="col-md-3">
            <AdminMenu />
          </div>
          
          <div className="col-md-9">
            
            <h1>Update Product</h1>
            
            <div className="m-1 w-75">
              
              <Select
                bordered={false}
                placeholder="Select a category"
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {              
                  setCategory(value);       // This 'value' is the 'c._id' (comes from the 'value' of <Option />) of the category. Once we set the category using 'setCategory(value)', 'category' becomes the 'c._id' and no longer remains the object that was initialized before
                }}
                value={category.name}     // since 'category' is an object (before onChange() is executed) we use its 'name' property to assign the default value INITIALLY
              >
                {categories?.map((c) => (
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
                    name="photo"              // pretty much the same functionality from CreateProduct.js
                    accept="image/*"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    hidden
                  />
                </label>
              </div>
              
              <div className="mb-3">
                {photo ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}     // pretty much the same functionality from CreateProduct.js
                      alt="product_photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <img
                      src={id && `/api/v1/product/product-photo/${id}`}    // Kept getting an error for 'couldn't proxy request for "/api/v1/product/product-photo/"...' Hence added the condition. Assigns the url ONLY IF 'id' exists.
                      alt="product_photo"
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
                  placeholder="write a name"
                  className="form-control"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              
              <div className="mb-3">
                <textarea
                  type="text"
                  value={description}
                  placeholder="write a description"
                  className="form-control"
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  value={price}
                  placeholder="write a Price"
                  className="form-control"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              
              <div className="mb-3">
                <input
                  type="number"
                  value={quantity}
                  placeholder="write a quantity"
                  className="form-control"
                  onChange={(e) => setQuantity(e.target.value)}
                />
              </div>
              
              <div className="mb-3">
                <Select
                  bordered={false}
                  placeholder="Select Shipping "
                  size="large"
                  showSearch
                  className="form-select mb-3"
                  onChange={(value) => {
                    setShipping(value);
                  }}
                  value={shipping ? "yes" : "No"}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>

              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleUpdate}>
                  UPDATE PRODUCT
                </button>
              </div>

              <div className="mb-3">
                <button className="btn btn-danger" onClick={handleDelete}>
                  DELETE PRODUCT
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </Layout>
  );
};

export default UpdateProduct;