import React, { createContext, useState, useEffect } from "react";

export const AppContext = createContext({});

const getUserDetailsFromLocalStorage = () => {
  return {
    token: localStorage.getItem("token") || null,
    userType: localStorage.getItem("userType"),
    email: localStorage.getItem("email"),
    sites: localStorage.getItem("sites") || [],
  };
};

const AppContextProvider = ({ children }) => {
  const [user, setUser] = useState(getUserDetailsFromLocalStorage);

  const saveUser = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem("token", loggedInUser.token);
    localStorage.setItem("userType", loggedInUser.userType);
    localStorage.setItem("sites", loggedInUser.sites);
    localStorage.setItem("email", loggedInUser.email);
  }

  const clearUser = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('email');
    setUser({ ...user, token: null });
  }

  return (
    <AppContext.Provider value={{ user, saveUser, clearUser }}>
      {children}
    </AppContext.Provider>
  );
}

export default AppContextProvider;
