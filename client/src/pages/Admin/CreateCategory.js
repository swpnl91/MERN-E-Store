import React, { useEffect, useState } from "react";
import Layout from "./../../components/Layout/Layout";
import AdminMenu from "./../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import CategoryForm from "../../components/Form/CategoryForm";
import { Modal } from "antd";      // 'reset.css' needs to be imported in 'index.js' after installing 'ant-design'



const CreateCategory = () => {
  
  const [categories, setCategories] = useState([]);      // several categories will be stored in an array
  const [name, setName] = useState("");                  // used for adding new category names
  const [visible, setVisible] = useState(false);        // is basically used to show/unshow the modal (overlay/pop-up window). We've used 'visible/setVisible' instead of 'isModalOpen/setIsModalOpen' as shown in ant-design's documentation
  const [selected, setSelected] = useState(null);        // is used to store the 'category' object which can then be used in the function for updation as we need the info of that particluar category in the backend
  const [updatedName, setUpdatedName] = useState("");    // used for updated names of categories

  // Function to handle Form Submission
  const handleSubmit = async (e) => {
    
    e.preventDefault();   // e -> 'event'
    
    try {
      
      const { data } = await axios.post("/api/v1/category/create-category", {
        name,   // passing the 'name' of the category as a value
      });
      
      if (data?.success) {
        toast.success(`${name} is created as a new category!`);
        getAllCategory();    // calling the 'getAllCategory' function so that once the new category is created it gets reflected in the list of categories.
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      
      console.log(error);
      
      toast.error("Something went wrong while submitting the input form");
    }
  };

  // Function to get all the categories
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-categories");
      
      if (data?.success) {
        setCategories(data?.category);     // the 'category' from 'data.category' comes from the 'res.status(200).send({...})' in 'categoryController.js'. So be mindful of the spelling mistakes.
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while fetching the categories");
    }
  };

  // When the dependency array is empty the 'useEffect' function for the very first time only. Hence, this serves to get all the categories initially.
  useEffect(() => {
    getAllCategory();
  }, []);

  // Function for updating the category
  const handleUpdate = async (e) => {
    e.preventDefault();     // done because in the end this function is handled by the 'submit' button in '<CategoryForm>'
    
    try {
      
      const { data } = await axios.put(
        `/api/v1/category/update-category/${selected._id}`,
        { name: updatedName }     // whatever needs to be updated is passed
      );
      
      if (data?.success) {
        toast.success(`${updatedName} is updated`);
        setSelected(null);     // resetting all the values 
        setUpdatedName("");
        setVisible(false);     // to close the modal (pop-up modal)
        getAllCategory();      // re-populates the list with updated categories
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong while updating the category");
    }
  };

  // Function for deleting a category
  const handleDelete = async (pId) => {
    
    try {
      
      const { data } = await axios.delete(
        `/api/v1/category/delete-category/${pId}`
      );
      
      if (data.success) {
        toast.success(`Category deleted successfully`);

        getAllCategory();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong while deleting the category.");
    }
  };


  return (
    <Layout title={"Dashboard - Create Category"}>
      <div className="container-fluid m-3 p-3 dashboard">
        <div className="row">
          
          <div className="col-md-3">
            <AdminMenu />
          </div>
          
          <div className="col-md-9">
            
            <h1>Manage Categories</h1>
            
            <div className="p-3 w-50">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}             // In this form we're passing the states that take care of adding new category names
                setValue={setName}
              />
            </div>
            
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((c) => (
                    <>
                      <tr>
                        <td key={c._id}>{c.name}</td>
                        <td>
                          <button
                            className="btn btn-primary ms-2"
                            onClick={() => {
                              setVisible(true);      // basically '<Modal>' will pop-up or get activated when we click on 'Edit' button
                              setUpdatedName(c.name);     // this means that 'updatedName' becomes the name of the category (to-be edited) which is passed in the <CategoryForm> (from <Modal>) below so that whn the modal opens up it's already populated with the category's existing name (which the user can then edit)
                              setSelected(c);     // c -> is basically a category object that includes its name, _id, etc. This essentially means - 'selected' is that category object now
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => {       // anonymous function is used because we need to pass an argument to 'handleDelete(c._id)'. Otherwise 'handleDelete' will be called even without clicking on the 'delete' button
                              handleDelete(c._id);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            
            <Modal
              onCancel={() => setVisible(false)}      // In order to close the '<Modal>'
              footer={null}
              visible={visible}        // '<Modal>' is visible when 'visible' becomes 'true'
            >
              <CategoryForm
                // basically we're re-using the 'CategoryForm' as a modal
                value={updatedName}               // In this form we're passing the states that take care of updation of category names
                setValue={setUpdatedName}            
                handleSubmit={handleUpdate}
              />
            </Modal>

          </div>

        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;