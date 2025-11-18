// app/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import api from "../utils/api";

export const AuthContext = createContext({
  user: null,
  token: null,
  login: async () => {},
  logout: async () => {},
  loading: true,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const t = await SecureStore.getItemAsync("access_token");
      if (t) {
        setToken(t);
        try {
          // fetch current user from API
          const res = await api.get("user"); // assume backend provides GET /user or similar
          setUser(res.data.user ?? res.data);
        } catch (err) {
          // token may be invalid
          await SecureStore.deleteItemAsync("access_token");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  const login = async ({ email, password, device_name = "mobile" }) => {
    const payload = { email, password, device_name };
    const res = await api.post("login-token", payload);
    // according to backend, token is in res.data.token.access_token
    const accessToken = res.data?.token?.access_token;
    const userData = res.data?.user;
    if (!accessToken) throw new Error("Token missing in response");
    await SecureStore.setItemAsync("access_token", accessToken);
    setToken(accessToken);
    setUser(userData);
    return { user: userData, token: accessToken };
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("access_token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
