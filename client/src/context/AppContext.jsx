/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

// 1. Create context
export const AppContext = createContext();

// 2. Provider component
export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // 3. Global states
  const [user, setUser] = useState(true);
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [currency, setCurrency] = useState("$");

  const [searchQuery, setSearchQuery] = useState({});

  // 4. Load products (in real app, you'd use fetch/axios)
  const fetchProducts = async () => {
    setProducts(dummyProducts);
  };

  // 5. Add to cart
  const addToCart = (itemId) => {
    const cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);
    toast.success("Added to cart");
  };

  // 6. Update item quantity in cart
  const updateCartItem = (itemId, quantity) => {
    const cartData = structuredClone(cartItems);

    if (quantity <= 0) {
      delete cartData[itemId];
    } else {
      cartData[itemId] = quantity;
    }

    setCartItems(cartData);
    toast.success("Cart updated");
  };

  // 7. Remove from cart (decrease quantity by 1)
  const removeFromCart = (itemId) => {
    const cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] -= 1;

      if (cartData[itemId] <= 0) {
        delete cartData[itemId];
      }

      setCartItems(cartData);
      toast.success("Removed from cart");
    }
  };

  // 8. Load products when the app starts
  useEffect(() => {
    fetchProducts();
  }, []);

  // 9. Shared context value
  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    currency,
    setCurrency,
    searchQuery,
    setSearchQuery,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// 10. Custom hook to access the store
export const useAppContext = () => {
  return useContext(AppContext);
};
