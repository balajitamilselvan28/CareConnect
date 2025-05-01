import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from token
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await axios.get('http://localhost:5001/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setUser(res.data.data);
        } catch (err) {
          localStorage.removeItem('token');
          setError(err.response?.data?.error || 'Error loading user');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Register user
  const register = async (userData) => {
    try {
      const res = await axios.post('http://localhost:5001/api/auth/register', userData);
      localStorage.setItem('token', res.data.token);
        // Fetch user data after registration
        try {
          const userRes = await axios.get('http://localhost:5001/api/auth/me', {
            headers: {
              Authorization: `Bearer ${res.data.token}`
            }
          });
        setUser(userRes.data.data);
        } catch (userErr) {
          console.error('Error fetching user after registration:', userErr);
        }
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || 'Error registering user');
      throw err;
    }
  };

  // Login user
  const login = async (userData) => {
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', userData);
      localStorage.setItem('token', res.data.token);
      
        // Fetch user data after login
        try {
          const userRes = await axios.get('http://localhost:5001/api/auth/me', {
            headers: {
              Authorization: `Bearer ${res.data.token}`
            }
          });
          setUser(userRes.data.data);
        return { ...res.data, userData: userRes.data.data };
        } catch (userErr) {
          console.error('Error fetching user after login:', userErr);
          throw new Error('Error fetching user data');
        }
    } catch (err) {
      setError(err.response?.data?.error || 'Error logging in');
      throw err;
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 