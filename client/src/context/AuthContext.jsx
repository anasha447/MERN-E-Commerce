import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const existingUser = localStorage.getItem("guestUser");

    if (existingUser) {
      setUser(JSON.parse(existingUser));
    } else {
      // Auto-create guest
      fetch("http://localhost:5000/api/users/register-guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem("guestUser", JSON.stringify(data));
          setUser(data);
        })
        .catch((err) => console.error("Guest register failed", err));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
