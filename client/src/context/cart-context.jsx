import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";

const API_URL = "http://localhost:5000/api";
const STORAGE_KEY = "cart_v1";

const keyFrom = (product) => `${product.id}__${product.variant || "default"}`;

function cartReducer(state, action) {
  switch (action.type) {
    case "SET_CART":
      return { ...state, items: action.payload.items };
    case "ADD": {
      const { product, qty } = action.payload;
      toast.success(`✅ ${product.name} added to cart!`);
      const key = keyFrom(product);
      const existing = state.items.find((item) => item.key === key);
      let updatedItems;
      if (existing) {
        updatedItems = state.items.map((item) =>
          item.key === key ? { ...item, qty: item.qty + qty } : item
        );
      } else {
        updatedItems = [...state.items, { key, ...product, qty }];
      }
      return { ...state, items: updatedItems };
    }
    case "SET_QTY": {
      const { key, qty } = action.payload;
      return {
        ...state,
        items: state.items
          .map((item) => (item.key === key ? { ...item, qty: Math.max(1, qty) } : item))
          .filter((item) => item.qty > 0),
      };
    }
    case "REMOVE":
      toast.error("❌ Item removed from cart.");
      return {
        ...state,
        items: state.items.filter((item) => item.key !== action.payload.key),
      };
    case "CLEAR":
      toast.info("🛒 Cart cleared.");
      return { ...state, items: [] };
    default:
      return state;
  }
}

function initCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch {
    return { items: [] };
  }
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, initCart);
  const authCtx = useContext(AuthContext);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const userInfo = authCtx ? authCtx.userInfo : null;
    const syncCart = async () => {
      if (userInfo && !userInfo.isAdmin) {
        try {
          const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
          await axios.post(`${API_URL}/users/cart`, { cart: state.items }, config);
        } catch (error) {
          console.error("Failed to sync cart to DB:", error);
        }
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }
    };
    syncCart();
  }, [state.items, authCtx]);

  const { itemCount, subtotal } = useMemo(() => {
    const itemCount = state.items.reduce((total, item) => total + item.qty, 0);
    const subtotal = state.items.reduce((sum, item) => sum + item.price * item.qty, 0);
    return { itemCount, subtotal };
  }, [state.items]);

  const mergeCarts = async (token) => {
    try {
      const guestCartRaw = localStorage.getItem(STORAGE_KEY);
      const guestCart = guestCartRaw ? JSON.parse(guestCartRaw).items : [];
      if (guestCart.length === 0) return;

      const config = { headers: { Authorization: `Bearer ${token}` } };
      const { data: dbCart } = await axios.get(`${API_URL}/users/cart`, config);

      const mergedCartMap = new Map();
      dbCart.forEach(item => mergedCartMap.set(item.key, item));
      guestCart.forEach(guestItem => {
        if (mergedCartMap.has(guestItem.key)) {
          mergedCartMap.get(guestItem.key).qty += guestItem.qty;
        } else {
          mergedCartMap.set(guestItem.key, guestItem);
        }
      });
      const mergedCart = Array.from(mergedCartMap.values());

      await axios.post(`${API_URL}/users/cart`, { cart: mergedCart }, config);
      dispatch({ type: "SET_CART", payload: { items: mergedCart } });

      toast.info("Your guest cart items have been merged with your account cart.");
      localStorage.removeItem(STORAGE_KEY);

    } catch (error) {
      console.error("Failed to merge carts:", error);
      toast.error("Could not merge carts.");
    }
  };

  const addToCart = (product, qty = 1) => dispatch({ type: "ADD", payload: { product, qty } });
  const setQty = (key, qty) => dispatch({ type: "SET_QTY", payload: { key, qty } });
  const removeFromCart = (key) => dispatch({ type: "REMOVE", payload: { key } });
  const clearCart = () => dispatch({ type: "CLEAR" });

  const value = {
    items: state.items,
    itemCount,
    subtotal,
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
    mergeCarts,
    setCart: (items) => dispatch({ type: "SET_CART", payload: { items } }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider />");
  return ctx;
};

export default CartContext;
