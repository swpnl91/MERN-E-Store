import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";


const AuthContext = createContext();      // creating context

const AuthProvider = ({ children }) => {
  
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  // Setting Default 'axios' property ('headers')
  // It ensures whatever (axios) requests go, we have the 'headers' property (with the 'token' if it exists)
  // 'axios.defaults.headers.common' made available by axios
  axios.defaults.headers.common["Authorization"] = auth?.token;

  // 'useEffect' is used so that we can access the data (token) stored in 'localStorage' 
  useEffect(() => {
    const data = localStorage.getItem("auth");
    if (data) {
      const parseData = JSON.parse(data);      // converting the data from string to JSON
      setAuth({
        ...auth,
        user: parseData.user,
        token: parseData.token,
      });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );

};

// Custom Hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };