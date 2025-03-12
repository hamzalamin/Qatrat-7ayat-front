import React, { createContext, useContext, useState, useEffect } from "react";
import AuthService from "../services/authService";
import { axiosClient } from "../config/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (storedUser && token) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          setIsAuthenticated(true);
          axiosClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
        }
      } catch (error) {
        console.error("Failed to check authentication status", error);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
        setAuthChecked(true);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await AuthService.login(email, password);

      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", userData.token);

        axiosClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${userData.token}`;
      }
    } catch (error) {
      console.error("Login failed", error);
      throw error;
    }
  };

  const logout = () => {
    AuthService.logout();
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    delete axiosClient.defaults.headers.common["Authorization"];

    setUser(null);
    setIsAuthenticated(false);
  };

  const contextValue = {
    user,
    isAuthenticated,
    isLoading,
    authChecked,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
