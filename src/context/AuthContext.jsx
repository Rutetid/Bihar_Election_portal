import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const login = (username, password, role) => {
    // Hard-coded credentials
    const validCredentials = {
      admin: { username: "admin", password: "1234", role: "admin" },
      "presiding-officer": {
        username: "officer",
        password: "1234",
        role: "presiding-officer",
      },
    };

    const expectedCredentials = validCredentials[role];

    if (
      expectedCredentials &&
      username === expectedCredentials.username &&
      password === expectedCredentials.password
    ) {
      const userData = {
        username,
        role,
        loginTime: new Date().toISOString(),
      };
      setUser(userData);
      setIsAuthenticated(true);

      // Store in localStorage for persistence
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true };
    }

    return { success: false, error: "Invalid credentials" };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
  };

  // Check for existing session on app load
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false); // Set loading to false after checking localStorage
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
