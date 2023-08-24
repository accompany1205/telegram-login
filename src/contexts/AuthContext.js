// authContext.js
import React, { createContext, useEffect, useState } from 'react';
// import { useNavigate } from "react-router-dom"

import axios from 'axios';

const AuthContext = createContext();

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = async (email, password) => {
    try {
      console.log({ email, password });
      const res = await axios.post(REACT_APP_API_URL + '/admin/login', {
        email,
        password
      });
      if (res && res.data && res.data.success) {
        console.log('asdfasdf');
        setIsLoggedIn(() => true);
        window.localStorage.setItem('isLoggedIn', true)
        console.log(isLoggedIn);
        return true;
      }
      return false;
    } catch (e) {
      console.log(2);
      return false;
    }

  };
  const register = async (email, password) => {
    console.log({ email, password });
    const res = await axios.post(REACT_APP_API_URL + '/admin/signup', {
      email,
      password
    });
    window.location.href = '/login'
    // console.log(res);
    // setIsLoggedIn(true);
  };

  const logout = () => {
    setIsLoggedIn(() => false);
    window.localStorage.removeItem('isLoggedIn');
    window.location.href = '/login';
  };

  const authContextValue = {
    isLoggedIn,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
