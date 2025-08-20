import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

/* ================================
   Constants & Helpers
================================ */
const STORAGE_KEY = "cart_v1";
const keyFrom = (product) => `${product.id}__${product.variant || "default"}`;

/* ================================
   Reducer
================================ */
function cartReducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { product, qty } = action.payload;
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

      return {
        ...state,
        items: updatedItems,
        alert: `✅ ${product.name} added to cart!`,
      };
    }

    case "SET_QTY": {
      const { key, qty } = action.payload;
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.key === key ? { ...item, qty: Math.max(1, qty) } : item
          )
          .filter((item) => item.qty > 0),
      };
    }

    case "REMOVE":
      return {
        ...state,
        items: state.items.filter((item) => item.key !== action.payload.key),
        alert: "❌ Item removed from cart.",
      };

    case "CLEAR":
      return { ...state, items: [], alert: "🛒 Cart cleared." };

    case "CLEAR_ALERT":
      return { ...state, alert: null };

    default:
      return state;
  }
}

/* ================================
   Initial State Loader
================================ */
function initCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { items: [], alert: null };
  } catch {
    return { items: [], alert: null };
  }
}

/* ================================
   Context Setup
================================ */
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, initCart);

  /* Persist cart to localStorage */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  /* Auto-clear alert after 1.5s */
  useEffect(() => {
    if (state.alert) {
      const timer = setTimeout(() => {
        dispatch({ type: "CLEAR_ALERT" });
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.alert]);

  /* Derived Values */
  const { itemCount, subtotal } = useMemo(() => {
    const itemCount = state.items.reduce((total, item) => total + item.qty, 0);
    const subtotal = state.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
    return { itemCount, subtotal };
  }, [state.items]);

  /* Actions */
  const addToCart = (product, qty = 1) =>
    dispatch({ type: "ADD", payload: { product, qty } });

  const setQty = (key, qty) =>
    dispatch({ type: "SET_QTY", payload: { key, qty } });

  const removeFromCart = (key) =>
    dispatch({ type: "REMOVE", payload: { key } });

  const clearCart = () => dispatch({ type: "CLEAR" });

  /* Context Value */
  const value = {
    items: state.items,
    itemCount,
    subtotal,
    alert: state.alert, // 👈 now available
    addToCart,
    setQty,
    removeFromCart,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

/* Hook to Use Cart Context */
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside <CartProvider />");
  }
  return ctx;
};
export default CartContext;
