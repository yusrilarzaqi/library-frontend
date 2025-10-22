import { createContext, useContext, useEffect, useState } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user);
    }
    setIsLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const user = await authService.register(userData);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response.data.message };
    }
  };

  const login = async (userData) => {
    try {
      const user = await authService.login(userData);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response.data.message };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
