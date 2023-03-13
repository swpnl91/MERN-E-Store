import { useState, useContext, createContext } from "react";


const SearchContext = createContext();    // creating context

const SearchProvider = ({ children }) => {
  
  const [auth, setAuth] = useState({
    keyword: "",
    results: [],
  });

  return (
    <SearchContext.Provider value={[auth, setAuth]}>
      {children}
    </SearchContext.Provider>
  );
};

// Custom hook
const useSearch = () => useContext(SearchContext);

export { useSearch, SearchProvider };