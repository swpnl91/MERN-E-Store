import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";       // For displaying/selecting dropdown menu items 
const { Option } = Select;




const AdminOrders = () => {
  
  const [status, setStatus] = useState([
    "Not Processed",
    "Processing",              // Same as 'enum' from orderModel.js
    "Shipped",
    "Delivered",
    "Cancelled",
  ]);
  const [changeStatus, setChangeStatus] = useState("");
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();

  // Function for getting all user-orders as an Admin
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/auth/all-orders");
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect() to call 'getOrders()' initially
  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  // Function for handling the changes made in the order status
  const handleChange = async (orderId, value) => {
    try {
      
      const { data } = await axios.put(`/api/v1/auth/order-status/${orderId}`, {
        status: value,
      });
      
      getOrders();    // Calling the function again to get the orders with the updated status
    } catch (error) {
      console.log(error);
    }
  };


  return (

    <Layout title={"All Orders Data"}>
      <div className="row dashboard">
        
        <div className="col-md-3">
          <AdminMenu />
        </div>
        
        <div className="col-md-9">
          
          <h1 className="text-center">All User-Orders</h1>
          
          {orders?.map((o, i) => {
            return (
              <div className="border shadow" key={i}>
                <table className="table">
                  
                  <thead>
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Status</th>
                      <th scope="col">Buyer</th>
                      <th scope="col">Date</th>
                      <th scope="col">Payment</th>
                      <th scope="col">Quantity</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr>
                      <td>{i + 1}</td>
                      <td>
                        <Select
                          bordered={false}
                          onChange={(value) => handleChange(o._id, value)}    // Comes from the 'value' in <Option />
                          defaultValue={o?.status}
                        >
                          {status.map((s, i) => (
                            // The 'value' below, is what's being sent to 'onChange' in <Select />
                            <Option key={i} value={s}>
                              {s}
                            </Option>
                          ))}
                        </Select>
                      </td>
                      <td>{o?.buyer?.name}</td>
                      <td>{moment(o?.createAt).fromNow()}</td>
                      <td>{o?.payment.success ? "Success" : "Failed"}</td>
                      <td>{o?.products?.length}</td>
                    </tr>
                  </tbody>

                </table>
                
                <div className="container">
                  
                  {o?.products?.map((p, i) => (
                    <div className="row mb-2 p-3 card flex-row" key={p._id}>
                      
                      <div className="col-md-4">
                        <img
                          src={`/api/v1/product/product-photo/${p._id}`}
                          className="card-img-top"
                          alt={p.name}
                          width="100px"
                          height={"100px"}
                        />
                      </div>

                      <div className="col-md-8">
                        <p>{p.name}</p>
                        <p>{p.description.substring(0, 30)}</p>
                        <p>Price : {p.price}</p>
                      </div>

                    </div>
                  ))}

                </div>

              </div>
            );
          })}

        </div>
        
      </div>
    </Layout>
  );
};

export default AdminOrders;