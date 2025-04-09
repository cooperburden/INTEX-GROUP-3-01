import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define the shape of the authentication context
interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component to wrap around the parts of the app that need access to auth state
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize `isAuthenticated` based on `localStorage`
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const storedStatus = localStorage.getItem('isLoggedIn');
    return storedStatus === 'true'; // returns true if logged in, false otherwise
  });

  // Function to handle user login
  const login = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsAuthenticated(true);
  };

  // Function to handle user logout
  const logout = async () => {
    try {
      // Call backend logout endpoint
      await fetch('https://localhost:7180/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Error during logout:', err);
    }

    localStorage.removeItem('isLoggedIn');
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the authentication context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
