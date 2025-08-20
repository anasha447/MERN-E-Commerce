import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const API_URL = "http://localhost:5000/api";

const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const userInfoFromStorage = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : null;
    setUserInfo(userInfoFromStorage);
  }, []);

  const login = async (email, password) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${API_URL}/users/login`,
        { email, password },
        config
      );
      setUserInfo(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUserInfo(null);
  };

  const register = async (name, email, password) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${API_URL}/users/register`,
        { name, email, password },
        config
      );
      setUserInfo(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, AuthContext };
