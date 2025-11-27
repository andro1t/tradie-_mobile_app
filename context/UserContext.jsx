import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  // Load saved user on app start
  useEffect(() => {
    const loadUser = async () => {
      try {
        const saved = await AsyncStorage.getItem("userData");
        if (saved) setUserData(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading user:", e);
      }
    };
    loadUser();
  }, []);

  const saveUser = async (data) => {
    setUserData(data);
    await AsyncStorage.setItem("userData", JSON.stringify(data));
  };

  const logoutUser = async () => {
    setUserData(null);
    await AsyncStorage.removeItem("userData");
  };

  return (
    <UserContext.Provider value={{ userData, saveUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
