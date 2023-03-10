import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";


const Spinner = ({ path = "login" }) => {       // So 'path' is passed as an argument. If it doesn't have a value then "login" is assigned as an initial value/default value.
  
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    const interval = setInterval(() => {         // 'count' is used to show timer and hence 'setInterval' is used to decrease its value every 1 second 
      setCount((prevValue) => --prevValue);
    }, 1000);

    count === 0 &&            // If 'count === 0' it redirects you to whatever path you want using 'navigate'
      navigate(`/${path}`, {           // The dynamic '/${path}' basically takes the user to whatever value that is assigned to the 'path'. You wouldn't want the user to be redirected to the login page when the user is already logged in. 
        state: location.pathname,       // 'location.pathname' gives you the current pathname (where the user is). This is done for seamless user experience as the user should be guided to wherever he/she was before logging in (AFTER they log in)
      });
      
    return () => clearInterval(interval);
  }, [count, navigate, location, path]);

  return (
    <>
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <h1 className="Text-center">Redirecting in {count}</h1>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </>
  );
};

export default Spinner;