import { useState, useContext, createContext, useEffect } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  
  const [cart, setCart] = useState([]);

  useEffect(() => {
    let existingCartItem = localStorage.getItem("cart");           // makes use of localStorage to store items in cart
    if (existingCartItem) setCart(JSON.parse(existingCartItem));   // if there's something stored in 'cart' in localStorage then it sets the cart
  }, []);

  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
const useCart = () => useContext(CartContext);

export { useCart, CartProvider };