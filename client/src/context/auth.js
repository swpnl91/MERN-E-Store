import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";


const AuthContext = createContext();      // creating context

const AuthProvider = ({ children }) => {
  
  const [auth, setAuth] = useState({
    user: null,
    token: "",
  });

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );

};

// Custom Hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };